/**
 * =========================================================================
 * HANZI GO - UNIFIED AI GRADING HANDLER (HSKK, WRITING, TRANSLATION)
 * =========================================================================
 * Chấm điểm ngữ nghĩa & ngữ âm thực tế qua Gemini AI (temperature: 0.1)
 * cho các bài thi tự luận / nói / dịch thuật thay cho heuristic đếm từ khóa.
 * =========================================================================
 */

import { getGeminiApiKeys, markGeminiKeyRateLimited } from '../../_utils/aiProviderAdapter.js';

async function callGeminiJson({ systemInstruction, parts }) {
  const apiKeys = getGeminiApiKeys();
  if (apiKeys.length === 0 && process.env.VITE_GEMINI_API_KEY) {
    apiKeys.push(process.env.VITE_GEMINI_API_KEY);
  }
  if (apiKeys.length === 0) {
    throw new Error('NO_GEMINI_KEY');
  }

  const geminiModel = (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').replace(/^models\//, '');
  const payload = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  let response = null;
  for (const currentKey of apiKeys) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${currentKey}`;
    response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 400) break;
    if (response.status === 429 || response.status === 403) {
      markGeminiKeyRateLimited(currentKey);
    }
  }

  if (!response || !response.ok) {
    const details = response ? await response.text().catch(() => '') : '';
    throw new Error(`GEMINI_ERROR_${response?.status || 500}:${details}`);
  }

  const data = await response.json();
  const rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawOutput) {
    throw new Error('EMPTY_GEMINI_RESPONSE');
  }

  const cleaned = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ chấp nhận POST' });

  try {
    const body = req.body || {};
    const { type } = body;

    if (type === 'hskk') {
      const {
        promptZh = '',
        promptVi = '',
        taskType = '',
        level = 'beginner',
        expectedKeywords = [],
        transcript = '',
        audioBase64 = null,
        mimeType = 'audio/webm',
      } = body;

      const systemInstruction = `Bạn là giám khảo khảo thí HSKK (汉语水平口语考试) chuẩn quốc tế.
Chấm điểm phần trả lời nói của thí sinh một cách khách quan, công bằng và bám sát trình độ HSKK (${level}).
Chấp nhận từ đồng nghĩa và cách diễn đạt tự nhiên khác miễn đúng ngữ pháp và trả lời đúng trọng tâm câu hỏi.
Chỉ trả về JSON thuần túy.`;

      const parts = [];
      if (audioBase64 && typeof audioBase64 === 'string') {
        parts.push({
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: audioBase64.replace(/^data:[^;]+;base64,/, ''),
          },
        });
      }
      parts.push({
        text: `Đề bài HSKK (${taskType}):
- Tiếng Trung: "${promptZh}"
- Yêu cầu tiếng Việt: "${promptVi}"
- Ý trọng tâm tham khảo: ${JSON.stringify(expectedKeywords)}
- Transcript ASR thí sinh nói: "${transcript || '(trống)'}"

Trả về JSON:
{
  "score": <số nguyên 0..100>,
  "accuracyScore": <0..100>,
  "fluencyScore": <0..100>,
  "toneScore": <0..100>,
  "feedbackVi": "<nhận xét chi tiết bằng tiếng Việt: ưu điểm, lỗi ngữ pháp/từ vựng/thanh điệu và gợi ý nâng điểm>"
}`,
      });

      const result = await callGeminiJson({ systemInstruction, parts });
      return res.status(200).json({ success: true, result });
    }

    if (type === 'writing') {
      const { task = {}, responseText = '' } = body;
      if (!String(responseText).trim()) {
        return res.status(400).json({ error: 'Thiếu nội dung bài viết (responseText)' });
      }

      const systemInstruction = `Bạn là giám khảo chấm thi viết HSK ${task.hskLevel || 5} chuẩn CTI/Hanban.
Chấm công bằng theo 4 tiêu chí (mỗi tiêu chí 0..25 điểm). Chấp nhận diễn đạt tự nhiên và từ đồng nghĩa hợp ngữ cảnh.
Đối với HSK 6 缩写 (tóm tắt), trừ điểm nếu dùng ngôi thứ nhất ("我认为", "我觉得") hoặc chép nguyên văn đoạn đọc.
Chỉ trả về JSON thuần túy.`;

      const userText = `Đề bài (${task.taskType || 'writing'}):
- Hướng dẫn: ${task.instructionVi || ''}
- Đề: ${task.promptText || ''}
- Từ khóa bắt buộc: ${JSON.stringify(task.mandatoryKeywords || [])}
- Độ dài mục tiêu: ${task.targetMinChars || 0} - ${task.targetMaxChars || 200} chữ Hán
${task.passageText ? `- Đoạn văn gốc (HSK 6):\n${task.passageText}\n` : ''}
Bài làm của học viên:
"${responseText}"

Trả về đúng JSON:
{
  "dimensions": {
    "task_fulfillment": <0..25>,
    "grammar_accuracy": <0..25>,
    "vocabulary_richness": <0..25>,
    "coherence_cohesion": <0..25>
  },
  "inline_corrections": [
    {
      "original_span": "<đoạn sai trong bài viết>",
      "corrected_span": "<đoạn sửa đúng>",
      "error_category": "<grammar_structure | word_choice | collocation | punctuation | register_style>",
      "explanation_vi": "<giải thích ngắn bằng tiếng Việt>",
      "hsk_grammar_point": "<tên điểm ngữ pháp HSK liên quan>"
    }
  ],
  "model_rewrites": {
    "band_pass": "<bài sửa đạt chuẩn đậu gọn gàng giữ ý học viên>",
    "high_scoring_native": "<bài mẫu điểm cao tự nhiên như người bản xứ>"
  }
}`;

      const result = await callGeminiJson({
        systemInstruction,
        parts: [{ text: userText }],
      });
      return res.status(200).json({ success: true, result });
    }

    if (type === 'translation') {
      const {
        sourceText = '',
        direction = 'vi_to_zh',
        requiredKeywords = [],
        referenceTranslations = [],
        userOutput = '',
      } = body;

      if (!String(userOutput).trim()) {
        return res.status(400).json({ error: 'Thiếu bản dịch (userOutput)' });
      }

      const systemInstruction = `Bạn là chuyên gia biên phiên dịch Trung - Việt (chuẩn HSK 3.0 / HSK 7-9).
Chấm bản dịch theo ngữ nghĩa thực tế: chấp nhận từ đồng nghĩa và cấu trúc tương đương tự nhiên, không bắt bẻ máy móc nếu đúng nghĩa và đúng văn phong.
Chỉ trả về JSON thuần túy.`;

      const userText = `Hướng dịch: ${direction === 'vi_to_zh' ? 'Việt -> Trung' : 'Trung -> Việt'}
Câu gốc: "${sourceText}"
Từ khóa gợi ý: ${JSON.stringify(requiredKeywords)}
Bản dịch tham khảo: ${JSON.stringify(referenceTranslations)}
Bản dịch của học viên: "${userOutput}"

Trả về đúng JSON:
{
  "overall_score": <0..100>,
  "accuracy_score": <0..100>,
  "grammar_score": <0..100>,
  "naturalness_score": <0..100>,
  "corrected_version": "<bản sửa chính xác giữ văn phong học viên>",
  "superior_native_version": "<bản dịch tự nhiên, chuẩn xác nhất>",
  "detailed_feedback_vi": "<nhận xét chi tiết bằng tiếng Việt về độ sát nghĩa, ngữ pháp và lựa chọn từ>"
}`;

      const result = await callGeminiJson({
        systemInstruction,
        parts: [{ text: userText }],
      });
      return res.status(200).json({ success: true, result });
    }

    if (type === 'dictionary') {
      const { query = '', contextSentence = '' } = body;
      const cleanQuery = String(query).trim();
      if (!cleanQuery) {
        return res.status(400).json({ error: 'Thiếu từ hoặc câu cần tra (query)' });
      }

      const systemInstruction = `Bạn là từ điển Hán-Việt & chuyên gia ngữ pháp tiếng Trung HSK.
Khi người học bôi đen một từ vựng, thành ngữ HOẶC cả một câu/cụm từ tiếng Trung, hãy phân tích chính xác Pinyin, âm Hán-Việt, nghĩa tiếng Việt, từ loại, ví dụ minh họa và giải thích ngữ pháp ngắn gọn.
Chỉ trả về JSON thuần túy.`;

      const userText = `Nội dung cần tra: "${cleanQuery}"
${contextSentence && contextSentence !== cleanQuery ? `Ngữ cảnh câu: "${contextSentence}"` : ''}

Trả về đúng JSON:
{
  "simplified": "${cleanQuery}",
  "traditional": "<chữ phồn thể>",
  "pinyin_display": "<pinyin có dấu thanh điệu>",
  "pinyin_numeric": "<pinyin số>",
  "pinyin_clean": "<pinyin không dấu>",
  "han_viet": "<âm Hán-Việt viết hoa chữ cái đầu nếu có>",
  "hsk_2_level": <số nguyên 1..6 hoặc null>,
  "hsk_3_level": <số nguyên 1..9 hoặc null>,
  "pos_meanings": [
    {
      "pos": "<n | v | adj | adv | phrase | idiom | other>",
      "definitions_vi": ["<nghĩa tiếng Việt chính xác, tự nhiên>"],
      "definitions_en": ["<English meaning>"],
      "collocations": ["<cụm từ đi kèm nếu có>"]
    }
  ],
  "examples": [
    {
      "hanzi": "<câu ví dụ tiếng Trung>",
      "pinyin": "<pinyin>",
      "vi": "<dịch tiếng Việt>"
    }
  ],
  "etymology_note": "<giải thích ngắn cấu trúc từ / ngữ pháp của cụm hoặc câu này bằng tiếng Việt>"
}`;

      const result = await callGeminiJson({
        systemInstruction,
        parts: [{ text: userText }],
      });
      return res.status(200).json({ success: true, result });
    }

    return res.status(400).json({ error: `Loại chấm điểm không hợp lệ: ${type}` });
  } catch (err) {
    const status = err?.message === 'NO_GEMINI_KEY' ? 503 : 500;
    return res.status(status).json({ error: err?.message || 'Lỗi AI grading' });
  }
}
