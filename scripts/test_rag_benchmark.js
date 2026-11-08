import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, anonKey);
const admin = createClient(url, serviceKey);

async function testRag() {
  console.log('=== BENCHMARKING RAG RETRIEVAL (match_rag_knowledge) ===\n');

  // Test 1: Lexical queries across Vietnamese, Chinese, and Pinyin
  const queries = [
    { text: 'xin chào', lang: 'Vietnamese' },
    { text: '你好', lang: 'Chinese' },
    { text: 'xuexi', lang: 'Pinyin' },
    { text: 'ngữ pháp', lang: 'Vietnamese' },
    { text: '老师', lang: 'Chinese' }
  ];

  for (const q of queries) {
    const t0 = performance.now();
    const { data, error } = await supabase.rpc('match_rag_knowledge', {
      query_text: q.text,
      match_count: 3
    });
    const durationMs = (performance.now() - t0).toFixed(1);

    if (error) {
      console.log(`  ❌ Query [${q.lang}: "${q.text}"] Error: ${error.message}`);
    } else {
      console.log(`  ✅ Query [${q.lang}: "${q.text}"] Latency: ${durationMs}ms | Recall: ${data.length} chunks`);
      if (data.length > 0) {
        console.log(`     Top match: ${data[0].simplified} (${data[0].pinyin}) - ${data[0].vietnamese_meaning} | Hybrid: ${data[0].hybrid_score}`);
      }
    }
  }

  // Test 2: Vector embedding search using an actual 768-dim embedding from an existing chunk
  const { data: sampleChunk } = await admin
    .from('rag_knowledge_chunks')
    .select('id, simplified, embedding')
    .not('embedding', 'is', null)
    .limit(1);

  if (sampleChunk && sampleChunk[0]?.embedding) {
    const t0 = performance.now();
    const { data: vecResults, error: vecErr } = await supabase.rpc('match_rag_knowledge', {
      query_embedding: sampleChunk[0].embedding,
      match_count: 5
    });
    const durationMs = (performance.now() - t0).toFixed(1);

    if (vecErr) {
      console.log(`  ❌ Vector Search Error: ${vecErr.message}`);
    } else {
      console.log(`\n  ✅ Vector Search (768-dim) Latency: ${durationMs}ms | Recall: ${vecResults.length} chunks`);
      if (vecResults.length > 0) {
        console.log(`     Top 1: ${vecResults[0].simplified} (${vecResults[0].pinyin}) | Similarity: ${vecResults[0].similarity_score}`);
        console.log(`     Top 2: ${vecResults[1]?.simplified} (${vecResults[1]?.pinyin}) | Similarity: ${vecResults[1]?.similarity_score}`);
        console.log(`     Top 3: ${vecResults[2]?.simplified} (${vecResults[2]?.pinyin}) | Similarity: ${vecResults[2]?.similarity_score}`);
      }
    }
  }
}

testRag();

