/**
 * =========================================================================
 * HANZI GO - CHINESE LEARNING DEPTH ENGINE: CROSS-SKILL INTEGRATION
 * =========================================================================
 * Kiến trúc liên kết kỹ năng xuyên suốt (Cross-Skill Pipeline):
 * Một mục từ vựng (Vocabulary Item) duy nhất đi qua 6 trạm luyện tập:
 * 
 * 1. Vocabulary (Nhận thức từ vựng & ý nghĩa Hán Việt)
 * 2. Listening  (Nghe hiểu câu chứa từ vựng trong ngữ cảnh thực tế)
 * 3. Speaking   (Luyện phát âm câu nói với chẩn đoán chuyên sâu)
 * 4. Hanzi      (Làm chủ chữ Hán: chiết tự bộ thủ, thứ tự nét & viết tay)
 * 5. Grammar    (Ứng dụng từ vựng vào cấu trúc ngữ pháp chuẩn)
 * 6. SRS        (Lưu vào chu kỳ lặp lại ngắt quãng SuperMemo-2)
 * 
 * NGUYÊN TẮC: Tối ưu dữ liệu hiện có, không nhân bản cơ sở dữ liệu.
 */

import { VOCABULARY_LIST } from '../data/chineseData.js';
import { getHanziMasteryItem } from './hanziMasteryService.js';
import { calculateNextSrsReview, SRS_QUALITY } from '../utils/srsEngine.js';

export const CROSS_SKILL_STAGES = [
  { id: 'vocabulary', title: 'Từ vựng & Nghĩa', icon: 'Book' },
  { id: 'listening', title: 'Nghe hiểu', icon: 'Headphones' },
  { id: 'speaking', title: 'Luyện nói chuyên sâu', icon: 'Mic' },
  { id: 'hanzi', title: 'Chữ Hán & Thuận bút', icon: 'PenTool' },
  { id: 'grammar', title: 'Ngữ pháp ứng dụng', icon: 'Layers' },
  { id: 'srs', title: 'Spaced Repetition (SRS)', icon: 'Repeat' }
];

/**
 * Xây dựng hành trình học liên kết đa kỹ năng cho một mục từ vựng
 * 
 * @param {number|string} vocabIdentifier - ID hoặc Chữ Hán
 * @returns {Object} Gói dữ liệu học tập đa kỹ năng hoàn chỉnh
 */
export function buildCrossSkillJourney(vocabIdentifier) {
  let vocab = null;
  if (typeof vocabIdentifier === 'number') {
    vocab = VOCABULARY_LIST.find(v => v.id === vocabIdentifier);
  } else if (typeof vocabIdentifier === 'string') {
    vocab = VOCABULARY_LIST.find(v => v.hanzi === vocabIdentifier || v.hanzi.includes(vocabIdentifier));
  }

  if (!vocab) {
    vocab = VOCABULARY_LIST[0]; // Mặc định từ vựng đầu tiên
  }

  // 1. Trạm Từ vựng (Vocabulary Flashcard)
  const vocabStation = {
    vocabId: vocab.id,
    hanzi: vocab.hanzi,
    pinyin: vocab.pinyin,
    hanviet: vocab.hanviet,
    meaning: vocab.meaning,
    level: vocab.level,
    radical: vocab.radical,
    mnemonic: vocab.mnemonic,
    example: vocab.example
  };

  // 2. Trạm Nghe hiểu (Listening Station)
  const exampleSentence = vocab.example?.hanzi || `${vocab.hanzi}很好。`;
  const listeningStation = {
    type: 'sentence_comprehension',
    audioText: exampleSentence,
    transcript: exampleSentence,
    pinyin: vocab.example?.pinyin || '',
    question: `Nghe câu và xác định nghĩa của từ "${vocab.hanzi}":`,
    options: [
      { text: vocab.meaning, isCorrect: true },
      { text: 'Tạm biệt', isCorrect: false },
      { text: 'Cảm ơn', isCorrect: false },
      { text: 'Xin lỗi', isCorrect: false }
    ],
    correctAnswer: vocab.meaning,
    explanation: `Câu mẫu: "${exampleSentence}" có chứa từ khóa "${vocab.hanzi}" (${vocab.pinyin} = ${vocab.meaning}).`
  };

  // 3. Trạm Luyện nói (Speaking Lab Station)
  const speakingStation = {
    promptHanzi: exampleSentence,
    promptPinyin: vocab.example?.pinyin || '',
    promptMeaning: vocab.example?.meaning || '',
    targetKeyword: vocab.hanzi,
    tip: `Chú ý phát âm rõ chữ "${vocab.hanzi}" (${vocab.pinyin}) và giữ tốc độ tự nhiên.`
  };

  // 4. Trạm Chữ Hán (Hanzi Mastery Station)
  const hanziStation = getHanziMasteryItem(vocab.hanzi);

  // 5. Trạm Ngữ pháp (Grammar Builder Station)
  // Tạo bài tập ghép câu với từ vựng này
  const sentenceTokens = Array.from(exampleSentence.replace(/[\s\p{P}]/gu, ''));
  const grammarStation = {
    type: 'sentence_builder',
    prompt: `Sắp xếp các từ thành câu mẫu hoàn chỉnh có chứa "${vocab.hanzi}":`,
    scrambledTokens: [...sentenceTokens].sort(() => 0.5 - Math.random()),
    correctTokens: sentenceTokens,
    correctSentence: exampleSentence,
    meaning: vocab.example?.meaning || '',
    explanation: `Cấu trúc câu hoàn chỉnh: "${exampleSentence}".`
  };

  // 6. Trạm SRS (Spaced Repetition Station)
  const initialSrs = calculateNextSrsReview({
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.50
  }, SRS_QUALITY.GOOD);

  const srsStation = {
    hanzi: vocab.hanzi,
    pinyin: vocab.pinyin,
    meaning: vocab.meaning,
    level: vocab.level,
    stage: initialSrs.stage,
    intervalDays: initialSrs.intervalDays,
    nextReviewAt: initialSrs.nextReviewAt
  };

  return {
    sourceVocabId: vocab.id,
    hanzi: vocab.hanzi,
    level: vocab.level,
    stages: {
      vocabulary: vocabStation,
      listening: listeningStation,
      speaking: speakingStation,
      hanzi: hanziStation,
      grammar: grammarStation,
      srs: srsStation
    }
  };
}

/**
 * Theo dõi mức độ hoàn thành 6 trạm đa kỹ năng của một từ vựng
 */
export function trackCrossSkillProgress(vocabItem, completedStages = []) {
  const allStages = CROSS_SKILL_STAGES.map(s => s.id);
  const completedSet = new Set(completedStages);
  const completedCount = allStages.filter(s => completedSet.has(s)).length;
  const progressRatio = Math.round((completedCount / allStages.length) * 100);

  return {
    vocabHanzi: vocabItem?.hanzi || '',
    totalStages: allStages.length,
    completedStages: Array.from(completedSet),
    progressPercentage: progressRatio,
    isMastered: progressRatio === 100,
    badge: progressRatio === 100 ? 'Đã thuần thục toàn diện 🌟' : `Đang học (${completedCount}/6 kỹ năng)`
  };
}
