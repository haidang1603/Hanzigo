import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

// Ground Truth Benchmark Dataset: 32 diverse queries across 8 categories
const BENCHMARK_QUERIES = [
  // 1. Tiếng Việt thông dụng
  { id: 'Q01', query: 'xin chào', category: 'Vietnamese', targetChar: '你好' },
  { id: 'Q02', query: 'cảm ơn', category: 'Vietnamese', targetChar: '谢谢' },
  { id: 'Q03', query: 'tạm biệt', category: 'Vietnamese', targetChar: '再见' },
  { id: 'Q04', query: 'bác sĩ', category: 'Vietnamese', targetChar: '医生' },

  // 2. Tiếng Trung giản thể
  { id: 'Q05', query: '你好', category: 'Chinese Simplified', targetChar: '你好' },
  { id: 'Q06', query: '谢谢', category: 'Chinese Simplified', targetChar: '谢谢' },
  { id: 'Q07', query: '老师', category: 'Chinese Simplified', targetChar: '老师' },
  { id: 'Q08', query: '学生', category: 'Chinese Simplified', targetChar: '学生' },

  // 3. Pinyin có dấu
  { id: 'Q09', query: 'nǐ hǎo', category: 'Pinyin with tones', targetChar: '你好' },
  { id: 'Q10', query: 'xièxie', category: 'Pinyin with tones', targetChar: '谢谢' },
  { id: 'Q11', query: 'zàijiàn', category: 'Pinyin with tones', targetChar: '再见' },
  { id: 'Q12', query: 'lǎoshī', category: 'Pinyin with tones', targetChar: '老师' },

  // 4. Pinyin không dấu
  { id: 'Q13', query: 'ni hao', category: 'Pinyin without tones', targetChar: '你好' },
  { id: 'Q14', query: 'xiexie', category: 'Pinyin without tones', targetChar: '谢谢' },
  { id: 'Q15', query: 'xuexi', category: 'Pinyin without tones', targetChar: '学习' },
  { id: 'Q16', query: 'yisheng', category: 'Pinyin without tones', targetChar: '医生' },

  // 5. Từ vựng chuyên đề
  { id: 'Q17', query: 'bệnh viện', category: 'Vocabulary', targetChar: '医院' },
  { id: 'Q18', query: 'trường học', category: 'Vocabulary', targetChar: '学校' },
  { id: 'Q19', query: 'thời gian', category: 'Vocabulary', targetChar: '时间' },
  { id: 'Q20', query: 'bạn bè', category: 'Vocabulary', targetChar: '朋友' },

  // 6. Ngữ pháp & Mẫu câu
  { id: 'Q21', query: 'câu chữ 把', category: 'Grammar', targetChar: '把' },
  { id: 'Q22', query: 'câu chữ 被', category: 'Grammar', targetChar: '被' },
  { id: 'Q23', query: 'so sánh hơn 比', category: 'Grammar', targetChar: '比' },
  { id: 'Q24', query: 'ngữ khí trợ từ 了', category: 'Grammar', targetChar: '了' },

  // 7. Câu hỏi HSK
  { id: 'Q25', query: 'cách hỏi giá tiền bao nhiêu tiền', category: 'HSK Context', targetChar: '多少' },
  { id: 'Q26', query: 'cách hỏi đi đâu ở đâu', category: 'HSK Context', targetChar: '哪儿' },
  { id: 'Q27', query: 'hỏi nguyên nhân tại sao', category: 'HSK Context', targetChar: '为什么' },
  { id: 'Q28', query: 'chúc mừng sinh nhật', category: 'HSK Context', targetChar: '生日' },

  // 8. Ngữ nghĩa trừu tượng / không trùng trực tiếp từ khóa
  { id: 'Q29', query: 'người chữa bệnh cứu người', category: 'Semantic Non-keyword', targetChar: '医生' },
  { id: 'Q30', query: 'nơi học sinh đến học chữ mỗi ngày', category: 'Semantic Non-keyword', targetChar: '学校' },
  { id: 'Q31', query: 'chào buổi sáng tốt lành', category: 'Semantic Non-keyword', targetChar: '早上' },
  { id: 'Q32', query: 'muốn đi rửa tay vệ sinh', category: 'Semantic Non-keyword', targetChar: '洗手间' }
];

async function runBenchmark() {
  console.log('================================================================');
  console.log('RAG QUALITY BENCHMARK (32 DIVERSE GROUND TRUTH QUERIES)');
  console.log('================================================================\n');

  // Step 1: Audit Vector Storage Health
  console.log('Auditing rag_knowledge_chunks table...');
  const { data: chunks, error: cErr } = await adminClient
    .from('rag_knowledge_chunks')
    .select('id, simplified, chunk_type, embedding');

  if (cErr) {
    console.error('Failed to read chunks:', cErr);
    return;
  }

  const totalChunks = chunks.length;
  const nullEmbeddings = chunks.filter(c => !c.embedding).length;
  console.log(`Total chunks: ${totalChunks} | Null embeddings: ${nullEmbeddings}`);

  // Step 2: Run Benchmark Queries
  let hitsAt3 = 0;
  let hitsAt5 = 0;
  let mrrSum = 0;
  let latencies = [];
  const queryLogs = [];

  for (const item of BENCHMARK_QUERIES) {
    const t0 = performance.now();
    const { data, error } = await anonClient.rpc('match_rag_knowledge', {
      query_text: item.query,
      match_count: 5
    });
    const lat = performance.now() - t0;
    latencies.push(lat);

    if (error) {
      console.log(`[${item.id}] FAIL - ${item.query}: RPC Error ${error.message}`);
      queryLogs.push({ ...item, status: 'ERROR', error: error.message });
      continue;
    }

    const recalled = data || [];
    // Check rank of target
    let rank = 0;
    for (let i = 0; i < recalled.length; i++) {
      const match = recalled[i];
      if (
        (match.simplified && match.simplified.includes(item.targetChar)) ||
        (match.vietnamese_meaning && match.vietnamese_meaning.toLowerCase().includes(item.query.toLowerCase()))
      ) {
        rank = i + 1;
        break;
      }
    }

    if (rank > 0 && rank <= 3) hitsAt3++;
    if (rank > 0 && rank <= 5) hitsAt5++;
    if (rank > 0) mrrSum += 1 / rank;

    const topHit = recalled[0] ? `${recalled[0].simplified} (${recalled[0].pinyin})` : 'None';
    console.log(`[${item.id}] [${item.category}] "${item.query}" -> Target: "${item.targetChar}" | Rank: ${rank || 'Miss'} | Latency: ${lat.toFixed(1)}ms | Top: ${topHit}`);

    queryLogs.push({
      id: item.id,
      category: item.category,
      query: item.query,
      target: item.targetChar,
      rank: rank || null,
      hitTop3: rank > 0 && rank <= 3,
      hitTop5: rank > 0 && rank <= 5,
      latencyMs: Number(lat.toFixed(1)),
      topRecalled: topHit
    });
  }

  const N = BENCHMARK_QUERIES.length;
  const recallAt3 = (hitsAt3 / N) * 100;
  const recallAt5 = (hitsAt5 / N) * 100;
  const mrr = (mrrSum / N).toFixed(3);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);

  console.log('\n================================================================');
  console.log('RAG BENCHMARK EVALUATION SUMMARY:');
  console.log(`  - Total Queries Tested:  ${N}`);
  console.log(`  - Recall@3:              ${recallAt3.toFixed(1)}% (${hitsAt3}/${N})`);
  console.log(`  - Recall@5:              ${recallAt5.toFixed(1)}% (${hitsAt5}/${N})`);
  console.log(`  - Mean Reciprocal Rank:  ${mrr}`);
  console.log(`  - Average Latency:       ${avgLatency} ms`);
  console.log('================================================================\n');
}

runBenchmark();

