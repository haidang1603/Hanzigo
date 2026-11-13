import { supabase, isSupabaseConfigured } from '../supabase/config.js';

export type HskSectionType = 'listening' | 'reading' | 'writing';

export interface HskSubQuestionImportItem {
  question_number: number;
  options?: Record<string, string>;
  clauses?: Record<string, string>;
  correct_answer?: string;
  sample_answers?: string[];
  explanation_vi: string;
}

export interface HskQuestionImportItem {
  part_number: number;
  question_number_start: number;
  question_number_end: number;
  question_type: string;
  stimulus_payload: Record<string, unknown>;
  sub_questions: HskSubQuestionImportItem[];
  target_vocab?: string[];
  target_grammar_codes?: string[];
  difficulty?: number;
}

export interface HskPaperImportPayload {
  paper_code: string; // Ví dụ: "H41008"
  title_zh: string; // "HSK四级全真模拟卷 (H41008)"
  title_vi: string; // "Đề thi chuẩn HSK 4 - Mã đề H41008"
  hsk_level: 1 | 2 | 3 | 4 | 5 | 6;
  paper_type: 'official_past_paper' | 'ai_simulated' | 'sectional_drill';
  questions: Record<HskSectionType, HskQuestionImportItem[]>;
}

export interface HskExamPaperRecord {
  id: string;
  paper_code: string;
  title_zh: string;
  title_vi: string;
  hsk_level: 1 | 2 | 3 | 4 | 5 | 6;
  paper_type: 'official_past_paper' | 'ai_simulated' | 'sectional_drill';
  total_questions: number;
  duration_minutes: number;
  max_score: number;
  passing_score: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HskQuestionBankRow {
  paper_code: string;
  hsk_level: number;
  section: HskSectionType;
  part_number: number;
  question_number_start: number;
  question_number_end: number;
  question_type: string;
  stimulus_payload: Record<string, unknown>;
  sub_questions: HskSubQuestionImportItem[];
  target_vocab: string[];
  target_grammar_codes: string[];
  difficulty: number;
}

export interface HskPaperValidationResult {
  valid: boolean;
  errors: string[];
  stats: {
    paperCode: string;
    hskLevel: number;
    listeningGroups: number;
    readingGroups: number;
    writingGroups: number;
    totalGroups: number;
    totalSubQuestions: number;
  };
}

export const HSK_DEFAULT_META: Record<
  number,
  { totalQ: number; duration: number; maxScore: number; passScore: number }
> = {
  1: { totalQ: 40, duration: 35, maxScore: 200, passScore: 120 },
  2: { totalQ: 60, duration: 50, maxScore: 200, passScore: 120 },
  3: { totalQ: 80, duration: 85, maxScore: 300, passScore: 180 },
  4: { totalQ: 100, duration: 100, maxScore: 300, passScore: 180 },
  5: { totalQ: 100, duration: 120, maxScore: 300, passScore: 180 },
  6: { totalQ: 101, duration: 135, maxScore: 300, passScore: 180 },
};

const LOCAL_PAPER_BANK_KEY = 'hanzigo_hsk_exam_papers_bank_v1';
const LOCAL_QUESTION_BANK_KEY = 'hanzigo_hsk_question_bank_v1';

let memoryPapers: HskExamPaperRecord[] = [];
let memoryQuestions: HskQuestionBankRow[] = [];

function readLocalPapers(): HskExamPaperRecord[] {
  try {
    if (typeof localStorage === 'undefined') return memoryPapers;
    const raw = localStorage.getItem(LOCAL_PAPER_BANK_KEY);
    return raw ? (JSON.parse(raw) as HskExamPaperRecord[]) : memoryPapers;
  } catch {
    return memoryPapers;
  }
}

function writeLocalPapers(papers: HskExamPaperRecord[]): void {
  memoryPapers = papers;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_PAPER_BANK_KEY, JSON.stringify(papers));
    }
  } catch {
    // ignore storage quota errors
  }
}

function readLocalQuestions(): HskQuestionBankRow[] {
  try {
    if (typeof localStorage === 'undefined') return memoryQuestions;
    const raw = localStorage.getItem(LOCAL_QUESTION_BANK_KEY);
    return raw ? (JSON.parse(raw) as HskQuestionBankRow[]) : memoryQuestions;
  } catch {
    return memoryQuestions;
  }
}

function writeLocalQuestions(rows: HskQuestionBankRow[]): void {
  memoryQuestions = rows;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_QUESTION_BANK_KEY, JSON.stringify(rows));
    }
  } catch {
    // ignore storage quota errors
  }
}

/**
 * Kiểm tra tính hợp lệ của gói dữ liệu đề thi chuẩn trước khi nạp vào kho
 */
export function validateHskPaperImportPayload(
  payload: HskPaperImportPayload
): HskPaperValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      errors: ['Payload không hợp lệ hoặc bị rỗng.'],
      stats: {
        paperCode: '',
        hskLevel: 0,
        listeningGroups: 0,
        readingGroups: 0,
        writingGroups: 0,
        totalGroups: 0,
        totalSubQuestions: 0,
      },
    };
  }

  if (!payload.paper_code || !payload.paper_code.trim()) {
    errors.push('Thiếu mã đề thi (paper_code), ví dụ: "H41008".');
  }
  if (!payload.title_zh || !payload.title_zh.trim()) {
    errors.push('Thiếu tiêu đề tiếng Trung (title_zh).');
  }
  if (!payload.title_vi || !payload.title_vi.trim()) {
    errors.push('Thiếu tiêu đề tiếng Việt (title_vi).');
  }
  if (!HSK_DEFAULT_META[payload.hsk_level]) {
    errors.push(`Cấp độ HSK (${payload.hsk_level}) không hợp lệ. Chỉ hỗ trợ 1 đến 6.`);
  }
  if (
    !['official_past_paper', 'ai_simulated', 'sectional_drill'].includes(payload.paper_type)
  ) {
    errors.push(`Loại đề (paper_type: ${payload.paper_type}) không hợp lệ.`);
  }

  const sections: HskSectionType[] = ['listening', 'reading', 'writing'];
  let totalSubQuestions = 0;
  const counts: Record<HskSectionType, number> = {
    listening: 0,
    reading: 0,
    writing: 0,
  };

  for (const section of sections) {
    const items = payload.questions?.[section] || [];
    if (!Array.isArray(items)) {
      errors.push(`Mục questions.${section} phải là một mảng.`);
      continue;
    }
    counts[section] = items.length;
    items.forEach((item, idx) => {
      if (item.part_number < 1) {
        errors.push(`[${section} #${idx + 1}] part_number phải >= 1.`);
      }
      if (item.question_number_end < item.question_number_start) {
        errors.push(
          `[${section} #${idx + 1}] question_number_end (${item.question_number_end}) nhỏ hơn question_number_start (${item.question_number_start}).`
        );
      }
      if (!Array.isArray(item.sub_questions) || item.sub_questions.length === 0) {
        errors.push(`[${section} #${idx + 1}] Phải có ít nhất 1 sub_questions.`);
      } else {
        totalSubQuestions += item.sub_questions.length;
      }
    });
  }

  const totalGroups = counts.listening + counts.reading + counts.writing;
  if (totalGroups === 0) {
    errors.push('Đề thi phải có ít nhất 1 nhóm câu hỏi ở listening, reading hoặc writing.');
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      paperCode: payload.paper_code || '',
      hskLevel: payload.hsk_level || 0,
      listeningGroups: counts.listening,
      readingGroups: counts.reading,
      writingGroups: counts.writing,
      totalGroups,
      totalSubQuestions,
    },
  };
}

/**
 * Nạp trọn bộ 1 đề thi HSK (Metadata + Toàn bộ câu hỏi Nghe/Đọc/Viết) vào Kho đề thi
 */
export async function importFullHskPaperToRepository(payload: HskPaperImportPayload) {
  const validation = validateHskPaperImportPayload(payload);
  if (!validation.valid) {
    throw new Error(`Dữ liệu đề thi không hợp lệ: ${validation.errors.join(' ')}`);
  }

  const meta = HSK_DEFAULT_META[payload.hsk_level];
  const paperCode = payload.paper_code.trim();

  // Chuẩn bị danh sách câu hỏi cho cả 3 kỹ năng
  const rowsToInsert: HskQuestionBankRow[] = (
    ['listening', 'reading', 'writing'] as HskSectionType[]
  ).flatMap((section) => {
    const items = payload.questions[section] || [];
    return items.map((item) => ({
      paper_code: paperCode,
      hsk_level: payload.hsk_level,
      section,
      part_number: item.part_number,
      question_number_start: item.question_number_start,
      question_number_end: item.question_number_end,
      question_type: item.question_type,
      stimulus_payload: item.stimulus_payload,
      sub_questions: item.sub_questions,
      target_vocab: item.target_vocab ?? [],
      target_grammar_codes: item.target_grammar_codes ?? [],
      difficulty: item.difficulty ?? payload.hsk_level,
    }));
  });

  if (isSupabaseConfigured && supabase) {
    // 1. Upsert thông tin đề thi vào bảng hsk_exam_papers
    const { data: paperData, error: paperError } = await supabase
      .from('hsk_exam_papers')
      .upsert(
        {
          paper_code: paperCode,
          title_zh: payload.title_zh,
          title_vi: payload.title_vi,
          hsk_level: payload.hsk_level,
          paper_type: payload.paper_type,
          total_questions: meta.totalQ,
          duration_minutes: meta.duration,
          max_score: meta.maxScore,
          passing_score: meta.passScore,
          is_published: true,
        },
        { onConflict: 'paper_code' }
      )
      .select()
      .single();

    if (paperError) {
      throw new Error(`Lỗi tạo đề thi ${paperCode}: ${paperError.message}`);
    }

    // 2. Xóa câu hỏi cũ của mã đề này (nếu cập nhật lại đề) để tránh trùng lặp
    const { error: delError } = await supabase
      .from('hsk_question_bank')
      .delete()
      .eq('paper_code', paperCode);

    if (delError) {
      throw new Error(`Lỗi dọn câu hỏi cũ cho đề ${paperCode}: ${delError.message}`);
    }

    // 3. Chèn toàn bộ câu hỏi mới
    const { error: qError } = await supabase.from('hsk_question_bank').insert(rowsToInsert);
    if (qError) {
      throw new Error(`Lỗi nạp câu hỏi cho đề ${paperCode}: ${qError.message}`);
    }

    return {
      paper: paperData as HskExamPaperRecord,
      insertedGroupsCount: rowsToInsert.length,
      storageMode: 'supabase' as const,
    };
  }

  // Local simulation mode (khi chưa cấu hình Supabase hoặc chạy unit test)
  const now = new Date().toISOString();
  const existingPapers = readLocalPapers();
  const prevPaper = existingPapers.find((p) => p.paper_code === paperCode);
  const paperRecord: HskExamPaperRecord = {
    id: prevPaper?.id || `local-paper-${paperCode}`,
    paper_code: paperCode,
    title_zh: payload.title_zh,
    title_vi: payload.title_vi,
    hsk_level: payload.hsk_level,
    paper_type: payload.paper_type,
    total_questions: meta.totalQ,
    duration_minutes: meta.duration,
    max_score: meta.maxScore,
    passing_score: meta.passScore,
    is_published: true,
    created_at: prevPaper?.created_at || now,
    updated_at: now,
  };

  writeLocalPapers([
    paperRecord,
    ...existingPapers.filter((p) => p.paper_code !== paperCode),
  ]);

  const existingQuestions = readLocalQuestions().filter((q) => q.paper_code !== paperCode);
  writeLocalQuestions([...existingQuestions, ...rowsToInsert]);

  return {
    paper: paperRecord,
    insertedGroupsCount: rowsToInsert.length,
    storageMode: 'local_simulation' as const,
  };
}

/**
 * Lấy danh sách các đề thi đã nạp trong Kho đề thi
 */
export async function listImportedHskPapers(): Promise<HskExamPaperRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('hsk_exam_papers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as HskExamPaperRecord[];
      }
    } catch {
      // fallback to local
    }
  }
  return readLocalPapers();
}

/**
 * Lấy chi tiết 1 mã đề cùng danh sách nhóm câu hỏi từ Kho
 */
export async function getImportedHskPaperWithQuestions(paperCode: string): Promise<{
  paper: HskExamPaperRecord | null;
  questions: HskQuestionBankRow[];
}> {
  if (isSupabaseConfigured && supabase) {
    try {
      const [{ data: paper }, { data: questions }] = await Promise.all([
        supabase.from('hsk_exam_papers').select('*').eq('paper_code', paperCode).maybeSingle(),
        supabase
          .from('hsk_question_bank')
          .select('*')
          .eq('paper_code', paperCode)
          .order('section', { ascending: true })
          .order('part_number', { ascending: true })
          .order('question_number_start', { ascending: true }),
      ]);
      if (paper) {
        return {
          paper: paper as HskExamPaperRecord,
          questions: (questions || []) as HskQuestionBankRow[],
        };
      }
    } catch {
      // fallback to local
    }
  }

  const paper = readLocalPapers().find((p) => p.paper_code === paperCode) || null;
  const questions = readLocalQuestions().filter((q) => q.paper_code === paperCode);
  return { paper, questions };
}

/**
 * Tạo dữ liệu mẫu chuẩn HskPaperImportPayload để kiểm thử nhanh trên Admin UI
 */
export function generateSampleHskPaperPayload(
  hskLevel: 1 | 2 | 3 | 4 | 5 | 6 = 4
): HskPaperImportPayload {
  const code = `H${hskLevel}1008`;
  return {
    paper_code: code,
    title_zh: `HSK${hskLevel}级全真模拟卷 (${code})`,
    title_vi: `Đề thi chuẩn HSK ${hskLevel} - Mã đề ${code}`,
    hsk_level: hskLevel,
    paper_type: 'official_past_paper',
    questions: {
      listening: [
        {
          part_number: 1,
          question_number_start: 1,
          question_number_end: 1,
          question_type: 'true_false_listening',
          stimulus_payload: {
            transcript_zh: '今天天气真不错，我们去公园散步吧。',
            audio_hint: 'Giọng nam tốc độ chuẩn HSK',
          },
          sub_questions: [
            {
              question_number: 1,
              options: { A: 'Đúng (✓)', B: 'Sai (✗)' },
              correct_answer: 'A',
              explanation_vi: 'Người nói rủ đi dạo công viên vì thời tiết hôm nay rất đẹp.',
            },
          ],
          target_vocab: ['散步', '公园'],
          target_grammar_codes: ['HSK_ADJ_ZHUANGTAI'],
          difficulty: hskLevel,
        },
      ],
      reading: [
        {
          part_number: 2,
          question_number_start: 56,
          question_number_end: 56,
          question_type: 'sentence_ordering',
          stimulus_payload: {
            instruction_vi: 'Sắp xếp 3 cụm câu sau thành đoạn văn hợp lý.',
          },
          sub_questions: [
            {
              question_number: 56,
              clauses: {
                A: '不管做什么事情',
                B: '只要坚持下去',
                C: '就一定能看到进步',
              },
              correct_answer: 'ABC',
              explanation_vi: 'Cấu trúc "不管...只要...就..." (Bất kể làm việc gì, chỉ cần kiên trì thì nhất định sẽ tiến bộ).',
            },
          ],
          target_vocab: ['不管', '坚持', '进步'],
          target_grammar_codes: ['HSK4_BUGUAN_ZHIYAO_JIU'],
          difficulty: hskLevel,
        },
      ],
      writing: [
        {
          part_number: 1,
          question_number_start: 86,
          question_number_end: 86,
          question_type: 'word_reorder_writing',
          stimulus_payload: {
            words: ['把', '他', '护照', '放在', '桌子上', '了'],
          },
          sub_questions: [
            {
              question_number: 86,
              sample_answers: ['他把护照放在桌子上了。'],
              explanation_vi: 'Câu chữ 把: Chủ ngữ (他) + 把 + Tân ngữ (护照) + Động từ (放在) + Vị trí (桌子上) + 了.',
            },
          ],
          target_vocab: ['护照', '桌子'],
          target_grammar_codes: ['HSK3_BA_SENTENCE'],
          difficulty: hskLevel,
        },
      ],
    },
  };
}

