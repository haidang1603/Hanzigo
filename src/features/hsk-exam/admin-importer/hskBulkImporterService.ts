import {
  generateSampleHskPaperPayload,
  importFullHskPaperToRepository,
  type HskPaperImportPayload,
} from '../../../services/hskExamImportService.ts';

export type BeijingTtsVoice = 'zh-CN-XiaoxiaoNeural' | 'zh-CN-YunxiNeural';

export interface BulkImportItemResult {
  paper_code: string;
  success: boolean;
  insertedGroupsCount: number;
  ttsEnrichedCount: number;
  storageMode?: 'supabase' | 'local_simulation';
  error?: string;
}

export interface BulkImportSummary {
  totalPapers: number;
  succeeded: number;
  failed: number;
  results: BulkImportItemResult[];
}

/**
 * Tự động tạo metadata TTS đa giọng đọc chuẩn Bắc Kinh (Nam/Nữ) cho các câu Nghe chưa có file MP3 gốc
 */
export function enrichListeningTtsMetadata(payload: HskPaperImportPayload): {
  enrichedPayload: HskPaperImportPayload;
  ttsEnrichedCount: number;
} {
  let ttsEnrichedCount = 0;
  const listening = (payload.questions?.listening || []).map((item, idx) => {
    const stim = { ...(item.stimulus_payload || {}) };
    const hasAudio = typeof stim.audio_url === 'string' && stim.audio_url.trim().length > 0;
    if (!hasAudio) {
      const voice: BeijingTtsVoice =
        idx % 2 === 0 ? 'zh-CN-XiaoxiaoNeural' : 'zh-CN-YunxiNeural';
      const voiceGender = idx % 2 === 0 ? 'female_beijing' : 'male_beijing';
      const scriptText =
        (typeof stim.transcript_zh === 'string' && stim.transcript_zh) ||
        (typeof stim.audio_script === 'string' && stim.audio_script) ||
        '';

      stim.tts_generated = true;
      stim.tts_voice = voice;
      stim.tts_voice_gender = voiceGender;
      stim.tts_locale = 'zh-CN';
      stim.tts_rate = payload.hsk_level <= 2 ? 0.85 : 1.0;
      stim.tts_script_zh = scriptText;
      ttsEnrichedCount += 1;
    }
    return {
      ...item,
      stimulus_payload: stim,
    };
  });

  return {
    enrichedPayload: {
      ...payload,
      questions: {
        ...payload.questions,
        listening,
      },
    },
    ttsEnrichedCount,
  };
}

/**
 * Nạp hàng loạt nhiều bộ đề HSK vào Kho đề thi (kèm tự động sinh metadata TTS đa giọng Bắc Kinh)
 */
export async function bulkImportHskPapers(
  papers: HskPaperImportPayload[]
): Promise<BulkImportSummary> {
  const results: BulkImportItemResult[] = [];

  for (const paper of papers) {
    const { enrichedPayload, ttsEnrichedCount } = enrichListeningTtsMetadata(paper);
    try {
      const res = await importFullHskPaperToRepository(enrichedPayload);
      results.push({
        paper_code: enrichedPayload.paper_code,
        success: true,
        insertedGroupsCount: res.insertedGroupsCount,
        ttsEnrichedCount,
        storageMode: res.storageMode,
      });
    } catch (err) {
      results.push({
        paper_code: paper.paper_code || 'UNKNOWN',
        success: false,
        insertedGroupsCount: 0,
        ttsEnrichedCount,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    totalPapers: papers.length,
    succeeded: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

/**
 * Sinh nhanh trọn bộ 6 đề mẫu HSK 1–6 phục vụ nạp hàng loạt hoặc kiểm thử
 */
export function generateBulkSampleHsk1To6Papers(): HskPaperImportPayload[] {
  return ([1, 2, 3, 4, 5, 6] as const).map((lvl) => generateSampleHskPaperPayload(lvl));
}

