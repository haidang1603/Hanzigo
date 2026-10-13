#!/usr/bin/env node
/**
 * =========================================================================
 * HANZIGO - KNOWLEDGE PIPELINE CLI RUNNER
 * =========================================================================
 * Sử dụng:
 *   node scripts/knowledge/cli.js --source=cedict --file=path/to/cedict.u8 [--dry-run] [--preview]
 *   node scripts/knowledge/cli.js --source=curriculum --file=path/to/curriculum.json [--dry-run]
 *   node scripts/knowledge/cli.js --rollback --source=source_key [--batch=batch_id]
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import { parseCcCedictContent, CC_CEDICT_METADATA } from './parsers/ccCedictParser.js';
import { parseCurriculumVocabulary, parseCurriculumGrammar, CURRICULUM_METADATA } from './parsers/curriculumParser.js';
import { parseHanzigoCoreVocabulary, HANZIGO_CORE_METADATA } from './parsers/hanzigoVocabParser.js';
import { executeKnowledgeImport, executeKnowledgeRollback } from './importer.js';
import { getSupabaseAdminClient } from '../../api/_utils/supabaseServer.js';

function parseCliArgs() {
  const args = process.argv.slice(2);
  const options = {
    source: null,
    file: null,
    dryRun: false,
    preview: false,
    rollback: false,
    batch: null,
    dest: 'memory'
  };

  args.forEach(arg => {
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--preview') options.preview = true;
    else if (arg === '--rollback') options.rollback = true;
    else if (arg.startsWith('--source=')) options.source = arg.split('=')[1];
    else if (arg.startsWith('--file=')) options.file = arg.split('=')[1];
    else if (arg.startsWith('--batch=')) options.batch = arg.split('=')[1];
    else if (arg.startsWith('--dest=')) options.dest = arg.split('=')[1];
  });

  return options;
}

async function run() {
  const options = parseCliArgs();

  console.log('===========================================================');
  console.log('   HANZIGO KNOWLEDGE DATASET PIPELINE (INGESTION CLI)');
  console.log('===========================================================');

  if (options.rollback) {
    if (!options.source) {
      console.error('Lỗi: Yêu cầu chỉ định --source=<source_key> khi rollback.');
      process.exit(1);
    }
    console.log(`Đang rollback dữ liệu cho source: "${options.source}"...`);
    const result = executeKnowledgeRollback({ sourceKey: options.source, batchId: options.batch });
    console.log('Kết quả rollback:', result);
    return;
  }

  if (!options.source) {
    console.log('Hướng dẫn sử dụng:');
    console.log('  node scripts/knowledge/cli.js --source=hanzigo-core [--dry-run] [--preview] [--dest=supabase]');
    console.log('  node scripts/knowledge/cli.js --source=cedict --file=scripts/knowledge/fixtures/sample_cedict.u8 [--dry-run]');
    console.log('  node scripts/knowledge/cli.js --source=curriculum --file=scripts/knowledge/fixtures/sample_curriculum.json [--dry-run]');
    console.log('  node scripts/knowledge/cli.js --rollback --source=<source_key>');
    process.exit(0);
  }

  let sourceMetadata = null;
  let records = [];
  let rawContent = '';

  if (options.source === 'hanzigo-core') {
    sourceMetadata = HANZIGO_CORE_METADATA;
    const parsed = parseHanzigoCoreVocabulary();
    records = parsed.records;
    rawContent = JSON.stringify(records);
    console.log(`Đã nạp HanziGo Core Curriculum: ${records.length} mục từ HSK 1-3 hợp lệ (${parsed.errors.length} lỗi).`);
  } else if (options.source === 'cedict') {
    if (!options.file) {
      console.error('Lỗi: Nguồn cedict yêu cầu tham số --file=<path>');
      process.exit(1);
    }
    const filePath = path.resolve(process.cwd(), options.file);
    if (!fs.existsSync(filePath)) {
      console.error(`Lỗi: Không tìm thấy tệp: ${filePath}`);
      process.exit(1);
    }
    rawContent = fs.readFileSync(filePath, 'utf8');
    sourceMetadata = CC_CEDICT_METADATA;
    const parsed = parseCcCedictContent(rawContent);
    records = parsed.records;
    console.log(`Đã đọc CC-CEDICT: ${parsed.totalLines} dòng, ${parsed.commentLines} chú thích, ${records.length} mục từ hợp lệ.`);
  } else if (options.source === 'curriculum') {
    if (!options.file) {
      console.error('Lỗi: Nguồn curriculum yêu cầu tham số --file=<path>');
      process.exit(1);
    }
    const filePath = path.resolve(process.cwd(), options.file);
    if (!fs.existsSync(filePath)) {
      console.error(`Lỗi: Không tìm thấy tệp: ${filePath}`);
      process.exit(1);
    }
    rawContent = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(rawContent);
    sourceMetadata = json.sourceMetadata || CURRICULUM_METADATA;
    const vocabParsed = parseCurriculumVocabulary(json.vocabulary || []);
    const grammarParsed = parseCurriculumGrammar(json.lessons || []);
    records = [...vocabParsed.records, ...grammarParsed.records];
    console.log(`Đã đọc Curriculum: ${vocabParsed.records.length} từ vựng, ${grammarParsed.records.length} ngữ pháp.`);
  } else {
    console.error(`Lỗi: Nguồn không hỗ trợ: "${options.source}". Chọn "hanzigo-core", "cedict" hoặc "curriculum".`);
    process.exit(1);
  }

  console.log(`\nChế độ chạy: ${options.preview ? 'PREVIEW' : options.dryRun ? 'DRY-RUN (Thẩm định)' : 'OFFICIAL IMPORT'}`);
  console.log(`Giấy phép nguồn: ${sourceMetadata.license_identifier} (Attribution: ${sourceMetadata.attribution})`);
  console.log(`Mục tiêu lưu trữ: ${options.dest === 'supabase' ? 'Supabase PostgreSQL' : 'In-Memory / Local Store'}`);

  // Kiểm tra quyền ghi Supabase nếu người dùng chọn --dest=supabase
  if (options.dest === 'supabase') {
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    if (!hasServiceKey) {
      console.warn('\n⚠️  CẢNH BÁO BẢO MẬT & QUYỀN HẠN:');
      console.warn('Môi trường hiện tại CHƯA CÓ "SUPABASE_SERVICE_ROLE_KEY".');
      console.warn('Bảng PostgreSQL "rag_knowledge_chunks" đang được bảo vệ bởi RLS (Row-Level Security) và từ chối quyền ghi từ Anon Key.');
      console.warn('Để nạp dữ liệu thật vào Supabase Production, Chủ dự án cần thiết lập:');
      console.warn('  export SUPABASE_SERVICE_ROLE_KEY=<service_role_key_tu_supabase_dashboard>');
      console.warn('Sau đó chạy lại lệnh: node scripts/knowledge/cli.js --source=hanzigo-core --dest=supabase\n');

      if (!options.dryRun && !options.preview) {
        console.error('❌ Dừng thao tác ghi trực tiếp vì thiếu quyền hạn để vượt qua RLS an toàn.');
        process.exit(1);
      }
    }
  }

  const report = await executeKnowledgeImport({
    sourceMetadata,
    rawRecords: records,
    dryRun: options.dryRun,
    preview: options.preview,
    rawContentForChecksum: rawContent
  });

  console.log('\n--- BÁO CÁO KẾT QUẢ IMPORT ---');
  console.log(JSON.stringify(report, null, 2));
}

run().catch(err => {
  console.error('Thực thi pipeline thất bại:', err);
  process.exit(1);
});
