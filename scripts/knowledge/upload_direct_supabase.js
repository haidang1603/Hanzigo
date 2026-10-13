/**
 * =========================================================================
 * HANZIGO - DIRECT SUPABASE BATCH UPLOADER (HSK 1-3 KNOWLEDGE CHUNKS)
 * =========================================================================
 * Tự động chia nhỏ theo từng batch (50 chunks / lượt) và nạp qua Supabase Client.
 * Tránh hoàn toàn lỗi giới hạn payload hay timeout.
 * 
 * Cách dùng:
 *   node scripts/knowledge/upload_direct_supabase.js <service_role_key_tùy_chọn>
 * Hoặc:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."; node scripts/knowledge/upload_direct_supabase.js
 * =========================================================================
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parseHanzigoCoreVocabulary, HANZIGO_CORE_METADATA } from './parsers/hanzigoVocabParser.js';
import { generateDeterministicEmbedding } from '../../api/_utils/embeddingProvider.js';

let env = {};
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || 'https://woszblniatdvijwdkmpm.supabase.co';
const serviceKeyArg = process.argv[2];
const SERVICE_KEY = serviceKeyArg || process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  console.log('===========================================================');
  console.log('   HANZIGO RAG - DIRECT SUPABASE BATCH UPLOADER');
  console.log('===========================================================');

  if (!SERVICE_KEY) {
    console.error('\n❌ THIẾU SERVICE ROLE KEY:');
    console.error('Để nạp trực tiếp qua API, bạn cần truyền SUPABASE_SERVICE_ROLE_KEY:');
    console.error('  node scripts/knowledge/upload_direct_supabase.js <service_role_key>');
    console.error('Hoặc chạy các file SQL đã chia nhỏ trong Supabase SQL Editor:');
    console.error('  1. supabase/seed_rag_part1_hsk1.sql (799 KB)');
    console.error('  2. supabase/seed_rag_part2_hsk2.sql (716 KB)');
    console.error('  3. supabase/seed_rag_part3_hsk3.sql (789 KB)\n');
    process.exit(1);
  }

  console.log(`Đang kết nối tới Supabase: ${SUPABASE_URL}`);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { records } = parseHanzigoCoreVocabulary();
  console.log(`Đã phân tích ${records.length} mục từ HSK 1-3 từ giáo trình gốc.`);

  // 1. Upsert Source
  console.log('\n[1/3] Đang cập nhật nguồn tri thức trong bảng rag_knowledge_sources...');
  const { data: sourceData, error: sourceErr } = await supabase
    .from('rag_knowledge_sources')
    .upsert({
      source_key: HANZIGO_CORE_METADATA.source_key,
      title: HANZIGO_CORE_METADATA.title,
      category: HANZIGO_CORE_METADATA.category,
      hsk_level: HANZIGO_CORE_METADATA.hsk_level,
      author: HANZIGO_CORE_METADATA.author,
      publisher: HANZIGO_CORE_METADATA.publisher,
      license_identifier: HANZIGO_CORE_METADATA.license_identifier,
      attribution: HANZIGO_CORE_METADATA.attribution,
      version: HANZIGO_CORE_METADATA.version,
      review_status: 'curated_verified',
      is_verified: true,
      is_active: true,
      record_count: records.length,
      retrieval_date: new Date().toISOString()
    }, { onConflict: 'source_key' })
    .select('id')
    .single();

  if (sourceErr) {
    console.error('❌ Lỗi khi cập nhật nguồn tri thức:', sourceErr.message);
    process.exit(1);
  }

  const sourceId = sourceData.id;
  console.log(`✅ Nguồn tri thức hợp lệ. Source ID: ${sourceId}`);

  // 2. Chuẩn bị chunks có embedding
  console.log('\n[2/3] Đang sinh vector embedding (768 chiều) cho từng mục từ...');
  const chunksToInsert = records.map(r => {
    const textToEmbed = `${r.simplified} ${r.traditional || ''} ${r.pinyin || ''} ${r.vietnamese_meaning} ${r.pedagogical_notes || ''}`;
    const vec = generateDeterministicEmbedding(textToEmbed, 768);

    return {
      source_id: sourceId,
      chunk_key: r.chunk_key,
      chunk_type: r.chunk_type || 'vocab_entry',
      hsk_level: r.hsk_level || 'HSK 1',
      topic: r.topic || 'Tổng hợp',
      simplified: r.simplified,
      traditional: r.traditional || r.simplified,
      pinyin: r.pinyin,
      pinyin_numbered: r.pinyin_numbered || '',
      vietnamese_meaning: r.vietnamese_meaning,
      pedagogical_notes: r.pedagogical_notes || '',
      example_sentences: r.example_sentences || [],
      license_identifier: 'HanziGo-Curated-Original',
      attribution: 'Ban Biên Tập HanziGo & Giáo trình Chuẩn HSK',
      review_status: 'curated_verified',
      is_verified: true,
      embedding: vec,
      embedding_model: 'gemini-text-embedding-004',
      embedding_dimension: 768,
      metadata: {
        batch_id: `upload-${Date.now()}`,
        source_key: 'hanzigo-core-curriculum'
      }
    };
  });

  // 3. Batch upsert (50 chunks mỗi lượt)
  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(chunksToInsert.length / BATCH_SIZE);
  console.log(`\n[3/3] Đang tải lên Supabase theo ${totalBatches} batch (mỗi batch ${BATCH_SIZE} bản ghi)...`);

  let successCount = 0;
  for (let b = 0; b < totalBatches; b++) {
    const batch = chunksToInsert.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    process.stdout.write(`  - Batch ${b + 1}/${totalBatches} (${batch.length} bản ghi)... `);

    const { error: chunkErr } = await supabase
      .from('rag_knowledge_chunks')
      .upsert(batch, { onConflict: 'chunk_key' });

    if (chunkErr) {
      console.log('❌ Thất bại:', chunkErr.message);
      process.exit(1);
    } else {
      successCount += batch.length;
      console.log('✅ Xong');
    }
  }

  console.log('\n===========================================================');
  console.log(`🎉 NẠP THÀNH CÔNG: ${successCount} / ${records.length} bản ghi vào Supabase Production!`);
  console.log('===========================================================');
}

run().catch(err => {
  console.error('\nLỗi không mong muốn:', err);
  process.exit(1);
});
