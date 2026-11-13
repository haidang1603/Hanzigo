/**
 * CLI Seed Script: Nạp hàng loạt đề thi HSK (kèm TTS đa giọng Bắc Kinh) vào Supabase / Repository
 * Chạy trực tiếp bằng Node >= 22:
 *   node scripts/seedHskExamPapers.ts [path/to/papers.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  bulkImportHskPapers,
  generateBulkSampleHsk1To6Papers,
} from '../src/features/hsk-exam/admin-importer/hskBulkImporterService.ts';
import type { HskPaperImportPayload } from '../src/services/hskExamImportService.ts';

async function main() {
  const inputPath = process.argv[2];
  let papers: HskPaperImportPayload[];

  if (inputPath) {
    const resolved = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(resolved)) {
      console.error(`❌ Không tìm thấy file JSON: ${resolved}`);
      process.exit(1);
    }
    const raw = fs.readFileSync(resolved, 'utf-8');
    const parsed = JSON.parse(raw);
    papers = Array.isArray(parsed) ? parsed : [parsed];
    console.log(`📂 Đọc ${papers.length} đề thi từ ${resolved}`);
  } else {
    papers = generateBulkSampleHsk1To6Papers();
    console.log(`🧪 Không truyền file JSON — sử dụng bộ ${papers.length} đề mẫu HSK 1–6.`);
  }

  const summary = await bulkImportHskPapers(papers);
  console.log(`✅ Kết quả: ${summary.succeeded}/${summary.totalPapers} đề thành công, ${summary.failed} lỗi.`);
  for (const r of summary.results) {
    if (r.success) {
      console.log(
        `  ✔ ${r.paper_code}: ${r.insertedGroupsCount} nhóm câu hỏi, ${r.ttsEnrichedCount} câu gắn TTS Bắc Kinh (${r.storageMode})`
      );
    } else {
      console.error(`  ✖ ${r.paper_code}: ${r.error}`);
    }
  }
}

main().catch((err) => {
  console.error('❌ Lỗi chạy seedHskExamPapers:', err);
  process.exit(1);
});

