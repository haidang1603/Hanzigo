/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: HANZI MASTERY SERVICE
 * =========================================================================
 * Nâng cao năng lực làm chủ chữ Hán theo lộ trình 6 bước khoa học:
 * Learn -> Trace -> Write -> Recognize -> Recall -> SRS
 * 
 * NGUYÊN TẮC:
 * 1. Không duplicate database từ vựng: Tận dụng trực tiếp VOCABULARY_LIST.
 * 2. Tích hợp sâu với thuật toán SuperMemo-2 (srsEngine) và lưu trữ SRS.
 * 3. Mỗi chữ Hán đầy đủ: Character, Pinyin, Tone, Meaning, Stroke Order,
 *    Radical, Mnemonic, Examples, Audio, Writing Practice.
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { extractTone } from '../utils/pronunciationEvaluator.js';
import { calculateNextSrsReview, SRS_QUALITY } from '../utils/srsEngine.js';
import { saveUserVocabSrsCard } from './vocabularyService.js';

// Danh mục nét bút Hán tự chuẩn hóa
export const STROKE_TYPES = {
  HENG: { code: 'heng', name: 'Nét ngang', symbol: '一' },
  SHU: { code: 'shu', name: 'Nét sổ', symbol: '丨' },
  PIE: { code: 'pie', name: 'Nét phẩy', symbol: '丿' },
  NA: { code: 'na', name: 'Nét mác', symbol: '㇏' },
  DIAN: { code: 'dian', name: 'Nét chấm', symbol: '丶' },
  TI: { code: 'ti', name: 'Nét hất', symbol: '㇀' },
  ZHE: { code: 'zhe', name: 'Nét gập', symbol: '𠃍' },
  GOU: { code: 'gou', name: 'Nét móc', symbol: '亅' }
};

// Từ điển chi tiết thứ tự nét và phân rã các chữ Hán căn bản
export const HANZI_STROKE_DECOMPOSITION = {
  '我': {
    strokes: [
      { step: 1, type: STROKE_TYPES.PIE, name: 'Phẩy ngắn (丿)', tip: 'Khởi bút từ trên chếch xuống trái' },
      { step: 2, type: STROKE_TYPES.HENG, name: 'Ngang (一)', tip: 'Ngang hơi chếch lên trên' },
      { step: 3, type: STROKE_TYPES.SHU, name: 'Sổ móc (亅)', tip: 'Sổ thẳng đứng và móc dứt khoát' },
      { step: 4, type: STROKE_TYPES.TI, name: 'Hất (㇀)', tip: 'Hất nhẹ từ dưới lên trên chếch phải' },
      { step: 5, type: STROKE_TYPES.ZHE, name: 'Nghiêng móc (戈)', tip: 'Nét nghiêng cung dài kèm móc nhọn' },
      { step: 6, type: STROKE_TYPES.PIE, name: 'Phẩy (丿)', tip: 'Phẩy thanh thoát ôm nét nghiêng' },
      { step: 7, type: STROKE_TYPES.DIAN, name: 'Chấm (丶)', tip: 'Chấm điểm trên cùng bên phải' }
    ],
    rule: 'Từ trên xuống dưới, từ trái sang phải, bộ thủ Qua (戈) bên phải'
  },
  '你': {
    strokes: [
      { step: 1, type: STROKE_TYPES.PIE, name: 'Phẩy (丿)', tip: 'Bộ nhân đứng: nét phẩy trái' },
      { step: 2, type: STROKE_TYPES.SHU, name: 'Sổ (丨)', tip: 'Bộ nhân đứng: nét sổ thẳng đứng' },
      { step: 3, type: STROKE_TYPES.PIE, name: 'Phẩy ngắn (丿)', tip: 'Nét phẩy trên chữ Nhĩ (尔)' },
      { step: 4, type: STROKE_TYPES.HENG, name: 'Ngang gập móc (𠃌)', tip: 'Ngang sang phải rồi gập móc' },
      { step: 5, type: STROKE_TYPES.SHU, name: 'Sổ móc (亅)', tip: 'Sổ thẳng chính giữa' },
      { step: 6, type: STROKE_TYPES.PIE, name: 'Phẩy nhỏ (丿)', tip: 'Phẩy ngắn bên trái' },
      { step: 7, type: STROKE_TYPES.DIAN, name: 'Chấm (丶)', tip: 'Nét chấm cân xứng bên phải' }
    ],
    rule: 'Trái trước phải sau (Bộ Nhân đứng trước, chữ Nhĩ sau)'
  },
  '好': {
    strokes: [
      { step: 1, type: STROKE_TYPES.PIE, name: 'Phẩy chấm (ㄑ)', tip: 'Bộ Nữ: phẩy kết hợp chấm dài' },
      { step: 2, type: STROKE_TYPES.PIE, name: 'Phẩy (丿)', tip: 'Bộ Nữ: nét phẩy trái' },
      { step: 3, type: STROKE_TYPES.TI, name: 'Hất (㇀)', tip: 'Bộ Nữ: nét hất ngang không vượt qua phẩy' },
      { step: 4, type: STROKE_TYPES.ZHE, name: 'Ngang gập (𠃍)', tip: 'Bộ Tử: nét ngang gập' },
      { step: 5, type: STROKE_TYPES.SHU, name: 'Cong móc (㇁)', tip: 'Bộ Tử: nét cong móc duyên dáng' },
      { step: 6, type: STROKE_TYPES.HENG, name: 'Ngang (一)', tip: 'Bộ Tử: nét ngang dài đỡ trọn chữ' }
    ],
    rule: 'Trái trước phải sau (Người phụ nữ 女 bồng đứa con 子 là điều tốt đẹp 好)'
  },
  '学': {
    strokes: [
      { step: 1, type: STROKE_TYPES.DIAN, name: 'Chấm (丶)', tip: 'Chấm trái' },
      { step: 2, type: STROKE_TYPES.DIAN, name: 'Chấm (丶)', tip: 'Chấm giữa' },
      { step: 3, type: STROKE_TYPES.PIE, name: 'Phẩy (丿)', tip: 'Phẩy phải' },
      { step: 4, type: STROKE_TYPES.DIAN, name: 'Chấm (丶)', tip: 'Bộ Miên: chấm đỉnh' },
      { step: 5, type: STROKE_TYPES.ZHE, name: 'Ngang móc (乛)', tip: 'Bộ Miên: ngang móc bao bọc' },
      { step: 6, type: STROKE_TYPES.ZHE, name: 'Ngang gập (𠃍)', tip: 'Bộ Tử bên dưới: ngang gập' },
      { step: 7, type: STROKE_TYPES.SHU, name: 'Cong móc (㇁)', tip: 'Bộ Tử: cong móc' },
      { step: 8, type: STROKE_TYPES.HENG, name: 'Ngang (一)', tip: 'Bộ Tử: ngang đáy' }
    ],
    rule: 'Trên trước dưới sau, ngoài trước trong sau'
  },
  '生': {
    strokes: [
      { step: 1, type: STROKE_TYPES.PIE, name: 'Phẩy ngắn (丿)', tip: 'Phẩy trên cùng bên trái' },
      { step: 2, type: STROKE_TYPES.HENG, name: 'Ngang (一)', tip: 'Ngang thứ nhất' },
      { step: 3, type: STROKE_TYPES.SHU, name: 'Sổ (丨)', tip: 'Sổ đứng xuyên thẳng' },
      { step: 4, type: STROKE_TYPES.HENG, name: 'Ngang ngắn (一)', tip: 'Ngang thứ hai' },
      { step: 5, type: STROKE_TYPES.HENG, name: 'Ngang dài (一)', tip: 'Ngang thứ ba dài nhất đỡ toàn chữ' }
    ],
    rule: 'Trên trước dưới sau, nét ngang đáy viết sau cùng'
  }
};

export const MASTERY_FLOW_STEPS = [
  { id: 'learn', name: 'Learn', title: 'Khám phá Hán tự', icon: 'BookOpen' },
  { id: 'trace', name: 'Trace', title: 'Tô đồ nét chuẩn', icon: 'PenTool' },
  { id: 'write', name: 'Write', title: 'Tự viết Hán tự', icon: 'Edit3' },
  { id: 'recognize', name: 'Recognize', title: 'Nhận diện mặt chữ', icon: 'Eye' },
  { id: 'recall', name: 'Recall', title: 'Truy xuất trí nhớ', icon: 'Brain' },
  { id: 'srs', name: 'SRS', title: 'Đưa vào Spaced Repetition', icon: 'Repeat' }
];

/**
 * Trích xuất toàn bộ thông tin chi tiết một Hanzi dựa trên VOCABULARY_LIST
 * Đảm bảo KHÔNG duplicate database.
 */
export function getHanziMasteryItem(identifier) {
  let vocab = null;

  if (typeof identifier === 'number') {
    vocab = VOCABULARY_LIST.find(v => v.id === identifier);
  } else if (typeof identifier === 'string') {
    // Ưu tiên khớp chính xác trước, sau đó mới tìm từ chứa chữ này
    vocab = VOCABULARY_LIST.find(v => v.hanzi === identifier) || 
            VOCABULARY_LIST.find(v => v.hanzi.includes(identifier));
  }

  // Nếu không tìm thấy, mặc định lấy chữ đầu tiên trong VOCABULARY_LIST
  if (!vocab) {
    vocab = VOCABULARY_LIST[0];
  }

  // Tách ký tự mục tiêu: nếu người dùng truyền vào 1 chữ Hán cụ thể trong từ thì ưu tiên chữ đó
  const char = (typeof identifier === 'string' && Array.from(vocab.hanzi).includes(identifier))
    ? identifier
    : (Array.from(vocab.hanzi)[0] || vocab.hanzi);
  const tone = extractTone(vocab.pinyin);

  // Tra cứu bảng nét chuẩn hoặc sinh nét dự phòng thông minh
  const decomp = HANZI_STROKE_DECOMPOSITION[char] || {
    strokes: Array.from({ length: Number(vocab.strokes) || 6 }).map((_, i) => ({
      step: i + 1,
      type: STROKE_TYPES.HENG,
      name: `Nét thứ ${i + 1}`,
      tip: 'Viết theo quy tắc: Trên trước dưới sau, trái trước phải sau.'
    })),
    rule: 'Trái trước phải sau, trên trước dưới sau, ngoài trước trong sau.'
  };

  return {
    sourceVocabId: vocab.id,
    character: char,
    fullWord: vocab.hanzi,
    pinyin: vocab.pinyin,
    tone,
    hanviet: vocab.hanviet,
    meaning: vocab.meaning,
    level: vocab.level,
    radical: vocab.radical,
    strokesCount: Number(vocab.strokes) || decomp.strokes.length,
    strokeOrder: decomp.strokes,
    writingRule: decomp.rule,
    mnemonic: vocab.mnemonic || `Chữ "${char}" có bộ thủ "${vocab.radical}". Nhớ nét để viết đẹp.`,
    example: vocab.example || {
      hanzi: `${vocab.hanzi}很好。`,
      pinyin: `${vocab.pinyin} hěn hǎo.`,
      meaning: `${vocab.meaning} rất tốt.`
    },
    audio: {
      text: char,
      fullText: vocab.hanzi,
      pinyin: vocab.pinyin
    }
  };
}

/**
 * Tạo câu hỏi trắc nghiệm nhận diện (Recognize step)
 * Cho chữ Hán -> Yêu cầu người dùng chọn đúng nghĩa / pinyin
 */
export function generateRecognizeQuiz(masteryItem, pool = VOCABULARY_LIST) {
  const distractors = pool
    .filter(v => v.hanzi !== masteryItem.character && v.hanzi !== masteryItem.fullWord)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [
    { text: `${masteryItem.meaning} (${masteryItem.pinyin})`, isCorrect: true },
    ...distractors.map(d => ({ text: `${d.meaning} (${d.pinyin})`, isCorrect: false }))
  ].sort(() => 0.5 - Math.random());

  return {
    type: 'recognize',
    promptHanzi: masteryItem.character,
    pinyin: masteryItem.pinyin,
    question: `Chữ Hán "${masteryItem.character}" mang ý nghĩa gì?`,
    options
  };
}

/**
 * Tạo câu hỏi truy xuất trí nhớ (Recall step)
 * Cho nghĩa tiếng Việt & Pinyin -> Yêu cầu chọn đúng chữ Hán
 */
export function generateRecallQuiz(masteryItem, pool = VOCABULARY_LIST) {
  const distractors = pool
    .filter(v => v.hanzi !== masteryItem.character && v.hanzi !== masteryItem.fullWord)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [
    { hanzi: masteryItem.character, isCorrect: true },
    ...distractors.map(d => ({ hanzi: Array.from(d.hanzi)[0], isCorrect: false }))
  ].sort(() => 0.5 - Math.random());

  return {
    type: 'recall',
    promptMeaning: masteryItem.meaning,
    pinyin: masteryItem.pinyin,
    question: `Tìm chữ Hán biểu thị: "${masteryItem.meaning}" (${masteryItem.pinyin})`,
    options
  };
}

/**
 * Cập nhật tiến độ Mastery qua 6 bước
 */
export function advanceMasteryFlow({ currentStepIndex = 0, stepSuccess = true, masteryItem }) {
  const nextStepIndex = stepSuccess ? Math.min(MASTERY_FLOW_STEPS.length - 1, currentStepIndex + 1) : currentStepIndex;
  const isCompleted = currentStepIndex >= MASTERY_FLOW_STEPS.length - 1 && stepSuccess;

  return {
    previousStep: MASTERY_FLOW_STEPS[currentStepIndex].id,
    currentStep: MASTERY_FLOW_STEPS[nextStepIndex].id,
    nextStepIndex,
    isCompleted,
    masteryItem
  };
}

/**
 * Đưa Hanzi đã hoàn thành vào chu kỳ lặp lại ngắt quãng SM-2 SRS
 */
export async function syncHanziToSrs(userId, masteryItem, quality = SRS_QUALITY.GOOD) {
  if (!masteryItem) return null;

  const currentCard = {
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.50
  };

  const nextSrs = calculateNextSrsReview(currentCard, quality);

  const cardPayload = {
    hanzi: masteryItem.character,
    pinyin: masteryItem.pinyin,
    meaning: masteryItem.meaning,
    level: masteryItem.level,
    ...nextSrs
  };

  if (userId) {
    await saveUserVocabSrsCard(userId, cardPayload);
  }

  return cardPayload;
}
