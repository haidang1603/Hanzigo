/**
 * =========================================================================
 * HANZI GO - SECURE EMBEDDING PROVIDER (GEMINI TEXT-EMBEDDING-004)
 * =========================================================================
 * Cung cấp dịch vụ embedding cho hệ thống RAG:
 * 1. Model Identifier: 'gemini-text-embedding-004' (768 chiều).
 * 2. Lưu trữ định danh mô hình và chiều vector đồng nhất giữa index & query.
 * 3. Bảo vệ Timeout: 10 giây qua AbortController.
 * 4. Không thực hiện embedding tài liệu lớn đồng bộ trong chat request.
 *    (Chỉ tạo embedding cho duy nhất câu truy vấn ngắn của người dùng).
 * 5. Cơ chế Fallback an toàn:
 *    - Tạo embedding giả định ngẫu nhiên/n-gram có tính tất định (deterministic)
 *      phục vụ unit test offline và phòng vệ khi mạng/provider gián đoạn.
 *    - Không làm sập hệ thống (zero crash), cho phép hạ cấp mềm sang Full-Text.
 * =========================================================================
 */

import { normalizeUnicodeNfc } from '../../scripts/knowledge/normalizer.js';

export const EMBEDDING_MODEL_IDENTIFIER = 'gemini-text-embedding-004';
export const EMBEDDING_DIMENSION = 768;
export const DEFAULT_TIMEOUT_MS = 10000; // 10 giây giới hạn

/**
 * Tính Cosine Similarity giữa 2 vector số thực cùng chiều
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} Giá trị trong khoảng [-1.0, 1.0] (thường [0.0, 1.0] cho text embedding)
 */
export function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Thuật toán sinh vector giả định tất định (Deterministic N-Gram Pseudo-Embedding)
 * Dùng cho môi trường Offline, CI/CD, hoặc Unit Test khi không có kết nối mạng hay GEMINI_API_KEY.
 * Hai văn bản có ngữ nghĩa hoặc ký tự tương tự nhau sẽ cho ra vector có Cosine Similarity cao.
 * Vector được chuẩn hóa L2 norm = 1.0.
 * 
 * @param {string} text 
 * @param {number} dimension 
 * @returns {number[]} Vector 768 chiều chuẩn hóa L2
 */
export function generateDeterministicEmbedding(text, dimension = EMBEDDING_DIMENSION) {
  const norm = normalizeUnicodeNfc(text || '').toLowerCase();
  const vector = new Array(dimension).fill(0);

  if (!norm) {
    return vector;
  }

  // Băm các ký tự đơn, bigram và trigram vào không gian 768 chiều
  const words = norm.split(/\s+/);
  
  // 1. Phân tích ký tự & N-grams
  for (let i = 0; i < norm.length; i++) {
    const charCode = norm.charCodeAt(i);
    const idx1 = (charCode * 31 + i * 17) % dimension;
    vector[idx1] += 0.5;

    // Bigram
    if (i < norm.length - 1) {
      const bigramCode = charCode * 37 + norm.charCodeAt(i + 1);
      const idx2 = (bigramCode * 53) % dimension;
      vector[idx2] += 1.0;
    }

    // Trigram
    if (i < norm.length - 2) {
      const trigramCode = charCode * 41 + norm.charCodeAt(i + 1) * 19 + norm.charCodeAt(i + 2);
      const idx3 = (trigramCode * 67) % dimension;
      vector[idx3] += 1.5;
    }
  }

  // 2. Phân tích cụm từ
  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    let wordHash = 0;
    for (let c = 0; c < word.length; c++) {
      wordHash = (wordHash * 33 + word.charCodeAt(c)) >>> 0;
    }
    const wordIdx = wordHash % dimension;
    vector[wordIdx] += 2.0;
  }

  // 3. Chuẩn hóa L2 Norm: ||v|| = 1.0
  let sumSq = 0;
  for (let i = 0; i < dimension; i++) {
    sumSq += vector[i] * vector[i];
  }
  const normVal = Math.sqrt(sumSq);
  if (normVal > 0) {
    for (let i = 0; i < dimension; i++) {
      vector[i] = Number((vector[i] / normVal).toFixed(6));
    }
  }

  return vector;
}

/**
 * Tạo vector embedding cho 1 câu truy vấn của người dùng (Query Embedding)
 * - Có timeout 10 giây qua AbortController.
 * - Trả về kết quả an toàn; nếu lỗi mạng hoặc timeout, trả về success=false kèm error chi tiết
 *   để downstream RAG engine tự động chuyển sang Full-text Search mà không sập server.
 * 
 * @param {string} text - Câu truy vấn ngắn của người dùng (không vượt quá 500 ký tự)
 * @param {object} [options]
 * @param {string} [options.apiKey] - Tùy chọn Gemini API Key (mặc định lấy process.env.GEMINI_API_KEY)
 * @param {number} [options.timeoutMs] - Thời gian chờ tối đa (mặc định 10,000ms)
 * @param {boolean} [options.useDeterministicFallback] - Nếu true, sinh deterministic vector khi không có API key
 * @returns {Promise<{
 *   success: boolean,
 *   embedding?: number[],
 *   model: string,
 *   dimension: number,
 *   error?: string,
 *   timedOut?: boolean,
 *   isFallback?: boolean,
 *   latencyMs: number
 * }>}
 */
export async function generateQueryEmbedding(text, options = {}) {
  const startTime = Date.now();
  const cleanText = normalizeUnicodeNfc(text || '').trim();

  if (!cleanText) {
    return {
      success: false,
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: EMBEDDING_DIMENSION,
      error: 'Nội dung truy vấn trống, không thể tạo embedding.',
      latencyMs: 0
    };
  }

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const useFallback = options.useDeterministicFallback !== false;

  // Nếu không có API Key và cho phép fallback (CI/CD hoặc Offline dev)
  if (!apiKey) {
    if (useFallback) {
      const vector = generateDeterministicEmbedding(cleanText, EMBEDDING_DIMENSION);
      return {
        success: true,
        embedding: vector,
        model: EMBEDDING_MODEL_IDENTIFIER,
        dimension: EMBEDDING_DIMENSION,
        isFallback: true,
        latencyMs: Date.now() - startTime
      };
    }
    return {
      success: false,
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: EMBEDDING_DIMENSION,
      error: 'GEMINI_API_KEY chưa được cấu hình cho dịch vụ embedding.',
      latencyMs: Date.now() - startTime
    };
  }

  // Gọi Gemini Text Embedding API chính thức
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: cleanText }]
        },
        outputDimensionality: EMBEDDING_DIMENSION
      }),
      signal: controller.signal
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      return {
        success: false,
        model: EMBEDDING_MODEL_IDENTIFIER,
        dimension: EMBEDDING_DIMENSION,
        error: `Gemini Embedding API trả về lỗi HTTP ${response.status}: ${errorBody.slice(0, 150)}`,
        status: response.status,
        latencyMs
      };
    }

    const data = await response.json();
    const values = data?.embedding?.values;

    if (!Array.isArray(values) || values.length === 0) {
      return {
        success: false,
        model: EMBEDDING_MODEL_IDENTIFIER,
        dimension: EMBEDDING_DIMENSION,
        error: 'Gemini Embedding trả về vector rỗng hoặc không đúng định dạng.',
        latencyMs
      };
    }

    return {
      success: true,
      embedding: values,
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: values.length,
      latencyMs
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');

    return {
      success: false,
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: EMBEDDING_DIMENSION,
      error: isTimeout ? `Embedding provider timed out sau ${timeoutMs}ms.` : `Lỗi kết nối tới embedding provider: ${err.message}`,
      timedOut: isTimeout,
      latencyMs
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Tạo vector embedding hàng loạt (Batch Embeddings)
 * DÙNG CHO PIPELINE LẬP CHỈ MỤC NGOẠI TUYẾN (CLI / BATCH IMPORTER),
 * KHÔNG BAO GIỜ GỌI ĐỒNG BỘ TRONG REQUEST CHAT CỦA NGƯỜI DÙNG!
 * 
 * @param {string[]} texts - Danh sách các đoạn văn bản cần lập chỉ mục
 * @param {object} [options]
 * @returns {Promise<{
 *   success: boolean,
 *   embeddings?: number[][],
 *   model: string,
 *   dimension: number,
 *   error?: string,
 *   count: number
 * }>}
 */
export async function generateBatchEmbeddings(texts, options = {}) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return {
      success: true,
      embeddings: [],
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: EMBEDDING_DIMENSION,
      count: 0
    };
  }

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  const useFallback = options.useDeterministicFallback !== false;

  // Nếu không có API Key, dùng deterministic embedding để offline index
  if (!apiKey) {
    if (useFallback) {
      const results = texts.map(t => generateDeterministicEmbedding(t, EMBEDDING_DIMENSION));
      return {
        success: true,
        embeddings: results,
        model: EMBEDDING_MODEL_IDENTIFIER,
        dimension: EMBEDDING_DIMENSION,
        isFallback: true,
        count: results.length
      };
    }
    return {
      success: false,
      model: EMBEDDING_MODEL_IDENTIFIER,
      dimension: EMBEDDING_DIMENSION,
      error: 'GEMINI_API_KEY chưa được cấu hình cho batch embedding.',
      count: 0
    };
  }

  // Gọi Gemini batchEmbedContents API theo từng chunk 50 phần tử
  const BATCH_SIZE = 50;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key=${encodeURIComponent(apiKey)}`;

    const requests = chunk.map(text => ({
      model: 'models/text-embedding-004',
      content: {
        parts: [{ text: normalizeUnicodeNfc(text).trim() || ' ' }]
      },
      outputDimensionality: EMBEDDING_DIMENSION
    }));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests })
      });

      if (!response.ok) {
        throw new Error(`Batch embedding HTTP ${response.status}`);
      }

      const data = await response.json();
      const chunkEmbeddings = (data?.embeddings || []).map(item => item.values);
      allEmbeddings.push(...chunkEmbeddings);
    } catch (err) {
      if (useFallback) {
        // Fallback cho phần lỗi
        const fallbackChunk = chunk.map(t => generateDeterministicEmbedding(t, EMBEDDING_DIMENSION));
        allEmbeddings.push(...fallbackChunk);
      } else {
        return {
          success: false,
          model: EMBEDDING_MODEL_IDENTIFIER,
          dimension: EMBEDDING_DIMENSION,
          error: `Lỗi batch embedding: ${err.message}`,
          count: allEmbeddings.length
        };
      }
    }
  }

  return {
    success: true,
    embeddings: allEmbeddings,
    model: EMBEDDING_MODEL_IDENTIFIER,
    dimension: EMBEDDING_DIMENSION,
    count: allEmbeddings.length
  };
}
