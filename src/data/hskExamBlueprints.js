/**
 * =========================================================================
 * HANZIGO — DUAL-SYSTEM CBT EXAM BLUEPRINTS (HSK 2.0 & HSK 3.0)
 * =========================================================================
 * Hỗ trợ song song:
 * - hsk_2_0: Hệ thống HSK 2.0 (6 cấp truyền thống, bảo toàn 100% ngân hàng cũ)
 * - hsk_3_0: Hệ thống HSK 3.0 (9 cấp)
 *
 * Bao gồm:
 * - Bảng Blueprint chuẩn từng bậc (tổng câu, thời gian, phân bổ skill/part)
 * - Smart Exam Assembler (full_exam / by_skill / by_part) không sinh câu rác/lặp
 * - Auto-Grader khách quan (mcq, true_false, fill_blank, reorder)
 * - Subjective Rubric Grader (/api/ai/grade, /api/ai/pronunciation + fallback xác định)
 * - Post-Submission Result Analytics & Hỏi Lão Sư AI prompt builder
 * - Dual-System Exam History Service (cô lập theo userId + examSystem)
 * =========================================================================
 */

import { HSK_EXAMS, HSK_QUESTIONS, getFullExamById, registerDynamicExam } from './hskExamsData.js';
import { HSK_7_TO_9_EXAM_PAPER } from '../features/hsk-exam/data/hsk7to9SampleExamPaper.js';

const MINI_CHAR_PINYIN_MAP = {
  '我': 'wǒ', '你': 'nǐ', '他': 'tā', '她': 'tā', '们': 'men', '的': 'de', '是': 'shì', '不': 'bù', '在': 'zài', '有': 'yǒu',
  '好': 'hǎo', '很': 'hěn', '喜': 'xǐ', '欢': 'huān', '学': 'xué', '习': 'xí', '汉': 'hàn', '语': 'yǔ', '中': 'zhōng', '文': 'wén',
  '人': 'rén', '大': 'dà', '小': 'xiǎo', '多': 'duō', '少': 'shǎo', '上': 'shàng', '下': 'xià', '来': 'lái', '去': 'qù', '回': 'huí',
  '看': 'kàn', '听': 'tīng', '说': 'shuō', '读': 'dú', '写': 'xiě', '吃': 'chī', '喝': 'hē', '买': 'mǎi', '做': 'zuò', '想': 'xiǎng',
  '天': 'tiān', '今': 'jīn', '明': 'míng', '昨': 'zuó', '年': 'nián', '月': 'yuè', '日': 'rì', '时': 'shí', '候': 'hòu', '点': 'diǎn',
  '家': 'jiā', '校': 'xiào', '老': 'lǎo', '师': 'shī', '生': 'shēng', '朋': 'péng', '友': 'yǒu', '爸': 'bà', '妈': 'mā', '水': 'shuǐ',
  '茶': 'chá', '书': 'shū', '电': 'diàn', '脑': 'nǎo', '车': 'chē', '钱': 'qián', '高': 'gāo', '兴': 'xìng', '谢': 'xiè', '请': 'qǐng',
  '对': 'duì', '错': 'cuò', '能': 'néng', '会': 'huì', '要': 'yào', '这': 'zhè', '那': 'nà', '哪': 'nǎ', '谁': 'shéi', '什': 'shén', '么': 'me',
};

export const PRACTICE_MODES = Object.freeze({
  EXAM: 'exam_mode',
  LEARNING: 'learning_mode',
});

export const EXAM_SYSTEMS = Object.freeze({
  HSK_2_0: 'hsk_2_0',
  HSK_3_0: 'hsk_3_0',
});

export const EXAM_MODES = Object.freeze({
  FULL_EXAM: 'full_exam',
  BY_SKILL: 'by_skill',
  BY_PART: 'by_part',
});

export const SKILL_LABELS_VI = Object.freeze({
  listening: 'Nghe hiểu',
  reading: 'Đọc hiểu',
  writing: 'Viết',
  translation: 'Dịch thuật',
  speaking: 'Khẩu ngữ (Nói)',
});

export const HSK_2_0_BLUEPRINTS = Object.freeze({
  'HSK 1': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 1',
    label: 'HSK 1 (2.0)',
    totalQuestions: 40,
    durationMinutes: 40,
    maxScore: 200,
    passingScore: 120,
    speakingMode: 'none',
    skills: {
      listening: { count: 20, parts: [{ part: 1, count: 5 }, { part: 2, count: 5 }, { part: 3, count: 5 }, { part: 4, count: 5 }] },
      reading: { count: 20, parts: [{ part: 1, count: 5 }, { part: 2, count: 5 }, { part: 3, count: 5 }, { part: 4, count: 5 }] },
      writing: { count: 0, parts: [] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
  'HSK 2': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 2',
    label: 'HSK 2 (2.0)',
    totalQuestions: 60,
    durationMinutes: 55,
    maxScore: 200,
    passingScore: 120,
    speakingMode: 'none',
    skills: {
      listening: { count: 35, parts: [{ part: 1, count: 10 }, { part: 2, count: 10 }, { part: 3, count: 10 }, { part: 4, count: 5 }] },
      reading: { count: 25, parts: [{ part: 1, count: 5 }, { part: 2, count: 5 }, { part: 3, count: 5 }, { part: 4, count: 10 }] },
      writing: { count: 0, parts: [] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
  'HSK 3': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 3',
    label: 'HSK 3 (2.0)',
    totalQuestions: 80,
    durationMinutes: 90,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    skills: {
      listening: { count: 40, parts: [{ part: 1, count: 10 }, { part: 2, count: 10 }, { part: 3, count: 10 }, { part: 4, count: 10 }] },
      reading: { count: 30, parts: [{ part: 1, count: 10 }, { part: 2, count: 10 }, { part: 3, count: 10 }] },
      writing: { count: 10, parts: [{ part: 1, count: 5 }, { part: 2, count: 5 }] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
  'HSK 4': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 4',
    label: 'HSK 4 (2.0)',
    totalQuestions: 100,
    durationMinutes: 105,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    skills: {
      listening: { count: 45, parts: [{ part: 1, count: 10 }, { part: 2, count: 15 }, { part: 3, count: 20 }] },
      reading: { count: 40, parts: [{ part: 1, count: 10 }, { part: 2, count: 10 }, { part: 3, count: 20 }] },
      writing: { count: 15, parts: [{ part: 1, count: 10 }, { part: 2, count: 5 }] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
  'HSK 5': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 5',
    label: 'HSK 5 (2.0)',
    totalQuestions: 100,
    durationMinutes: 125,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    skills: {
      listening: { count: 45, parts: [{ part: 1, count: 20 }, { part: 2, count: 25 }] },
      reading: { count: 45, parts: [{ part: 1, count: 15 }, { part: 2, count: 10 }, { part: 3, count: 20 }] },
      writing: { count: 10, parts: [{ part: 1, count: 8 }, { part: 2, count: 2 }] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
  'HSK 6': {
    examSystem: EXAM_SYSTEMS.HSK_2_0,
    level: 'HSK 6',
    label: 'HSK 6 (2.0)',
    totalQuestions: 101,
    durationMinutes: 140,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    skills: {
      listening: { count: 50, parts: [{ part: 1, count: 15 }, { part: 2, count: 15 }, { part: 3, count: 20 }] },
      reading: { count: 50, parts: [{ part: 1, count: 10 }, { part: 2, count: 10 }, { part: 3, count: 10 }, { part: 4, count: 20 }] },
      writing: { count: 1, parts: [{ part: 1, count: 1 }] },
      translation: { count: 0, parts: [] },
      speaking: { count: 0, parts: [] },
    },
  },
});

export const HSK_3_0_BLUEPRINTS = Object.freeze({
  'HSK 1': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 1',
    label: 'HSK 1 (3.0)',
    bandGroup: 'Sơ cấp',
    totalQuestions: 40,
    durationMinutes: 40,
    maxScore: 200,
    passingScore: 120,
    speakingMode: 'none',
    skills: {
      listening: {
        count: 20,
        durationMinutes: 12,
        parts: [
          { part: 1, count: 5, questionType: 'mcq', titleVi: 'Nghe Phần 1: Chọn tranh / tình huống phù hợp (bỏ Đúng/Sai)' },
          { part: 2, count: 5, questionType: 'mcq', titleVi: 'Nghe Phần 2: Chọn tranh phù hợp' },
          { part: 3, count: 5, questionType: 'mcq', titleVi: 'Nghe Phần 3: Hội thoại ngắn' },
          { part: 4, count: 5, questionType: 'mcq', titleVi: 'Nghe Phần 4: Nghe câu hỏi chọn đáp án' },
        ],
      },
      reading: {
        count: 20,
        durationMinutes: 20,
        parts: [
          { part: 1, count: 5, questionType: 'true_false', titleVi: 'Đọc Phần 1: Đối chiếu từ & nghĩa' },
          { part: 2, count: 5, questionType: 'mcq', titleVi: 'Đọc Phần 2: Chọn câu khớp ngữ cảnh' },
          { part: 3, count: 5, questionType: 'mcq', titleVi: 'Đọc Phần 3: Ghép hội thoại hỏi – đáp' },
          { part: 4, count: 5, questionType: 'fill_blank', titleVi: 'Đọc Phần 4: Điền từ vào chỗ trống' },
        ],
      },
      writing: { count: 0, durationMinutes: 0, parts: [] },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 2': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 2',
    label: 'HSK 2 (3.0)',
    bandGroup: 'Sơ cấp',
    totalQuestions: 60,
    durationMinutes: 60,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'none',
    skills: {
      listening: {
        count: 25,
        durationMinutes: 17,
        parts: [
          { part: 1, count: 6, questionType: 'true_false', titleVi: 'Nghe Phần 1: Phán đoán Đúng/Sai' },
          { part: 2, count: 6, questionType: 'mcq', titleVi: 'Nghe Phần 2: Chọn tình huống' },
          { part: 3, count: 7, questionType: 'mcq', titleVi: 'Nghe Phần 3: Hội thoại 2–3 lượt' },
          { part: 4, count: 6, questionType: 'mcq', titleVi: 'Nghe Phần 4: Hội thoại & thông báo ngắn' },
        ],
      },
      reading: {
        count: 25,
        durationMinutes: 25,
        parts: [
          { part: 1, count: 6, questionType: 'mcq', titleVi: 'Đọc Phần 1: Chọn câu phù hợp' },
          { part: 2, count: 6, questionType: 'fill_blank', titleVi: 'Đọc Phần 2: Điền từ vựng' },
          { part: 3, count: 7, questionType: 'mcq', titleVi: 'Đọc Phần 3: Ghép hội thoại' },
          { part: 4, count: 6, questionType: 'true_false', titleVi: 'Đọc Phần 4: Đọc câu phán đoán Đúng/Sai' },
        ],
      },
      writing: {
        count: 10,
        durationMinutes: 10,
        parts: [
          { part: 1, count: 5, questionType: 'reorder', titleVi: 'Viết Phần 1: Sắp xếp từ thành câu' },
          { part: 2, count: 5, questionType: 'fill_blank', titleVi: 'Viết Phần 2: Nhìn Pinyin viết chữ Hán' },
        ],
      },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 3': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 3',
    label: 'HSK 3 (3.0)',
    bandGroup: 'Sơ cấp',
    totalQuestions: 70,
    durationMinutes: 83,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    separateSpeakingQuestions: 15,
    separateSpeakingMinutes: 15,
    skills: {
      listening: {
        count: 30,
        durationMinutes: 25,
        parts: [
          { part: 1, count: 10, questionType: 'true_false', titleVi: 'Nghe Phần 1: Phán đoán nội dung' },
          { part: 2, count: 10, questionType: 'mcq', titleVi: 'Nghe Phần 2: Hội thoại ngắn' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Nghe Phần 3: Hội thoại dài & đoạn văn' },
        ],
      },
      reading: {
        count: 30,
        durationMinutes: 33,
        parts: [
          { part: 1, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 1: Nối câu ngữ cảnh' },
          { part: 2, count: 10, questionType: 'fill_blank', titleVi: 'Đọc Phần 2: Điền từ ngữ cảnh' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 3: Đọc hiểu đoạn văn' },
        ],
      },
      writing: {
        count: 10,
        durationMinutes: 15,
        parts: [
          { part: 1, count: 5, questionType: 'reorder', titleVi: 'Viết Phần 1: Sắp xếp câu chữ 把/被' },
          { part: 2, count: 5, questionType: 'fill_blank', titleVi: 'Viết Phần 2: Hoàn thành câu chữ Hán' },
        ],
      },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 4': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 4',
    label: 'HSK 4 (3.0)',
    bandGroup: 'Trung cấp',
    totalQuestions: 70,
    durationMinutes: 85,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    separateSpeakingQuestions: 5,
    separateSpeakingMinutes: 20,
    skills: {
      listening: {
        count: 32,
        durationMinutes: 20,
        parts: [
          { part: 1, count: 10, questionType: 'true_false', titleVi: 'Nghe Phần 1: Phán đoán đoạn ngắn' },
          { part: 2, count: 12, questionType: 'mcq', titleVi: 'Nghe Phần 2: Hội thoại 2 lượt' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Nghe Phần 3: Hội thoại dài & tự sự' },
        ],
      },
      reading: {
        count: 32,
        durationMinutes: 30,
        parts: [
          { part: 1, count: 10, questionType: 'fill_blank', titleVi: 'Đọc Phần 1: Chọn từ điền câu' },
          { part: 2, count: 10, questionType: 'reorder', titleVi: 'Đọc Phần 2: Sắp xếp thứ tự câu A-B-C' },
          { part: 3, count: 12, questionType: 'mcq', titleVi: 'Đọc Phần 3: Đọc hiểu văn bản' },
        ],
      },
      writing: {
        count: 6,
        durationMinutes: 25,
        parts: [
          { part: 1, count: 5, questionType: 'essay', titleVi: 'Viết Phần 1: Đặt câu theo tranh & từ gợi ý' },
          { part: 2, count: 1, questionType: 'essay', titleVi: 'Viết Phần 2: Viết đoạn văn ngắn theo tình huống' },
        ],
      },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 5': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 5',
    label: 'HSK 5 (3.0)',
    bandGroup: 'Trung cấp',
    totalQuestions: 72,
    durationMinutes: 110,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    separateSpeakingQuestions: 5,
    separateSpeakingMinutes: 23,
    skills: {
      listening: {
        count: 35,
        durationMinutes: 25,
        parts: [
          { part: 1, count: 15, questionType: 'mcq', titleVi: 'Nghe Phần 1: Hội thoại ngắn' },
          { part: 2, count: 20, questionType: 'mcq', titleVi: 'Nghe Phần 2: Phỏng vấn & bản tin' },
        ],
      },
      reading: {
        count: 35,
        durationMinutes: 35,
        parts: [
          { part: 1, count: 15, questionType: 'fill_blank', titleVi: 'Đọc Phần 1: Điền từ đoạn văn (Cloze)' },
          { part: 2, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 2: Sắp xếp đoạn văn & nắm ý chính' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 3: Đọc sâu bài báo' },
        ],
      },
      writing: {
        count: 2,
        durationMinutes: 40,
        parts: [
          { part: 1, count: 1, questionType: 'essay', titleVi: 'Viết Phần 1: Kể chuyện theo 4 bức tranh (tối thiểu 100 chữ)' },
          { part: 2, count: 1, questionType: 'essay', titleVi: 'Viết Phần 2: Viết bài văn theo chủ đề (tối thiểu 200 chữ)' },
        ],
      },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 6': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 6',
    label: 'HSK 6 (3.0)',
    bandGroup: 'Trung cấp',
    totalQuestions: 82,
    durationMinutes: 125,
    maxScore: 300,
    passingScore: 180,
    speakingMode: 'separate',
    separateSpeakingQuestions: 5,
    separateSpeakingMinutes: 23,
    skills: {
      listening: {
        count: 40,
        durationMinutes: 30,
        parts: [
          { part: 1, count: 15, questionType: 'mcq', titleVi: 'Nghe Phần 1: Độc thoại & tin tức' },
          { part: 2, count: 15, questionType: 'mcq', titleVi: 'Nghe Phần 2: Tọa đàm chuyên đề' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Nghe Phần 3: Diễn thuyết học thuật' },
        ],
      },
      reading: {
        count: 40,
        durationMinutes: 40,
        parts: [
          { part: 1, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 1: Đọc hiểu ngữ cảnh & cụm từ học thuật (bỏ câu bệnh)' },
          { part: 2, count: 10, questionType: 'fill_blank', titleVi: 'Đọc Phần 2: Điền từ & thành ngữ' },
          { part: 3, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 3: Điền câu vào đoạn văn' },
          { part: 4, count: 10, questionType: 'mcq', titleVi: 'Đọc Phần 4: Đọc hiểu văn bản dài' },
        ],
      },
      writing: {
        count: 2,
        durationMinutes: 45,
        parts: [
          { part: 1, count: 1, questionType: 'essay', titleVi: 'Viết Phần 1: Văn bản ứng dụng thực tế (应用文 · tối thiểu 150 chữ)' },
          { part: 2, count: 1, questionType: 'essay', titleVi: 'Viết Phần 2: Bài nghị luận nêu quan điểm (议论文 · tối thiểu 300 chữ)' },
        ],
      },
      translation: { count: 0, durationMinutes: 0, parts: [] },
      speaking: { count: 0, durationMinutes: 0, parts: [] },
    },
  },
  'HSK 7-9': {
    examSystem: EXAM_SYSTEMS.HSK_3_0,
    effectiveDate: '2026-12-13',
    level: 'HSK 7-9',
    label: 'HSK 7–9 (3.0)',
    bandGroup: 'Cao cấp (1 bài thi phân 3 hạng)',
    totalQuestions: 91,
    durationMinutes: 200,
    maxScore: 300,
    passingScore: 180,
    levelThresholds: { HSK7: 180, HSK8: 210, HSK9: 240 },
    speakingMode: 'integrated',
    skills: {
      listening: {
        count: 40,
        durationMinutes: 30,
        parts: [
          { part: 1, count: 10, questionType: 'mcq', titleVi: 'Nghe Phần 1: Hội thoại & phát biểu ngắn' },
          { part: 2, count: 9, questionType: 'mcq', titleVi: 'Nghe Phần 2: Phỏng vấn chuyên sâu' },
          { part: 3, count: 15, questionType: 'mcq', titleVi: 'Nghe Phần 3: Bài giảng học thuật' },
          { part: 4, count: 6, questionType: 'mcq', titleVi: 'Nghe Phần 4: Bản tin & tranh biện' },
        ],
      },
      reading: {
        count: 40,
        durationMinutes: 50,
        parts: [
          { part: 1, count: 21, questionType: 'mcq', titleVi: 'Đọc Phần 1: Đọc hiểu văn bản học thuật & chuyên ngành' },
          { part: 2, count: 5, questionType: 'mcq', titleVi: 'Đọc Phần 2: Đọc biểu đồ & dữ liệu đa phương thức' },
          { part: 3, count: 14, questionType: 'fill_blank', titleVi: 'Đọc Phần 3: Tổng hợp & điền khuyết văn bản' },
        ],
      },
      writing: {
        count: 2,
        durationMinutes: 55,
        parts: [
          { part: 1, count: 1, questionType: 'essay', titleVi: 'Viết Phần 1: Tóm tắt & phân tích biểu đồ số liệu (250 chữ)' },
          { part: 2, count: 1, questionType: 'essay', titleVi: 'Viết Phần 2: Luận văn học thuật chuyên sâu (600 chữ)' },
        ],
      },
      translation: {
        count: 4,
        durationMinutes: 41,
        parts: [
          { part: 1, count: 2, questionType: 'translation', titleVi: 'Dịch Phần 1: Dịch viết đoạn văn ngoại ngữ → Trung' },
          { part: 2, count: 2, questionType: 'translation', titleVi: 'Dịch Phần 2: Dịch hiệu đính & bình giải học thuật' },
        ],
      },
      speaking: {
        count: 5,
        durationMinutes: 24,
        parts: [
          { part: 1, count: 1, questionType: 'speaking', titleVi: 'Nói Phần 1: Phức thuật & tóm tắt báo cáo' },
          { part: 2, count: 3, questionType: 'speaking', titleVi: 'Nói Phần 2: Trả lời câu hỏi tình huống & phản biện' },
          { part: 3, count: 1, questionType: 'speaking', titleVi: 'Nói Phần 3: Diễn thuyết biện luận chuyên đề' },
        ],
      },
    },
  },
});

export function getBlueprint(examSystem = EXAM_SYSTEMS.HSK_3_0, level = 'HSK 1') {
  const normalizedLevel = String(level || 'HSK 1').replace(/–/g, '-').trim();
  const table = examSystem === EXAM_SYSTEMS.HSK_2_0 ? HSK_2_0_BLUEPRINTS : HSK_3_0_BLUEPRINTS;
  return table[normalizedLevel] || Object.values(table)[0];
}

function normalizeSkill(rawSkill = 'reading') {
  const s = String(rawSkill || 'reading').toLowerCase();
  if (s.includes('listen')) return 'listening';
  if (s.includes('writ') || s.includes('essay')) return 'writing';
  if (s.includes('trans')) return 'translation';
  if (s.includes('speak') || s.includes('hskk')) return 'speaking';
  return 'reading';
}

function normalizeQuestionType(rawQ) {
  const t = String(rawQ?.questionType || rawQ?.question_type || '').toLowerCase();
  if (t.includes('true_false') || t === 'tf') return 'true_false';
  if (t.includes('fill') || t.includes('blank') || t.includes('cloze')) return 'fill_blank';
  if (t.includes('reorder')) return 'reorder';
  if (t.includes('translation')) return 'translation';
  if (t.includes('speak')) return 'speaking';
  if (t.includes('essay') || t.includes('free_writing') || t.includes('summary') || rawQ?.is_subjective) {
    return 'essay';
  }
  return 'mcq';
}

/**
 * Deterministic scrambler for reorder tokens so exam-takers never receive tokens pre-sorted in answer order.
 */
function deterministicScrambleTokens(tokens = []) {
  if (!Array.isArray(tokens) || tokens.length <= 1) return tokens;
  if (tokens.length === 3 && tokens.includes('A') && tokens.includes('B') && tokens.includes('C')) {
    return ['A', 'B', 'C'];
  }
  const rotated = [...tokens.slice(Math.ceil(tokens.length / 2)), ...tokens.slice(0, Math.ceil(tokens.length / 2))];
  return rotated.join('') === tokens.join('') ? [...tokens].reverse() : rotated;
}

/**
 * Chuẩn hóa metadata tương thích ngược cho mỗi câu hỏi thuộc hsk_2_0 hoặc hsk_3_0.
 */
export function normalizeQuestionForDualSystem(rawQ = {}, fallbackExamSystem = EXAM_SYSTEMS.HSK_2_0) {
  const skill = normalizeSkill(rawQ.skill || rawQ.section || rawQ.part_type);
  const part = Math.max(1, Number(rawQ.part || rawQ.part_number || 1));
  const questionType = normalizeQuestionType(rawQ);
  const examSystem = rawQ.examSystem || rawQ.exam_system || fallbackExamSystem;

  const normalizedOptions = Array.isArray(rawQ.options)
    ? rawQ.options.map((opt) => (typeof opt === 'string' ? { text: opt } : opt))
    : rawQ.options;

  const normalizedAccepted = Array.isArray(rawQ.accepted_answers)
    ? rawQ.accepted_answers
    : Array.isArray(rawQ.acceptedAnswers)
      ? rawQ.acceptedAnswers
      : rawQ.expectedAnswer
        ? [String(rawQ.expectedAnswer)]
        : undefined;

  const rawWords = Array.isArray(rawQ.words) ? rawQ.words : Array.isArray(rawQ.scrambledWords) ? rawQ.scrambledWords : undefined;
  const normalizedCorrectOrder = Array.isArray(rawQ.correct_order)
    ? rawQ.correct_order
    : Array.isArray(rawQ.correctOrder)
      ? rawQ.correctOrder
      : questionType === 'reorder' && rawWords
        ? rawWords
        : undefined;

  const normalizedScrambled = Array.isArray(rawQ.scrambledWords)
    ? rawQ.scrambledWords
    : questionType === 'reorder' && rawWords
      ? deterministicScrambleTokens(rawWords)
      : rawWords;

  const normalizedQuestionTypeLegacy =
    rawQ.question_type ||
    (questionType === 'essay' || questionType === 'translation' || questionType === 'speaking'
      ? 'free_writing'
      : questionType === 'reorder'
        ? 'reorder_sentence'
        : questionType === 'fill_blank'
          ? 'fill_blank'
          : 'multiple_choice');

  return {
    ...rawQ,
    examSystem,
    skill,
    part,
    questionType,
    question_type: normalizedQuestionTypeLegacy,
    section: rawQ.section || skill,
    part_type: rawQ.part_type || skill,
    part_number: rawQ.part_number || part,
    audio_script: rawQ.audio_script || rawQ.audioText || '',
    audioScript: rawQ.audioScript || rawQ.audio_script || rawQ.audioText || '',
    options: normalizedOptions,
    correct_option_index:
      typeof rawQ.correct_option_index === 'number'
        ? rawQ.correct_option_index
        : typeof rawQ.correctIndex === 'number'
          ? rawQ.correctIndex
          : undefined,
    accepted_answers: normalizedAccepted,
    correct_sentence: rawQ.correct_sentence || (questionType === 'reorder' ? rawQ.expectedAnswer : undefined),
    correct_order: normalizedCorrectOrder,
    words: normalizedScrambled,
    scrambledWords: normalizedScrambled,
    sample_answer: rawQ.sample_answer || rawQ.sampleAnswer || '',
    writing_criteria: rawQ.writing_criteria || rawQ.rubric || [],
    explanation: rawQ.explanation || rawQ.explanationVi || '',
    is_subjective: Boolean(
      rawQ.is_subjective || questionType === 'essay' || questionType === 'translation' || questionType === 'speaking'
    ),
  };
}

/**
 * Chuyển đổi đề HSK 7-9 tích hợp sang danh sách câu hỏi chuẩn hóa cho Ngân hàng HSK 3.0.
 */
function buildHsk79CuratedBank() {
  const out = [];
  const sections = HSK_7_TO_9_EXAM_PAPER?.sections || [];

  for (const sec of sections) {
    if (sec.id === 'listening' && Array.isArray(sec.questions)) {
      sec.questions.forEach((q, idx) => {
        out.push({
          id: `hsk30-h79-L-${q.id || idx + 1}`,
          exam_id: 'hsk30-hsk79-bank',
          level: 'HSK 7-9',
          examSystem: EXAM_SYSTEMS.HSK_3_0,
          skill: 'listening',
          part: (idx % 4) + 1,
          questionType: 'mcq',
          question_type: 'multiple_choice',
          section: 'listening',
          part_type: 'listening',
          part_number: (idx % 4) + 1,
          question_number: idx + 1,
          prompt: q.promptZh || q.promptVi,
          translation: q.promptVi,
          audio_script: sec.stimulus?.audioScriptZh || '',
          options: (q.options || []).map((text) => ({ text })),
          correct_option_index: q.correctIndex ?? 0,
          explanation: q.explanationVi || '',
          relatedVocab: q.targetVocab || [],
          points: q.points || 20,
        });
      });
    } else if (sec.id === 'reading' && Array.isArray(sec.questions)) {
      sec.questions.forEach((q, idx) => {
        out.push({
          id: `hsk30-h79-R-${q.id || idx + 1}`,
          exam_id: 'hsk30-hsk79-bank',
          level: 'HSK 7-9',
          examSystem: EXAM_SYSTEMS.HSK_3_0,
          skill: 'reading',
          part: idx === 0 ? 2 : 1,
          questionType: 'mcq',
          question_type: 'multiple_choice',
          section: 'reading',
          part_type: 'reading',
          part_number: idx === 0 ? 2 : 1,
          question_number: idx + 1,
          prompt: `${(sec.passageParagraphs || []).join('\n')}\n\n${q.promptZh}`,
          translation: q.promptVi,
          options: (q.options || []).map((text) => ({ text })),
          correct_option_index: q.correctIndex ?? 0,
          explanation: q.explanationVi || '',
          relatedVocab: q.targetVocab || [],
          points: q.points || 20,
        });
      });
    } else if (sec.id === 'translation' && Array.isArray(sec.tasks)) {
      sec.tasks.forEach((t, idx) => {
        out.push({
          id: `hsk30-h79-T-${t.id || idx + 1}`,
          exam_id: 'hsk30-hsk79-bank',
          level: 'HSK 7-9',
          examSystem: EXAM_SYSTEMS.HSK_3_0,
          skill: 'translation',
          part: idx === 0 ? 1 : 2,
          questionType: 'translation',
          question_type: 'free_writing',
          section: 'translation',
          part_type: 'translation',
          part_number: idx === 0 ? 1 : 2,
          question_number: idx + 1,
          prompt: `${t.title}\n${t.sourceText}`,
          direction: t.direction || 'zh_to_vi',
          sourceText: t.sourceText || '',
          writing_criteria: t.requiredKeywords || [],
          sample_answer: t.threeTierReference?.hsk9Master || t.threeTierReference?.hsk7Standard || '',
          explanation: `Từ khóa khuyến nghị: ${(t.requiredKeywords || []).join(', ')}`,
          is_subjective: true,
          min_words: 20,
          max_words: 400,
          points: 30,
        });
      });
    } else if (sec.id === 'writing') {
      const essays = [
        { item: sec.partA_ChartEssay, part: 1 },
        { item: sec.partB_ArgumentativeEssay, part: 2 },
      ].filter((e) => e.item);
      essays.forEach((entry, idx) => {
        out.push({
          id: `hsk30-h79-W-${idx + 1}`,
          exam_id: 'hsk30-hsk79-bank',
          level: 'HSK 7-9',
          examSystem: EXAM_SYSTEMS.HSK_3_0,
          skill: 'writing',
          part: entry.part,
          questionType: 'essay',
          question_type: 'free_writing',
          section: 'writing',
          part_type: 'writing',
          part_number: entry.part,
          question_number: idx + 1,
          prompt: `${entry.item.title}\n${entry.item.promptZh}`,
          writing_criteria: entry.item.recommendedKeywords || [],
          sample_answer: entry.item.sampleEssay || '',
          explanation: `Mục tiêu ${entry.item.targetChars || 250} chữ. Từ khóa học thuật: ${(entry.item.recommendedKeywords || []).join(', ')}`,
          is_subjective: true,
          min_words: Math.round((entry.item.targetChars || 200) * 0.4),
          max_words: (entry.item.targetChars || 250) + 250,
          points: idx === 0 ? 20 : 40,
        });
      });
    } else if (sec.id === 'speaking' && sec.debateTopicZh) {
      out.push({
        id: 'hsk30-h79-S-1',
        exam_id: 'hsk30-h79-bank',
        level: 'HSK 7-9',
        examSystem: EXAM_SYSTEMS.HSK_3_0,
        skill: 'speaking',
        part: 3,
        questionType: 'speaking',
        question_type: 'speaking',
        section: 'speaking',
        part_type: 'speaking',
        part_number: 3,
        question_number: 1,
        prompt: sec.debateTopicZh,
        translation: sec.debateTopicVi,
        writing_criteria: sec.requiredDiscourseMarkers || [],
        sample_answer: sec.modelSpeechZh || '',
        explanation: `Yêu cầu dùng kết nối học thuật: ${(sec.requiredDiscourseMarkers || []).join(', ')}`,
        is_subjective: true,
        min_words: 30,
        max_words: 500,
        points: 60,
      });
    }
  }

  return out;
}

const CURATED_HSK_79_BANK = buildHsk79CuratedBank();
const HSK30_REGISTERED_BANKS = new Map();
const HSK20_EXPANSION_BANKS = new Map();

function normalizeLevelLookupKey(level = 'HSK 1') {
  return String(level || 'HSK 1')
    .replace(/–/g, '-')
    .trim()
    .toUpperCase()
    .replace(/^HSK\s*/, 'HSK ');
}

/**
 * Đăng ký ngân hàng câu hỏi bổ sung HSK 2.0 (125 câu cho HSK 3, 4, 5) để đạt 100% định mức chuẩn.
 */
export function registerHsk20ExpansionQuestions(questions = []) {
  HSK20_EXPANSION_BANKS.clear();
  for (const rawQ of Array.isArray(questions) ? questions : []) {
    const lvlKey = normalizeLevelLookupKey(rawQ?.level || 'HSK 3');
    if (!HSK20_EXPANSION_BANKS.has(lvlKey)) {
      HSK20_EXPANSION_BANKS.set(lvlKey, []);
    }
    HSK20_EXPANSION_BANKS.get(lvlKey).push(normalizeQuestionForDualSystem(rawQ, EXAM_SYSTEMS.HSK_2_0));
  }
  return HSK20_EXPANSION_BANKS;
}

/**
 * Đăng ký ngân hàng câu hỏi chuẩn HSK 3.0 đã nạp động qua src/data/hsk30/index.js.
 */
export function registerHsk30LevelBank(levelInput, bankPayload) {
  const key = normalizeLevelLookupKey(levelInput);
  if (!bankPayload) return null;
  const normalizedBank = {
    ...bankPayload,
    level: key,
    questions: Array.isArray(bankPayload.questions)
      ? bankPayload.questions.map((q) => normalizeQuestionForDualSystem(q, EXAM_SYSTEMS.HSK_3_0))
      : [],
    speakingTasks: Array.isArray(bankPayload.speakingTasks)
      ? bankPayload.speakingTasks.map((q) => normalizeQuestionForDualSystem(q, EXAM_SYSTEMS.HSK_3_0))
      : [],
  };
  HSK30_REGISTERED_BANKS.set(key, normalizedBank);
  return normalizedBank;
}

export function getRegisteredHsk30Bank(levelInput = 'HSK 1') {
  return HSK30_REGISTERED_BANKS.get(normalizeLevelLookupKey(levelInput)) || null;
}

function getQuestionBankByLevel(level = 'HSK 1', examSystem = EXAM_SYSTEMS.HSK_3_0) {
  const normalizedLevel = normalizeLevelLookupKey(level);

  if (examSystem === EXAM_SYSTEMS.HSK_3_0 && HSK30_REGISTERED_BANKS.has(normalizedLevel)) {
    return HSK30_REGISTERED_BANKS.get(normalizedLevel).questions;
  }

  if (normalizedLevel === 'HSK 7-9') {
    return CURATED_HSK_79_BANK.map((q) => normalizeQuestionForDualSystem(q, EXAM_SYSTEMS.HSK_3_0));
  }

  const examLevelMap = new Map(HSK_EXAMS.map((e) => [e.id, e]));
  const baseQuestions = HSK_QUESTIONS.filter((q) => {
    const parent = examLevelMap.get(q.exam_id);
    const qLvl = normalizeLevelLookupKey(q.level || parent?.level || '');
    return qLvl === normalizedLevel;
  }).map((q) => {
    const parent = examLevelMap.get(q.exam_id);
    return normalizeQuestionForDualSystem(q, parent?.examSystem || EXAM_SYSTEMS.HSK_2_0);
  });

  if (examSystem === EXAM_SYSTEMS.HSK_2_0 && HSK20_EXPANSION_BANKS.has(normalizedLevel)) {
    const existingIds = new Set(baseQuestions.map((q) => q.id));
    const expansion = HSK20_EXPANSION_BANKS.get(normalizedLevel).filter((q) => !existingIds.has(q.id));
    return [...baseQuestions, ...expansion];
  }

  return baseQuestions;
}

/**
 * Smart Exam Assembler:
 * Lắp ráp đề theo chuẩn Blueprint HSK 2.0 / HSK 3.0 cho 3 chế độ (full_exam / by_skill / by_part).
 * Tuyệt đối KHÔNG tự sinh câu hỏi rác hoặc nhân bản lặp câu hỏi khi ngân hàng cục bộ chưa đủ 100%.
 */
export function assembleDualSystemExam({
  examSystem = EXAM_SYSTEMS.HSK_3_0,
  level = 'HSK 1',
  mode = EXAM_MODES.FULL_EXAM,
  skill = null,
  part = null,
} = {}) {
  const blueprint = getBlueprint(examSystem, level);
  const bankPool = getQuestionBankByLevel(blueprint.level, examSystem);
  const registeredHsk30 = examSystem === EXAM_SYSTEMS.HSK_3_0 ? getRegisteredHsk30Bank(blueprint.level) : null;

  let targetSkills = Object.entries(blueprint.skills || {})
    .filter(([, cfg]) => cfg && cfg.count > 0)
    .map(([sk]) => sk);

  if ((mode === EXAM_MODES.BY_SKILL || mode === EXAM_MODES.BY_PART) && skill) {
    const normSkill = normalizeSkill(skill);
    if (blueprint.skills?.[normSkill]?.count > 0) {
      targetSkills = [normSkill];
    }
  }

  const selected = [];
  const usedIds = new Set();
  let blueprintTargetCount = 0;
  const perSkillCoverage = {};

  for (const sk of targetSkills) {
    const skillCfg = blueprint.skills[sk];
    if (!skillCfg) continue;

    const targetParts =
      mode === EXAM_MODES.BY_PART && part
        ? skillCfg.parts.filter((p) => Number(p.part) === Number(part))
        : skillCfg.parts;

    const skillPool = bankPool.filter((q) => q.skill === sk);
    let skillBlueprintCount = 0;
    let skillAssembledCount = 0;

    for (const pCfg of targetParts) {
      skillBlueprintCount += pCfg.count;
      const partMatches = skillPool.filter((q) => !usedIds.has(q.id) && Number(q.part) === Number(pCfg.part));
      const fallbackSkillMatches = skillPool.filter((q) => !usedIds.has(q.id));
      const combined = [...partMatches, ...fallbackSkillMatches.filter((q) => !partMatches.includes(q))];

      const slice = combined.slice(0, pCfg.count);
      for (const item of slice) {
        if (!usedIds.has(item.id)) {
          usedIds.add(item.id);
          selected.push({
            ...item,
            examSystem,
            part: pCfg.part,
            part_number: pCfg.part,
            question_number: selected.length + 1,
          });
          skillAssembledCount += 1;
        }
      }
    }

    blueprintTargetCount += skillBlueprintCount;
    perSkillCoverage[sk] = {
      targetCount: skillBlueprintCount,
      assembledCount: skillAssembledCount,
      durationMinutes: skillCfg.durationMinutes || Math.max(10, Math.round((blueprint.durationMinutes * skillBlueprintCount) / Math.max(1, blueprint.totalQuestions))),
    };
  }

  const assembledCount = selected.length;
  const coverageRatio = blueprintTargetCount > 0 ? Number((assembledCount / blueprintTargetCount).toFixed(2)) : 0;
  const isCondensedBank = assembledCount < blueprintTargetCount;

  const durationMinutes =
    mode === EXAM_MODES.FULL_EXAM
      ? blueprint.durationMinutes
      : Object.values(perSkillCoverage).reduce((sum, s) => sum + (s.durationMinutes || 0), 0) || 20;

  const systemLabel = examSystem === EXAM_SYSTEMS.HSK_3_0 ? 'HSK 3.0' : 'HSK 2.0';
  const modeSuffix =
    mode === EXAM_MODES.BY_PART && skill && part
      ? `${SKILL_LABELS_VI[normalizeSkill(skill)] || skill} - Phần ${part}`
      : mode === EXAM_MODES.BY_SKILL && skill
        ? SKILL_LABELS_VI[normalizeSkill(skill)] || skill
        : 'Đề Thi Thử Toàn Phần';

  const assembledExam = {
    id: `dual-${examSystem}-${blueprint.level.toLowerCase().replace(/[^a-z0-9]/g, '')}-${mode}${skill ? `-${normalizeSkill(skill)}` : ''}${part ? `-p${part}` : ''}`,
    examSystem,
    mode,
    level: blueprint.level,
    title: `${systemLabel} • ${blueprint.level} — ${modeSuffix}`,
    description:
      examSystem === EXAM_SYSTEMS.HSK_3_0
        ? `Đề thi số 1 chuẩn ${blueprint.level} (HSK 3.0) đầy đủ ${assembledCount}/${blueprintTargetCount} câu theo cấu trúc phần thi quốc tế mới (${durationMinutes} phút).`
        : `Đề thi số 1 toàn phần chuẩn ${blueprint.level} (HSK 2.0) đầy đủ ${assembledCount}/${blueprintTargetCount} câu (${durationMinutes} phút, thang điểm ${blueprint.maxScore}).`,
    exam_version: examSystem === EXAM_SYSTEMS.HSK_3_0 ? 'HSK 3.0 Standard' : 'HSK 2.0 Full Standard',
    exam_type: 'mock',
    skill_category: targetSkills.length === 1 ? targetSkills[0] : 'mixed',
    duration_minutes: durationMinutes,
    total_questions: assembledCount,
    blueprint_total_questions: blueprintTargetCount,
    passing_score: blueprint.passingScore,
    max_score: blueprint.maxScore,
    speakingMode: blueprint.speakingMode || 'none',
    separateSpeakingQuestions: blueprint.separateSpeakingQuestions || (registeredHsk30?.speakingTasks?.length || 0),
    separateSpeakingMinutes: blueprint.separateSpeakingMinutes || 0,
    separateSpeakingTasks: registeredHsk30?.speakingTasks || [],
    levelThresholds: blueprint.levelThresholds || null,
    source_author: 'Ban Học Thuật & Khảo Thí HanziGo',
    license: 'CC BY-NC-SA 4.0 (Nội dung học thuật biên soạn độc lập)',
    permission_status: 'original_content',
    verified_date: '2026-11-24',
    is_published: true,
    bankCoverage: {
      blueprintTotalQuestions: blueprintTargetCount,
      assembledQuestionsCount: assembledCount,
      coverageRatio,
      isCondensedBank,
      coverageLabelVi: isCondensedBank
        ? `Đề rút gọn theo ngân hàng hiện có (${assembledCount}/${blueprintTargetCount} câu chuẩn — không sinh câu lặp)`
        : `Đề chuẩn đầy đủ (${assembledCount}/${blueprintTargetCount} câu)`,
      perSkillCoverage,
    },
    questions: selected,
  };

  registerDynamicExam(assembledExam);
  return assembledExam;
}

/**
 * Chấm điểm tức thì cho các dạng câu hỏi khách quan (mcq, true_false, fill_blank, reorder).
 */
export function autoGradeObjectiveAnswers(questions = [], userAnswers = {}) {
  const details = [];
  let correctCount = 0;
  let totalObjectiveCount = 0;
  let earnedPoints = 0;
  let maxObjectivePoints = 0;

  for (const q of questions) {
    const qType = normalizeQuestionType(q);
    if (qType === 'essay' || qType === 'translation' || qType === 'speaking' || q.is_subjective) {
      continue;
    }

    totalObjectiveCount += 1;
    const pts = Number(q.points) || 10;
    maxObjectivePoints += pts;

    const userAns = userAnswers[q.id];
    let isCorrect = false;

    if (qType === 'reorder') {
      const expectedTokens = q.correct_order || q.correctOrder || [];
      const accepted = Array.isArray(q.accepted_answers) ? q.accepted_answers : [];
      if (Array.isArray(userAns) && expectedTokens.length > 0) {
        const joinedUser = userAns.join('').replace(/[。\s-]/g, '').trim().toLowerCase();
        const joinedExpected = expectedTokens.join('').replace(/[。\s-]/g, '').trim().toLowerCase();
        isCorrect =
          joinedUser === joinedExpected ||
          accepted.some((a) => String(a).replace(/[。\s-]/g, '').trim().toLowerCase() === joinedUser);
      } else if (typeof userAns === 'string') {
        const cleanUser = userAns.replace(/[。\s-]/g, '').trim().toLowerCase();
        const cleanExpected = String(q.correct_sentence || q.expectedAnswer || '').replace(/[。\s-]/g, '').trim().toLowerCase();
        isCorrect =
          Boolean(cleanUser) &&
          ((cleanExpected && cleanUser === cleanExpected) ||
            accepted.some((a) => String(a).replace(/[。\s-]/g, '').trim().toLowerCase() === cleanUser));
      } else if (typeof userAns === 'number' && typeof q.correct_option_index === 'number') {
        isCorrect = userAns === q.correct_option_index;
      }
    } else if (qType === 'fill_blank') {
      if (typeof userAns === 'number' && typeof q.correct_option_index === 'number') {
        isCorrect = userAns === q.correct_option_index;
      } else if (typeof userAns === 'string') {
        const cleanUser = userAns.trim().toLowerCase();
        const accepted = Array.isArray(q.accepted_answers) ? q.accepted_answers : [];
        const expectedIdx = q.correct_option_index;
        const optText =
          typeof expectedIdx === 'number' && Array.isArray(q.options) && q.options[expectedIdx]
            ? q.options[expectedIdx].text || q.options[expectedIdx]
            : '';
        isCorrect =
          Boolean(cleanUser) &&
          (accepted.some((a) => String(a).trim().toLowerCase() === cleanUser) ||
            (optText && String(optText).trim().toLowerCase() === cleanUser));
      }
    } else {
      // mcq & true_false
      const expectedIdx =
        typeof q.correct_option_index === 'number'
          ? q.correct_option_index
          : typeof q.correctIndex === 'number'
            ? q.correctIndex
            : 0;
      isCorrect = Number(userAns) === expectedIdx;
    }

    if (isCorrect) {
      correctCount += 1;
      earnedPoints += pts;
    }

    details.push({
      questionId: q.id,
      questionType: qType,
      skill: normalizeSkill(q.skill || q.section || q.part_type),
      isCorrect,
      pointsAwarded: isCorrect ? pts : 0,
      maxPoints: pts,
      userAnswer: userAns,
      explanation: q.explanation || q.explanationVi || '',
    });
  }

  return {
    totalObjectiveCount,
    correctCount,
    accuracyPct: totalObjectiveCount > 0 ? Math.round((correctCount / totalObjectiveCount) * 100) : 0,
    earnedPoints,
    maxObjectivePoints,
    details,
  };
}

/**
 * Deterministic rubric grader khi offline hoặc AI unavailable (không dùng random).
 */
export function deterministicGradeSubjective(question = {}, userAnswer = '', level = 'HSK 5') {
  const clean = String(userAnswer || '').trim();
  if (!clean) {
    return {
      overallScore: 0,
      dimensions: { vocabulary: 0, grammar: 0, coherence: 0, accuracy: 0 },
      feedbackVi: 'Chưa có nội dung bài làm để chấm.',
      gradingSource: 'deterministic_rubric_fallback',
    };
  }

  const cjkChars = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  const targetMin = Math.max(10, Number(question.min_words) || 30);
  const lengthRatio = Math.min(1, (cjkChars > 0 ? cjkChars : clean.split(/\s+/).length) / targetMin);

  const keywords = Array.isArray(question.writing_criteria)
    ? question.writing_criteria.map((c) => (typeof c === 'string' ? c : c?.name || '')).filter(Boolean)
    : [];
  const matchedKeywords = keywords.filter((kw) => clean.includes(kw));
  const keywordRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0.75;

  const baseScore = Math.round(lengthRatio * 55 + keywordRatio * 45);
  const clamped = Math.max(20, Math.min(95, baseScore));

  return {
    overallScore: clamped,
    dimensions: {
      vocabulary: Math.round(clamped * 0.25),
      grammar: Math.round(clamped * 0.25),
      coherence: Math.round(clamped * 0.25),
      accuracy: Math.round(clamped * 0.25),
    },
    matchedKeywords,
    feedbackVi: `Đánh giá rubric ngoại tuyến (${level}): đạt ${clamped}/100đ (${cjkChars} chữ Hán, khớp ${matchedKeywords.length}/${keywords.length} từ khóa mục tiêu).`,
    gradingSource: 'deterministic_rubric_fallback',
  };
}

/**
 * Chấm bài tự luận, dịch thuật & nói theo Rubric:
 * Tái sử dụng /api/ai/grade (Viết/Dịch) & /api/ai/pronunciation (Nói) kèm deterministic fallback.
 */
export async function gradeSubjectiveSubmission({
  question = {},
  userAnswer = '',
  level = 'HSK 5',
  fetchFn = typeof fetch === 'function' ? fetch : null,
} = {}) {
  const skill = normalizeSkill(question.skill || question.section || question.part_type);
  const cleanAnswer = String(userAnswer || '').trim();

  if (!cleanAnswer) {
    return deterministicGradeSubjective(question, cleanAnswer, level);
  }

  if (fetchFn) {
    try {
      if (skill === 'speaking') {
        const res = await fetchFn('/api/ai/pronunciation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetHanzi: String(question.prompt || '').slice(0, 180),
            spokenTranscript: cleanAnswer,
            hskLevel: level,
          }),
        });
        if (res?.ok) {
          const data = await res.json();
          const r = data?.result || data;
          const overall = Number(r?.overall);
          if (Number.isFinite(overall)) {
            return {
              overallScore: overall,
              dimensions: {
                vocabulary: Number(r.accuracyScore || overall),
                grammar: Number(r.fluencyScore || overall),
                coherence: Number(r.toneScore || overall),
                accuracy: overall,
              },
              feedbackVi: r.feedback || 'Đã thẩm định khẩu ngữ bằng AI.',
              gradingSource: 'ai_pronunciation',
            };
          }
        }
      } else {
        const isTranslation = skill === 'translation' || question.questionType === 'translation';
        const res = await fetchFn('/api/ai/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isTranslation
              ? {
                  type: 'translation',
                  sourceText: question.sourceText || question.prompt || '',
                  direction: question.direction || 'zh_to_vi',
                  requiredKeywords: question.writing_criteria || [],
                  userOutput: cleanAnswer,
                }
              : {
                  type: 'writing',
                  task: {
                    hskLevel: level,
                    promptText: question.prompt || '',
                    mandatoryKeywords: question.writing_criteria || [],
                    targetMinChars: question.min_words || 60,
                    targetMaxChars: question.max_words || 400,
                  },
                  responseText: cleanAnswer,
                }
          ),
        });
        if (res?.ok) {
          const data = await res.json();
          const r = data?.result || data;
          const dim = r?.dimensions;
          const overall = Number.isFinite(Number(r?.overall_score))
            ? Number(r.overall_score)
            : dim
              ? Number(dim.task_fulfillment || 0) +
                Number(dim.grammar_accuracy || 0) +
                Number(dim.vocabulary_richness || 0) +
                Number(dim.coherence_cohesion || 0)
              : null;
          if (Number.isFinite(overall)) {
            return {
              overallScore: overall,
              dimensions: dim || {
                accuracy: Number(r?.accuracy_score || overall),
                grammar: Number(r?.grammar_score || overall),
                coherence: Number(r?.naturalness_score || overall),
              },
              feedbackVi: r?.detailed_feedback_vi || 'Đã chấm điểm theo Rubric AI chuẩn HSK.',
              gradingSource: 'ai_grade',
            };
          }
        }
      }
    } catch {
      // Fall back to deterministic rubric scorer below
    }
  }

  return deterministicGradeSubjective(question, cleanAnswer, level);
}

/**
 * Tạo câu hỏi gợi ý sẵn để chuyển sang Lão Sư AI sau khi nộp bài (cấm gọi khi đang làm bài).
 */
export function buildAskAiTutorPromptForQuestion(question = {}, userAnswer = null) {
  const promptText = String(question.prompt || '').slice(0, 260);
  const userChoice =
    typeof userAnswer === 'number' && Array.isArray(question.options) && question.options[userAnswer]
      ? question.options[userAnswer].text || question.options[userAnswer]
      : userAnswer || 'Chưa trả lời';
  return `Hãy giải thích chi tiết câu HSK này giúp mình vì sao đáp án đúng là vậy và lỗi sai nếu chọn "${userChoice}":\n"${promptText}"`;
}

export function resolveHsk79BandFromScore(totalScore = 0) {
  const s = Number(totalScore) || 0;
  if (s >= 240) return 'HSK 9';
  if (s >= 210) return 'HSK 8';
  if (s >= 180) return 'HSK 7';
  return 'Chưa đạt HSK 7';
}

/**
 * Phân tích kết quả sau khi nộp bài: điểm từng kỹ năng, tỷ lệ đúng, xếp hạng HSK 7–9 & câu sai.
 */
export function analyzeDualExamAttempt({
  exam = {},
  questions = [],
  userAnswers = {},
  subjectiveGrades = {},
  timeSpentSeconds = 0,
} = {}) {
  const skillBuckets = {};
  const wrongQuestions = [];
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalEarnedPoints = 0;
  let totalMaxPoints = 0;

  const ensureBucket = (sk) => {
    if (!skillBuckets[sk]) {
      skillBuckets[sk] = {
        skill: sk,
        labelVi: SKILL_LABELS_VI[sk] || sk,
        totalQuestions: 0,
        correctQuestions: 0,
        earnedPoints: 0,
        maxPoints: 0,
        accuracyPct: 0,
      };
    }
    return skillBuckets[sk];
  };

  for (const q of questions) {
    const sk = normalizeSkill(q.skill || q.section || q.part_type);
    const qType = normalizeQuestionType(q);
    const pts = Number(q.points) || 10;
    const bucket = ensureBucket(sk);
    totalQuestions += 1;
    bucket.totalQuestions += 1;
    totalMaxPoints += pts;
    bucket.maxPoints += pts;

    if (qType === 'essay' || qType === 'translation' || qType === 'speaking' || q.is_subjective) {
      const subGrade = subjectiveGrades[q.id];
      const pct = subGrade ? Math.max(0, Math.min(100, Number(subGrade.overallScore) || 0)) : 0;
      const awarded = Number(((pts * pct) / 100).toFixed(1));
      totalEarnedPoints += awarded;
      bucket.earnedPoints += awarded;
      if (pct >= 60) {
        totalCorrect += 1;
        bucket.correctQuestions += 1;
      } else {
        wrongQuestions.push({
          ...q,
          userAnswer: userAnswers[q.id] || '',
          feedbackVi: subGrade?.feedbackVi || '',
          askAiTutorPrompt: buildAskAiTutorPromptForQuestion(q, userAnswers[q.id]),
        });
      }
    } else {
      const obj = autoGradeObjectiveAnswers([q], userAnswers);
      const item = obj.details[0];
      if (item?.isCorrect) {
        totalCorrect += 1;
        bucket.correctQuestions += 1;
        totalEarnedPoints += pts;
        bucket.earnedPoints += pts;
      } else {
        wrongQuestions.push({
          ...q,
          userAnswer: userAnswers[q.id],
          askAiTutorPrompt: buildAskAiTutorPromptForQuestion(q, userAnswers[q.id]),
        });
      }
    }
  }

  for (const bucket of Object.values(skillBuckets)) {
    bucket.accuracyPct =
      bucket.totalQuestions > 0 ? Math.round((bucket.correctQuestions / bucket.totalQuestions) * 100) : 0;
  }

  const maxScore = Number(exam.max_score) || 300;
  const accuracyPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const scaledScore = totalMaxPoints > 0 ? Math.round((totalEarnedPoints / totalMaxPoints) * maxScore) : 0;
  const passingScore = Number(exam.passing_score) || Math.round(maxScore * 0.6);
  const isHsk79 = String(exam.level || '').replace(/–/g, '-').includes('7-9');

  return {
    examId: exam.id || '',
    examTitle: exam.title || '',
    examSystem: exam.examSystem || EXAM_SYSTEMS.HSK_2_0,
    level: exam.level || 'HSK 1',
    mode: exam.mode || EXAM_MODES.FULL_EXAM,
    totalScore: scaledScore,
    maxScore,
    passingScore,
    passed: scaledScore >= passingScore,
    accuracyPct,
    totalQuestions,
    correctCount: totalCorrect,
    incorrectCount: wrongQuestions.length,
    certifiedBand: isHsk79 ? resolveHsk79BandFromScore(scaledScore) : scaledScore >= passingScore ? exam.level : 'Chưa đạt',
    skillBreakdown: skillBuckets,
    wrongQuestions,
    timeSpentSeconds,
    createdAt: new Date().toISOString(),
  };
}

const DUAL_HISTORY_PREFIX = 'hanzigo_dual_exam_history';

function getDualHistoryStorageKey(userId = 'guest') {
  return `${DUAL_HISTORY_PREFIX}_${String(userId || 'guest')}`;
}

export function saveDualExamHistoryRecord({ user = null, analytics = {} } = {}) {
  const userId = user?.id || user?.uid || 'guest';
  const key = getDualHistoryStorageKey(userId);
  const record = {
    id: `dual-att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId,
    examSystem: analytics.examSystem || EXAM_SYSTEMS.HSK_2_0,
    level: analytics.level || 'HSK 1',
    mode: analytics.mode || EXAM_MODES.FULL_EXAM,
    practiceMode: analytics.practiceMode === 'learning' || analytics.practiceMode === PRACTICE_MODES.LEARNING ? 'learning' : 'exam',
    examId: analytics.examId || '',
    examTitle: analytics.examTitle || '',
    totalScore: Number(analytics.totalScore) || 0,
    maxScore: Number(analytics.maxScore) || 300,
    accuracyPct: Number(analytics.accuracyPct) || 0,
    passed: Boolean(analytics.passed),
    certifiedBand: analytics.certifiedBand || null,
    skillBreakdown: analytics.skillBreakdown || {},
    createdAt: analytics.createdAt || new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [record, ...(Array.isArray(existing) ? existing : [])].slice(0, 100);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}

  return record;
}

export function getDualExamHistory({ user = null, examSystem = 'all', level = 'all', mode = 'all', practiceMode = 'all' } = {}) {
  const userId = user?.id || user?.uid || 'guest';
  const key = getDualHistoryStorageKey(userId);
  let list = [];
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(raw)) list = raw;
  } catch {
    list = [];
  }

  return list.filter((item) => {
    if (examSystem !== 'all' && item.examSystem !== examSystem) return false;
    if (level !== 'all' && String(item.level || '').replace(/–/g, '-') !== String(level).replace(/–/g, '-')) return false;
    if (mode !== 'all' && item.mode !== mode) return false;
    if (practiceMode !== 'all') {
      const normalizedItemMode = item.practiceMode === 'learning' ? 'learning' : 'exam';
      const targetMode = practiceMode === 'learning' || practiceMode === PRACTICE_MODES.LEARNING ? 'learning' : 'exam';
      if (normalizedItemMode !== targetMode) return false;
    }
    return true;
  });
}

// =========================================================================
// LEARNING MODE HELPERS (Hướng dẫn tiếng Việt, Pinyin & Phản hồi tức thì)
// =========================================================================

export function getDefaultShowPinyinForLevel(level = 'HSK 1') {
  const num = parseInt(String(level || '1').replace(/\D/g, '') || '1', 10);
  return num <= 2;
}

export function getTextPinyinFromDict(text = '') {
  const clean = String(text || '').trim();
  if (!clean) return '';
  const hanziChars = clean.match(/[\u4e00-\u9fa5]/g) || [];
  if (hanziChars.length === 0) return '';
  const syllables = hanziChars.map((ch) => MINI_CHAR_PINYIN_MAP[ch] || '').filter(Boolean);
  if (syllables.length === 0) return '';
  return syllables.join(' ');
}

export function resolveQuestionPinyin(question = {}) {
  if (question.pinyin && String(question.pinyin).trim()) {
    return String(question.pinyin).trim();
  }
  const source = question.prompt || question.text || '';
  return getTextPinyinFromDict(source);
}

export function getVietnameseInstructionForQuestion(question = {}) {
  const skill = normalizeSkill(question.skill || question.section || question.part_type);
  const qType = normalizeQuestionType(question);

  if (skill === 'listening') {
    if (qType === 'true_false') return 'Nghe đoạn audio và phán đoán nhận định Đúng (对) hoặc Sai (错).';
    return 'Nghe đoạn hội thoại / thông báo và chọn đáp án đúng.';
  }
  if (skill === 'reading') {
    if (qType === 'true_false') return 'Đọc câu hoặc đoạn ngắn và phán đoán Đúng (对) hoặc Sai (错).';
    if (qType === 'fill_blank') return 'Chọn hoặc điền từ ngữ phù hợp nhất vào chỗ trống.';
    if (qType === 'reorder') return 'Sắp xếp thứ tự các câu / đoạn thành mạch văn hoàn chỉnh.';
    return 'Đọc ngữ liệu tiếng Trung và chọn phương án đúng nhất.';
  }
  if (skill === 'writing') {
    if (qType === 'reorder') return 'Sắp xếp các từ cho sẵn thành câu hoàn chỉnh đúng ngữ pháp.';
    if (qType === 'fill_blank') return 'Viết chữ Hán đúng theo Pinyin và ngữ cảnh câu.';
    return 'Viết câu hoặc đoạn văn tiếng Trung theo chủ đề / từ khóa gợi ý.';
  }
  if (skill === 'translation') {
    return 'Dịch đoạn văn sang tiếng Trung (hoặc tiếng Việt) đảm bảo đúng ngữ nghĩa và thuật ngữ.';
  }
  if (skill === 'speaking') {
    return 'Đọc to hoặc trình bày câu trả lời bằng tiếng Trung theo yêu cầu đề bài.';
  }
  return 'Đọc kỹ yêu cầu đề bài và chọn hoặc nhập phương án chính xác nhất.';
}

/**
 * Đánh giá tức thì 1 câu hỏi trong Learning Mode.
 * BẢO MẬT CBT: Chặn tuyệt đối nếu không ở chế độ learning_mode / practice.
 */
export function evaluateLearningQuestionFeedback({
  examId = '',
  questionId = '',
  userAnswer = null,
  practiceMode = PRACTICE_MODES.EXAM,
  fullExam = null,
} = {}) {
  const isLearning = practiceMode === PRACTICE_MODES.LEARNING || practiceMode === 'practice';
  if (!isLearning) {
    return {
      blocked: true,
      reason: 'Instant feedback is disabled in exam_mode to preserve CBT integrity.',
    };
  }

  const targetExam = fullExam || (examId ? getFullExamById(examId) : null);
  const question = targetExam?.questions?.find((q) => q.id === questionId);
  if (!question) {
    return {
      blocked: false,
      found: false,
      isCorrect: null,
      explanationVi: 'Không tìm thấy dữ liệu câu hỏi để đối chiếu.',
    };
  }

  const qType = normalizeQuestionType(question);
  const isSubjective = qType === 'essay' || qType === 'translation' || qType === 'speaking' || Boolean(question.is_subjective);

  let isCorrect = null;
  let correctIndex;
  let correctAnswerText = '';

  if (!isSubjective) {
    const graded = autoGradeObjectiveAnswers([question], { [question.id]: userAnswer });
    const detail = graded.details[0];
    isCorrect = Boolean(detail?.isCorrect);

    if (qType === 'mcq' || qType === 'true_false') {
      correctIndex =
        typeof question.correct_option_index === 'number'
          ? question.correct_option_index
          : typeof question.correctIndex === 'number'
            ? question.correctIndex
            : 0;
      const opt = Array.isArray(question.options) ? question.options[correctIndex] : null;
      correctAnswerText = opt ? opt.text || String(opt) : '';
    } else if (qType === 'reorder') {
      correctAnswerText =
        question.correct_sentence ||
        question.expectedAnswer ||
        (Array.isArray(question.correct_order) ? question.correct_order.join('') : '') ||
        '';
    } else if (qType === 'fill_blank') {
      correctAnswerText =
        question.expectedAnswer ||
        (Array.isArray(question.accepted_answers) && question.accepted_answers[0]) ||
        (Array.isArray(question.acceptedAnswers) && question.acceptedAnswers[0]) ||
        '';
    }
  } else {
    correctAnswerText = question.sampleAnswer || question.sample_answer || '';
  }

  return {
    blocked: false,
    found: true,
    questionId: question.id,
    questionType: qType,
    isSubjective,
    isCorrect,
    correctIndex,
    correctAnswerText,
    translationVi: question.translationVi || question.translation || '',
    explanationVi:
      question.explanationVi ||
      question.explanation ||
      'Hãy đối chiếu kỹ cấu trúc ngữ pháp và ngữ cảnh từ vựng trong câu.',
    grammarCodes: Array.isArray(question.target_grammar_codes) ? question.target_grammar_codes : [],
    relatedVocab: Array.isArray(question.relatedVocab) ? question.relatedVocab : [],
    sampleAnswer: question.sampleAnswer || question.sample_answer || '',
    rubric: Array.isArray(question.rubric)
      ? question.rubric
      : Array.isArray(question.writing_criteria)
        ? question.writing_criteria
        : [],
    askAiTutorPrompt: buildAskAiTutorPromptForQuestion(question, userAnswer),
  };
}

export function compareDualExamProgress(olderAttempt, newerAttempt) {
  if (!olderAttempt || !newerAttempt) return null;
  if (olderAttempt.examSystem !== newerAttempt.examSystem || olderAttempt.level !== newerAttempt.level) {
    return { compatible: false, reason: 'Chỉ so sánh các lượt thi cùng hệ thống (HSK 2.0/3.0) và cùng cấp độ.' };
  }
  return {
    compatible: true,
    scoreDelta: (newerAttempt.totalScore || 0) - (olderAttempt.totalScore || 0),
    accuracyDelta: (newerAttempt.accuracyPct || 0) - (olderAttempt.accuracyPct || 0),
  };
}
