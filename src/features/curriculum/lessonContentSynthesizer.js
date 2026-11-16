// =========================================================================
// HANZIGO UNIFIED LESSON CONTENT SYNTHESIZER (HSK 1–9 · LESSONS 1–180)
// File: src/features/curriculum/lessonContentSynthesizer.js
// Synthesizes both:
// - Unified 180-lesson LessonPage detail (buildSynthesizedLessonDetail)
// - 9-step InteractiveLessonPlayer + 3-Tier Translation (synthesizeHsk79Lesson)
// =========================================================================

import {
  HSK_120_LESSONS,
  ALL_9_STAGE_CONFIGS,
  ALL_180_LESSONS,
} from './hsk120CurriculumData.js';
import {
  HSK_7_TO_9_LESSONS,
  HSK_79_60_LESSONS,
  HSK79_STAGE_CONFIGS,
  getHsk79LessonMetaById,
} from './hsk7to9CurriculumData.js';
import {
  HSK_7_TO_9_RAW_LEXICON,
  HSK_7_TO_9_GRAMMAR_AST_MAP,
  buildHsk7to9TranslationDrill,
} from './hsk7to9LexiconAndGrammarBank.js';
import { RAW_LEXICON_ENTRIES, resolveCuratedLexiconItem } from './hsk120LexiconBank.js';
import { resolveCuratedGrammarAST } from './hsk120GrammarAstBank.js';
import { HSK79_VOCAB_GLOSSARY } from './hsk79VocabGlossary.js';
import {
  MODULE_PASSAGE_TEMPLATES,
  getGrammarAstDetail,
} from './hsk79PassagesAndGrammar.js';

export { ALL_9_STAGE_CONFIGS, ALL_180_LESSONS, HSK_7_TO_9_LESSONS, HSK_79_60_LESSONS, HSK_120_LESSONS };

const VOCAB_GLOSSARY = HSK79_VOCAB_GLOSSARY;

/**
 * Tra cứu từ vựng hợp nhất cho cả 180 bài học (HSK 1 - HSK 9)
 */
export function resolveUnifiedLexiconItem(word, lessonMeta, orderIndex = 1) {
  const rawAdvanced = HSK_7_TO_9_RAW_LEXICON[word];
  if (rawAdvanced) {
    const [
      pinyin = '',
      hanViet = '',
      pos = 'Từ vựng',
      meaningVi = '',
      radical = `Bộ ${word[0] || '汉字'}`,
    ] = String(rawAdvanced).split('|');
    const shortMeaning = meaningVi.split(',')[0]?.trim() || meaningVi;
    return {
      order: orderIndex,
      simplified: word,
      traditional: word,
      pinyin,
      hanViet,
      pos,
      meaningVi,
      radical,
      strokeCount: word.length * 9,
      mnemonicVi: `Thuật ngữ / Thành ngữ HSK ${lessonMeta.level} “${word}” (${hanViet} — ${meaningVi}), trọng tâm của Bài #${lessonMeta.id} 《${lessonMeta.zh}》.`,
      exampleZh: `在探讨《${lessonMeta.zh}》这一议题时，恰当运用“${word}”能够显著提升论述的严谨性与学术深度。`,
      examplePinyin: `Zài tàntǎo “${lessonMeta.pinyin}” zhè yī yìtí shí, qiàdàng yùnyòng “${pinyin}” nénggòu xiǎnzhù tíshēng lùnshù de yánjǐnxìng yǔ xuéshù shēndù.`,
      exampleVi: `Khi bàn luận về chủ đề “${lessonMeta.vi}”, vận dụng chuẩn xác từ “${word}” (${shortMeaning}) giúp nâng cao rõ rệt tính chặt chẽ và chiều sâu học thuật.`,
    };
  }
  return resolveCuratedLexiconItem(word, lessonMeta, orderIndex);
}

/**
 * Tra cứu cấu trúc Ngữ pháp AST hợp nhất cho cả 180 bài học (HSK 1 - HSK 9)
 */
export function resolveUnifiedGrammarAST(lessonMeta) {
  const advGrammar = HSK_7_TO_9_GRAMMAR_AST_MAP[lessonMeta.grammarCode];
  if (advGrammar) {
    return {
      code: lessonMeta.grammarCode,
      titleVi: lessonMeta.vi,
      patternDisplay: advGrammar.patternDisplay,
      hskLevel: lessonMeta.level,
      category: advGrammar.category,
      formulaTokens: advGrammar.formulaTokens,
      explanationVi: advGrammar.explanationVi,
      commonMistakes: [
        {
          wrong_zh: advGrammar.wrong_zh,
          right_zh: advGrammar.right_zh,
          pinyin: advGrammar.pinyin,
          meaning_vi: advGrammar.meaning_vi,
          reason_vi: advGrammar.reason_vi,
        },
      ],
    };
  }
  return resolveCuratedGrammarAST(lessonMeta);
}

/**
 * Xây dựng dàn ý Luận văn học thuật / Biểu đồ số liệu cho các bài HSK 7 - 9
 */
function buildAdvancedEssayBlueprint(lessonMeta, vocabularyList) {
  if (lessonMeta.level < 7) return null;

  const isChartEssay = lessonMeta.level === 8;
  const targetChars = lessonMeta.level === 7 ? 350 : lessonMeta.level === 8 ? 450 : 600;

  return {
    essayType: isChartEssay
      ? 'Phân tích Biểu đồ Số liệu & Quy nhân (图表作文)'
      : 'Luận văn Nghị luận Học thuật Biện chứng (深度议论文)',
    titleZh: `论《${lessonMeta.zh}》的现实意义与未来趋势`,
    targetCharCount: targetChars,
    discourseMarkers: [
      '诚然 (Đành rằng)',
      '与其说……毋宁说…… (Thay vì nói... chi bằng nói...)',
      '究其原因，主要归因于 (Xét kỹ nguyên nhân, chủ yếu do...)',
      '由此可见 (Từ đó có thể thấy)',
      '综上所述 (Tóm lại những điều trên)',
    ],
    paragraphsOutline: [
      {
        step: 'Đoạn 1: Mở bài & Phá đề (破题与背景)',
        guideVi: `Dẫn nhập trực tiếp bối cảnh 《${lessonMeta.zh}》 (${lessonMeta.vi}), sử dụng từ khóa “${vocabularyList[0]?.simplified || ''}” để nêu luận điểm trung tâm.`,
      },
      {
        step: 'Đoạn 2: Phân tích Đa chiều & Phản biện (思辨与论证)',
        guideVi: `Vận dụng cấu trúc ${lessonMeta.grammarCode} kết hợp thành ngữ “${vocabularyList[2]?.simplified || ''}” để phân tích sâu nguyên nhân và tác động hai mặt.`,
      },
      {
        step: 'Đoạn 3: Giải pháp Chiến lược & Kết luận (对策与升华)',
        guideVi: `Đưa ra kiến nghị thực tiễn với từ khóa “${vocabularyList[3]?.simplified || ''}” và chốt lại tầm nhìn dài hạn.`,
      },
    ],
  };
}

function buildContextualDialogue(lessonMeta, vocabularyList, grammarDetail) {
  const v1 = vocabularyList[0] || {
    simplified: lessonMeta.zh,
    pinyin: lessonMeta.pinyin,
    meaningVi: lessonMeta.vi,
    exampleZh: lessonMeta.zh,
    examplePinyin: lessonMeta.pinyin,
    exampleVi: lessonMeta.vi,
  };
  const v2 = vocabularyList[1] || v1;
  const v3 = vocabularyList[2] || v2;
  const teacherSpeaker = lessonMeta.level >= 7 ? '陈教授' : '林老师';
  const teacherRole =
    lessonMeta.level >= 7
      ? `Giáo sư Chuyên gia HSK ${lessonMeta.level}`
      : `Giảng viên HSK ${lessonMeta.level}`;

  return [
    {
      speaker: teacherSpeaker,
      role: teacherRole,
      zh: `今天我们深入研讨第${lessonMeta.id}课《${lessonMeta.zh}》，请大家重点关注“${v1.simplified}”与“${v2.simplified}”在正式语境中的搭配。`,
      pinyin: `Jīntiān wǒmen shēnrù yántǎo dì ${lessonMeta.id} kè “${lessonMeta.pinyin}”, qǐng dàjiā zhòngdiǎn guānzhù “${v1.pinyin}” yǔ “${v2.pinyin}” zài zhèngshì yǔjìng zhōng de dāpèi.`,
      vi: `Hôm nay chúng ta đi sâu nghiên cứu Bài ${lessonMeta.id} “${lessonMeta.zh}”, mọi người hãy đặc biệt chú ý cách kết hợp của “${v1.simplified}” (${(v1.meaningVi || '').split(',')[0]}) và “${v2.simplified}” (${(v2.meaningVi || '').split(',')[0]}).`,
    },
    {
      speaker: '海登',
      role: 'Học viên',
      zh: `请问在《${lessonMeta.zh}》的论述中，如何将“${v3.simplified}”与句式${grammarDetail.code}自然地结合起来？`,
      pinyin: `Qǐngwèn zài “${lessonMeta.pinyin}” de lùnshù zhōng, rúhé jiāng “${v3.pinyin}” yǔ jùshì ${grammarDetail.code} zìrán de jiéhé qǐlái?`,
      vi: `Xin hỏi trong phần bàn luận về “${lessonMeta.zh}”, làm thế nào để kết hợp tự nhiên từ “${v3.simplified}” (${(v3.meaningVi || '').split(',')[0]}) với cấu trúc ${grammarDetail.code} ạ?`,
    },
    {
      speaker: teacherSpeaker,
      role: teacherRole,
      zh: `我们可以这样表达：“${v1.exampleZh}”关键是要把握住${grammarDetail.code}的逻辑重心。`,
      pinyin: `Wǒmen kěyǐ zhèyàng biǎodá: “${v1.examplePinyin}” Guānjiàn shì yào bǎwò zhù ${grammarDetail.code} de luójí zhòngxīn.`,
      vi: `Chúng ta có thể diễn đạt như sau: “${v1.exampleVi}” Mấu chốt là nắm vững trọng tâm logic của cấu trúc ${grammarDetail.code}.`,
    },
    {
      speaker: '海登',
      role: 'Học viên',
      zh: `醍醐灌顶！我马上用“${v1.simplified}”和“${v2.simplified}”来进行翻译与造句实训。`,
      pinyin: `Tíhú guàndǐng! Wǒ mǎshàng yòng “${v1.pinyin}” hé “${v2.pinyin}” lái jìnxíng fānyì yǔ zàojù shíxùn.`,
      vi: `Thật sáng tỏ! Em sẽ dùng ngay “${v1.simplified}” và “${v2.simplified}” để thực hành luyện dịch và đặt câu.`,
    },
  ];
}

function buildLessonMasteryQuizzes(lessonMeta, vocabularyList, grammarDetail) {
  const targetVocab = vocabularyList[0] || {
    simplified: lessonMeta.zh,
    pinyin: lessonMeta.pinyin,
    hanViet: lessonMeta.zh,
    meaningVi: lessonMeta.vi,
    exampleZh: lessonMeta.zh,
  };
  const siblingLessons = ALL_180_LESSONS.filter(
    (l) => l.level === lessonMeta.level && l.id !== lessonMeta.id
  );
  const distractorWords = siblingLessons
    .slice(0, 3)
    .map((l) => resolveUnifiedLexiconItem(l.keyVocab?.[0] || l.zh, l, 1).meaningVi);

  const cleanTitle = String(lessonMeta.zh || '').replace(/[？。！，、：《》“”（）\s]/g, '');
  const tokens =
    cleanTitle.length >= 4
      ? [
          cleanTitle.slice(0, Math.ceil(cleanTitle.length / 3)),
          cleanTitle.slice(
            Math.ceil(cleanTitle.length / 3),
            Math.ceil((cleanTitle.length * 2) / 3)
          ),
          cleanTitle.slice(Math.ceil((cleanTitle.length * 2) / 3)),
        ].filter(Boolean)
      : [
          vocabularyList[0]?.simplified || '我们',
          vocabularyList[1]?.simplified || '学习',
          lessonMeta.zh,
        ];

  return [
    {
      id: `q1_${lessonMeta.id}`,
      type: 'multiple_choice',
      prompt: `Từ/Thuật ngữ trọng tâm “${targetVocab.simplified}” (/${targetVocab.pinyin}/ — Hán Việt: ${targetVocab.hanViet}) trong Bài #${lessonMeta.id} có nghĩa chính xác là gì?`,
      options: [targetVocab.meaningVi, ...distractorWords],
      correctIndex: 0,
      explanation: `“${targetVocab.simplified}” (/${targetVocab.pinyin}/, Hán Việt: ${targetVocab.hanViet}) mang nghĩa: ${targetVocab.meaningVi}.`,
    },
    {
      id: `q2_${lessonMeta.id}`,
      type: 'multiple_choice',
      prompt: `Chủ điểm ngữ pháp & kỹ năng học thuật cốt lõi của Bài #${lessonMeta.id} 《${lessonMeta.zh}》 là gì?`,
      options: [
        `${lessonMeta.vi} (${grammarDetail.code})`,
        siblingLessons[0]?.vi || 'Câu tồn hiện trạng thái tĩnh',
        siblingLessons[1]?.vi || 'Bổ ngữ thời lượng phủ định',
        siblingLessons[2]?.vi || 'Đại từ nghi vấn phiếm chỉ',
      ],
      correctIndex: 0,
      explanation: `Bài #${lessonMeta.id} rèn luyện trực tiếp: ${lessonMeta.vi} (${grammarDetail.code}).`,
    },
    {
      id: `q3_${lessonMeta.id}`,
      type: 'multiple_choice',
      prompt: `Theo chuẩn ngữ pháp HSK ${lessonMeta.level} (${grammarDetail.code}), cách diễn đạt nào dưới đây là CHUẨN XÁC nhất?`,
      options: [
        grammarDetail.commonMistakes?.[0]?.right_zh?.replace(/^(?:✅|🏆)\s*/u, '') ||
          targetVocab.exampleZh,
        grammarDetail.commonMistakes?.[0]?.wrong_zh?.replace(/^❌\s*/u, '') ||
          `把${targetVocab.simplified}没用好。`,
        `比昨天非常${targetVocab.simplified}。`,
        `通过这次分析，使我们掌握了${targetVocab.simplified}。`,
      ],
      correctIndex: 0,
      explanation:
        grammarDetail.commonMistakes?.[0]?.reason_vi ||
        `Câu đúng tuân thủ chuẩn cấu trúc ${grammarDetail.patternDisplay}.`,
    },
    {
      id: `q4_${lessonMeta.id}`,
      type: 'reorder',
      prompt: `Sắp xếp các thành tố sau để ghép thành chủ đề chuẩn của Bài #${lessonMeta.id}:`,
      shuffledTokens: [...tokens].reverse(),
      correctAnswer: tokens.join(''),
      explanation: `Cụm hoàn chỉnh của Bài #${lessonMeta.id} là: “${tokens.join('')}” (${lessonMeta.pinyin} — ${lessonMeta.vi}).`,
    },
  ];
}

function resolveLessonMeta(lessonId) {
  if (lessonId !== null && lessonId !== undefined && lessonId !== '') {
    const rawStr = String(lessonId).trim();
    const byCanonical = ALL_180_LESSONS.find(
      (item) => item.canonicalId === rawStr || item.stringId === rawStr
    );
    if (byCanonical) return byCanonical;

    const match = rawStr.match(/^(?:lesson[-_]?|hsk79-)?(\d{1,3})$/i);
    if (match) {
      const clampedNum = Math.max(1, Math.min(180, parseInt(match[1], 10) || 1));
      return ALL_180_LESSONS.find((item) => item.id === clampedNum) || ALL_180_LESSONS[0];
    }
  }

  const numericId = Math.max(1, Math.min(180, Number(lessonId) || 1));
  return ALL_180_LESSONS.find((item) => item.id === numericId) || ALL_180_LESSONS[0];
}

/**
 * Hàm tổng hợp dữ liệu bài học cho toàn bộ 180 bài (Bài 01 đến Bài 180)
 */
export function buildSynthesizedLessonDetail(lessonId, dbDictRows = [], dbGrammarRow = null) {
  const lessonMeta = resolveLessonMeta(lessonId);
  const numericId = lessonMeta.numericId || lessonMeta.id;
  const stageMeta =
    ALL_9_STAGE_CONFIGS.find((s) => s.level === lessonMeta.level) || ALL_9_STAGE_CONFIGS[0];

  const safeDbRows = Array.isArray(dbDictRows) ? dbDictRows : [];
  const dbDictMap = new Map(safeDbRows.map((row) => [row.simplified, row]));

  // 1. Danh sách từ vựng
  const vocabularyList = (lessonMeta.keyVocab || []).map((word, idx) => {
    const curated = resolveUnifiedLexiconItem(word, lessonMeta, idx + 1);
    const dbMatch = dbDictMap.get(word);

    if (!dbMatch) return curated;

    const posMeanings = Array.isArray(dbMatch.pos_meanings) ? dbMatch.pos_meanings : [];
    const firstDefsVi = Array.isArray(posMeanings[0]?.definitions_vi)
      ? posMeanings[0].definitions_vi
      : [];
    const examples = Array.isArray(dbMatch.examples) ? dbMatch.examples : [];

    return {
      order: idx + 1,
      simplified: dbMatch.simplified || curated.simplified,
      traditional: dbMatch.traditional || curated.traditional,
      pinyin: dbMatch.pinyin_display || dbMatch.pinyin_tone || curated.pinyin,
      hanViet: dbMatch.han_viet || curated.hanViet,
      pos: posMeanings[0]?.pos || curated.pos,
      meaningVi: firstDefsVi.length > 0 ? firstDefsVi.join('; ') : curated.meaningVi,
      radical: dbMatch.decomposition?.radical || curated.radical,
      strokeCount: dbMatch.decomposition?.stroke_count || curated.strokeCount,
      mnemonicVi: dbMatch.decomposition?.mnemonic_vi || curated.mnemonicVi,
      exampleZh: examples[0]?.hanzi || curated.exampleZh,
      examplePinyin: examples[0]?.pinyin || curated.examplePinyin,
      exampleVi: examples[0]?.vi || curated.exampleVi,
    };
  });

  // 2. Điểm ngữ pháp AST
  const curatedGrammar = resolveUnifiedGrammarAST(lessonMeta);
  const grammarDetail = dbGrammarRow
    ? {
        code: dbGrammarRow.code || curatedGrammar.code,
        titleVi: dbGrammarRow.title_vi || curatedGrammar.titleVi,
        patternDisplay: dbGrammarRow.pattern_display || curatedGrammar.patternDisplay,
        hskLevel: dbGrammarRow.hsk_level || curatedGrammar.hskLevel,
        category: dbGrammarRow.category || curatedGrammar.category,
        formulaTokens:
          Array.isArray(dbGrammarRow.formula_tokens) && dbGrammarRow.formula_tokens.length > 0
            ? dbGrammarRow.formula_tokens
            : curatedGrammar.formulaTokens,
        explanationVi: dbGrammarRow.explanation_vi || curatedGrammar.explanationVi,
        commonMistakes:
          Array.isArray(dbGrammarRow.common_mistakes) && dbGrammarRow.common_mistakes.length > 0
            ? dbGrammarRow.common_mistakes
            : curatedGrammar.commonMistakes,
      }
    : curatedGrammar;

  // 3. Hội thoại / Tọa đàm học thuật
  const dialogueLines = buildContextualDialogue(lessonMeta, vocabularyList, grammarDetail);

  // 4. Xưởng Dịch Thuật 3 Tầng & Dàn ý Luận văn (Dành riêng cho HSK 7 - 9: Bài 121 - 180)
  const translationDrill =
    lessonMeta.level >= 7
      ? buildHsk7to9TranslationDrill(lessonMeta, vocabularyList)
      : null;

  const essayBlueprint = buildAdvancedEssayBlueprint(lessonMeta, vocabularyList);

  // 5. Câu hỏi Kiểm tra cuối bài
  const masteryQuizzes = buildLessonMasteryQuizzes(
    lessonMeta,
    vocabularyList,
    grammarDetail
  );

  // 6. Danh sách chữ Hán đơn lẻ để luyện viết
  const uniqueCharacters = Array.from(
    new Set(
      (String(lessonMeta.zh || '') + (lessonMeta.keyVocab || []).join(''))
        .split('')
        .filter((ch) => /[\u4e00-\u9fa5]/.test(ch))
    )
  );

  return {
    id: lessonMeta.id,
    numericId,
    lessonNumber: numericId,
    lessonMeta,
    stageMeta,
    vocabularyList,
    grammarDetail,
    dialogueLines,
    translationDrill,
    essayBlueprint,
    masteryQuizzes,
    uniqueCharacters,
  };
}

// =========================================================================
// LEGACY / AUDIT COMPATIBLE 9-STEP HSK 7-9 SYNTHESIZER (HSK_79_60_LESSONS)
// Preserves full 9-step InteractiveLessonPlayer & curriculumCompletenessAudit
// =========================================================================

function buildGlossaryEntry(word, lessonMeta) {
  let known = VOCAB_GLOSSARY[word];
  if (!known && RAW_LEXICON_ENTRIES[word]) {
    const [pinyin = '', hanViet = '', pos = '', meaning = '', radical = ''] = String(
      RAW_LEXICON_ENTRIES[word]
    ).split('|');
    known = {
      pinyin,
      hanViet,
      pos,
      meaning,
      register: pos === 'idiom' ? '书面语 · 四字成语' : `HSK ${lessonMeta.level} 书面语`,
      synonymComparison: `${word} (${hanViet}) — ${meaning}${radical ? ` (${radical})` : ''}.`,
      collocations: [`深入理解${word}`, `准确使用${word}`, `围绕${word}展开探讨`],
    };
  }
  if (known) {
    return {
      simplified: word,
      pinyin: known.pinyin,
      hanViet: known.hanViet,
      pos: known.pos,
      meaning: known.meaning,
      register: known.register,
      synonymComparison: known.synonymComparison,
      collocations: known.collocations,
      example: {
        hanzi: `在讨论“${lessonMeta.zh}”时，${known.collocations[0] || word}这一表达尤为关键。`,
        pinyin: `Zài tǎolùn "${lessonMeta.pinyin}" shí, ${known.pinyin} zhè yī biǎodá yóuwéi guānjiàn.`,
        meaning: `Khi thảo luận chủ đề "${lessonMeta.vi}", cách diễn đạt "${word}" (${known.meaning}) giữ vai trò đặc biệt quan trọng.`,
      },
    };
  }

  return {
    simplified: word,
    pinyin: lessonMeta.pinyin || '',
    hanViet: word,
    pos: word.length === 4 ? '成语' : '书面语词',
    meaning: `${word} — từ khóa chuyên đề ${lessonMeta.vi} (${lessonMeta.zh})`,
    register: `HSK ${lessonMeta.level} 书面语`,
    synonymComparison: `Thuộc lớp từ vựng học thuật HSK ${lessonMeta.level} dùng trong văn cảnh "${lessonMeta.vi}".`,
    collocations: [`${word}的实践应用`, `深入剖析${word}`, `统筹推进${word}`],
    example: {
      hanzi: `围绕“${lessonMeta.zh}”，合理运用“${word}”能够显著提升论证的专业度。`,
      pinyin: `Wéirào "${lessonMeta.pinyin}", hélǐ yùnyòng "${word}" nénggòu xiǎnzhù tíshēng lùnzhèng de zhuānyè dù.`,
      meaning: `Xoay quanh chủ đề "${lessonMeta.vi}", vận dụng chuẩn xác "${word}" giúp nâng cao rõ rệt tính chuyên sâu của lập luận.`,
    },
  };
}

function buildTranslationDrills(lessonMeta) {
  const [v1 = lessonMeta.zh, v2 = '转型', v3 = '相辅相成'] = lessonMeta.keyVocab || [];
  const level = lessonMeta.level;

  if (lessonMeta.id === 121) {
    return [
      {
        direction: 'vi_to_zh',
        title: 'Biên dịch Việt → Trung (Kinh tế số & Năng suất)',
        sourceText:
          'Mặc dù trí tuệ nhân tạo vẫn còn gặp phải nhiều nút thắt về dữ liệu, nhưng không thể phủ nhận rằng nó đang tiếp sức mạnh mẽ cho quá trình chuyển đổi cơ cấu ngành công nghiệp truyền thống.',
        literalTrapVersion:
          '虽然人工智能还遇到很多数据的瓶颈，但是不能否认它正在强有力地帮助传统工业结构转型。(Lỗi dịch từng chữ "giúp đỡ" dùng 帮助 thiếu lực học thuật, cấu trúc 虽然…但是 mang tính khẩu ngữ).',
        standardHsk7Version:
          '尽管人工智能在数据层面仍面临诸多瓶颈，但不可否认的是，它正有力地为传统产业结构转型赋能。',
        masterHsk9Version:
          '诚然，人工智能于数据维度尚存诸多掣肘，然其赋能传统产业转型升级之势，已然大势所趋、不可逆转。',
        analysisVi:
          'Tầng HSK 9 thay "虽然…但是" bằng cặp nhượng bộ sắc bén "诚然……然……", thay động từ trung tính "帮助" bằng thuật ngữ kinh tế số "赋能", và chốt câu bằng Tứ tự cách "大势所趋".',
      },
      {
        direction: 'zh_to_vi',
        sourceText:
          '技术创新与制度保障往往相辅相成，任何单方面的滞后都将凸显出体系发展的隐性短板。',
        title: 'Biên dịch Trung → Việt (Chính sách & Đổi mới)',
        literalTrapVersion:
          'Đổi mới kỹ thuật và bảo đảm chế độ thường hay giúp đỡ nhau thành công, bất kỳ sự chậm lại một phía nào cũng sẽ lồi ra tấm ván ngắn ẩn của phát triển hệ thống.',
        standardHsk7Version:
          'Đổi mới công nghệ và bảo đảm thể chế thường bổ trợ lẫn nhau; sự chậm trễ từ bất kỳ phía nào cũng sẽ làm bộc lộ rõ những điểm yếu tiềm ẩn của hệ thống.',
        masterHsk9Version:
          'Đổi mới công nghệ và hành lang thể chế vốn song hành tương hỗ; sự hụt nhịp ở bất kỳ trụ cột nào cũng sẽ phơi bày những điểm nghẽn cấu trúc trong tiến trình phát triển.',
        analysisVi:
          'Thoát ly lối dịch máy móc "tấm ván ngắn" (短板 -> điểm nghẽn / hạn chế cốt lõi) và chuyển "相辅相成" thành cụm từ chính luận giàu nhạc điệu "song hành tương hỗ".',
      },
    ];
  }

  return [
    {
      direction: 'vi_to_zh',
      title: `Biên dịch Việt → Trung (Chuẩn HSK ${level})`,
      sourceText: `Trong chuyên đề "${lessonMeta.vi}", nếu chỉ nhìn nhận bề nổi mà thiếu sự phân tích vĩ mô thì khó có thể giải quyết triệt để vấn đề và thúc đẩy các yếu tố ${v1} phát triển bền vững.`,
      literalTrapVersion: `在“${lessonMeta.vi}”的话题里，如果只看表面而没有宏观分析，就很难彻底解决问题，也很难推动${v1}持续发展。(Mắc bẫy dịch khẩu ngữ "看表面", thiếu hư từ văn viết HSK ${level}).`,
      standardHsk7Version: `围绕“${lessonMeta.zh}”，倘若仅浮于表象而缺乏宏观审视，便难以从根本上破解难题并推动${v1}稳步${v2}。`,
      masterHsk9Version: `观照“${lessonMeta.zh}”之大局，若徒滞表象而寡宏观洞见，诚难竟其全功，亦无从促成${v1}与体系统筹${v3}。`,
      analysisVi: `Nâng cấp từ mẫu câu giao tiếp thông thường sang khung lập luận chuẩn "${lessonMeta.grammarPattern}" kết hợp thuật ngữ học thuật "${v1}", "${v2}", "${v3}".`,
    },
    {
      direction: 'zh_to_vi',
      title: `Biên dịch Trung → Việt (Phân tích diễn ngôn HSK ${level})`,
      sourceText: `围绕“${lessonMeta.zh}”，唯有坚持${v1}与系统治理${v3}，方能突破既有${v2}，在变局中赢得主动。`,
      literalTrapVersion: `Xoay quanh "${lessonMeta.zh}", chỉ có kiên trì ${v1} và quản lý hệ thống ${v3}, mới có thể đâm thủng cái ${v2} đã có sẵn, trong cục biến mà thắng được chủ động.`,
      standardHsk7Version: `Đối với vấn đề "${lessonMeta.vi}", chỉ khi kết hợp chặt chẽ giữa ${v1} và quản trị hệ thống, chúng ta mới có thể tháo gỡ các rào cản hiện hữu và giữ thế chủ động trước biến động.`,
      masterHsk9Version: `Trong bài toán "${lessonMeta.vi}", chỉ khi dung hòa được động lực từ ${v1} với quản trị hệ thống đồng bộ, ta mới có thể khơi thông điểm nghẽn cấu trúc và làm chủ cục diện giữa vòng xoáy biến động.`,
      analysisVi: `Hóa giải trật tự định ngữ tiếng Hán bằng cụm danh – động tiếng Việt mượt mà, xử lý trọn vẹn cặp từ hàn lâm "${v1}" và "${v3}".`,
    },
  ];
}

function buildEssayBlueprint(lessonMeta) {
  const vocabList = lessonMeta.keyVocab || ['转型', '赋能', '相辅相成', '未雨绸缪'];
  const wordTarget = lessonMeta.level === 9 ? '550–650 chữ Hán' : '450–550 chữ Hán';
  return {
    prompt: `Hãy viết một bài nghị luận học thuật (${wordTarget}) phân tích cơ hội, thách thức và giải pháp chiến lược cho chủ đề: "${lessonMeta.zh}" (${lessonMeta.vi}), bắt buộc lồng ghép cấu trúc "${lessonMeta.grammarPattern}".`,
    speakingDebatePrompt: `Khẩu ngữ Biện luận HSK ${lessonMeta.level} (3 phút): Bảo vệ quan điểm cá nhân về mối quan hệ giữa tốc độ đổi mới và tính bền vững trong chủ đề "${lessonMeta.vi}".`,
    targetWordCount: wordTarget,
    outline: [
      {
        part: 'Mở bài (起 · Khởi đề & Nêu bối cảnh)',
        guideVi: `Đặt vấn đề từ xu hướng thực tiễn liên quan đến "${lessonMeta.vi}", dẫn dắt trực tiếp vào luận điểm trung tâm bằng từ khóa "${vocabList[0] || ''}".`,
      },
      {
        part: 'Thân bài (承转 · Phân tích hai chiều & Phản biện)',
        guideVi: `Triển khai 2 đoạn: (1) Giá trị động lực của ${vocabList[0] || ''} & ${vocabList[1] || ''}; (2) Bóc tách nút thắt thực tiễn bằng cấu trúc "${lessonMeta.grammarPattern}" và thành ngữ "${vocabList[vocabList.length - 1] || ''}".`,
      },
      {
        part: 'Kết bài (合 · Chốt giải pháp & Tầm nhìn vĩ mô)',
        guideVi: 'Tổng hợp lại lập trường ("综上所述…"), nhấn mạnh yêu cầu cân bằng và mở ra tầm nhìn dài hạn.',
      },
    ],
    discourseMarkers: [
      lessonMeta.grammarPattern.split('/')[0].trim(),
      '不容忽视的是 (Điều không thể xem nhẹ là)',
      '诚然……然究其根本…… (Quả thực là... song xét tận gốc...)',
      '由此可见 (Từ đó có thể thấy)',
      '综上所述 (Tổng hợp những phân tích trên)',
    ],
  };
}

export function synthesizeHsk79Lesson(lessonOrId) {
  const lessonMeta =
    typeof lessonOrId === 'object' && lessonOrId !== null
      ? lessonOrId
      : getHsk79LessonMetaById(lessonOrId);

  if (!lessonMeta) return null;

  const stageCfg = HSK79_STAGE_CONFIGS[lessonMeta.level] || HSK79_STAGE_CONFIGS[7];
  const vocabEntries = (lessonMeta.keyVocab || ['转型', '赋能', '凸显', '相辅相成']).map((word, idx) => {
    const info = buildGlossaryEntry(word, lessonMeta);
    return {
      order: idx + 1,
      id: `v-${lessonMeta.id}-${idx + 1}`,
      hanzi: info.simplified,
      simplified: info.simplified,
      pinyin: info.pinyin,
      hanviet: info.hanViet,
      hanViet: info.hanViet,
      pos: info.pos,
      meaning: info.meaning,
      meaningVi: info.meaning,
      register: info.register,
      synonymComparison: info.synonymComparison,
      collocations: info.collocations,
      example: info.example,
      audioText: info.simplified,
    };
  });

  const modKey = `${lessonMeta.level}.${lessonMeta.moduleIndex}`;
  const passageTemplate =
    MODULE_PASSAGE_TEMPLATES[modKey] ||
    (lessonMeta.level === 9
      ? MODULE_PASSAGE_TEMPLATES['9.1']
      : lessonMeta.level === 8
      ? MODULE_PASSAGE_TEMPLATES['8.1']
      : MODULE_PASSAGE_TEMPLATES['7.1']);

  const academicPassage = {
    titleZh: lessonMeta.zh,
    titlePinyin: lessonMeta.pinyin,
    titleVi: lessonMeta.vi,
    style:
      lessonMeta.level === 9
        ? 'Văn phong Ngoại giao & Học thuật đỉnh cao (HSK 9)'
        : lessonMeta.level === 8
        ? 'Văn phong Pháp lý – Chuyên luận học thuật (HSK 8)'
        : 'Văn phong Báo chí chính luận (HSK 7)',
    paragraphsZh: passageTemplate.paragraphsZh,
    fullTextZh: passageTemplate.paragraphsZh.join('\n\n'),
    translationVi: passageTemplate.translationVi,
  };

  const translationDrills = buildTranslationDrills(lessonMeta);
  const essayBlueprint = buildEssayBlueprint(lessonMeta);

  const primaryWord = vocabEntries[0] || {
    hanzi: '赋能',
    pinyin: 'fù néng',
    meaning: 'Trao quyền / tiếp sức',
  };
  const secondWord = vocabEntries[1] || {
    hanzi: '转型',
    pinyin: 'zhuǎn xíng',
    meaning: 'Chuyển đổi cơ cấu',
  };
  const idiomWord = vocabEntries[vocabEntries.length - 1] || primaryWord;

  const coreHanziList = Array.from(
    new Set(
      vocabEntries
        .flatMap((v) => Array.from(v.hanzi))
        .filter((ch) => /[\u4e00-\u9fff]/.test(ch))
    )
  ).slice(0, 4);

  const step3Hanzi = coreHanziList.map((ch, idx) => ({
    hanzi: ch,
    pinyin: vocabEntries[idx]?.pinyin?.split(' ')[0] || 'zì',
    meaning: vocabEntries[idx]?.meaning || `Chữ Hán trọng điểm bài ${lessonMeta.id}`,
    strokesCount: 8 + (idx * 3) % 9,
    mnemonic: `Thuộc nhóm chữ Hán tần suất cao bậc ${stageCfg.code} — xuất hiện trong cụm "${vocabEntries[idx]?.hanzi || lessonMeta.zh}".`,
  }));

  const step7Words = [
    '围绕',
    lessonMeta.zh,
    '唯有',
    primaryWord.hanzi,
    '与',
    secondWord.hanzi,
    idiomWord.hanzi,
    '方能行稳致远',
  ];

  const quizQuestions = [
    {
      id: `q-${lessonMeta.id}-1`,
      question: `[Phân biệt ngữ vực HSK ${lessonMeta.level}] Thuật ngữ nào phù hợp nhất với sắc thái văn viết trang trọng trong chủ đề "${lessonMeta.vi}"?`,
      options: [
        `${primaryWord.hanzi} (${primaryWord.pinyin}) — ${primaryWord.meaning}`,
        '帮忙弄一下 — cách nói khẩu ngữ xuồng xã',
        '随便看看 — diễn đạt thiếu tính học thuật',
        '好吧就这样 — cảm thán giao tiếp hàng ngày',
      ],
      correctIndex: 0,
      explanation: `${primaryWord.hanzi}: ${primaryWord.synonymComparison}`,
    },
    {
      id: `q-${lessonMeta.id}-2`,
      question: `[Cấu trúc văn viết] Mẫu câu "${lessonMeta.grammarPattern}" đảm nhiệm chức năng gì trong văn bản chính luận?`,
      options: [
        'Chỉ dùng trong đối thoại mua bán ở chợ',
        lessonMeta.grammarTitleVi,
        'Dùng để biểu thị hành động vừa xảy ra tức thì',
        'Thay thế toàn bộ dấu câu trong văn ngôn',
      ],
      correctIndex: 1,
      explanation: `Cấu trúc "${lessonMeta.grammarPattern}" là khung diễn ngôn chuẩn HSK ${lessonMeta.level}: ${lessonMeta.grammarTitleVi}.`,
    },
    {
      id: `q-${lessonMeta.id}-3`,
      question: `[Phân biệt dịch thuật HSK 9] Điểm khác biệt cốt lõi giữa bản dịch "từng chữ" và bản dịch "đạt chuẩn HSK 9" là gì?`,
      options: [
        'Dịch word-by-word dài dòng hơn nên được điểm cao hơn',
        'Vận dụng cấu trúc Tứ tự cách (四字格), hư từ văn viết chính xác và thoát ly trật tự cú pháp ngoại ngữ',
        'Lược bỏ toàn bộ thành ngữ để câu đơn giản nhất',
        'Giữ nguyên âm Hán-Việt dù từ đó mang nghĩa khác trong tiếng Việt',
      ],
      correctIndex: 1,
      explanation: `Chuẩn Tín – Đạt – Nhã của HSK ${lessonMeta.level} yêu cầu đúng ngữ vực văn viết (书面语) và tránh bẫy dịch từng chữ.`,
    },
    {
      id: `q-${lessonMeta.id}-4`,
      question: `[Thành ngữ trọng tâm] Thành ngữ / cụm từ "${idiomWord.hanzi}" mang ý nghĩa chuẩn xác nào sau đây?`,
      options: [
        idiomWord.meaning,
        'Chỉ hành động tùy tiện không có kế hoạch',
        'Miêu tả phong cảnh thiên nhiên mùa thu',
        'Là thán từ biểu thị sự ngạc nhiên',
      ],
      correctIndex: 0,
      explanation: `${idiomWord.hanzi} (${idiomWord.hanViet}): ${idiomWord.meaning}. ${idiomWord.synonymComparison}`,
    },
  ];

  const targetSpeakSentence = `围绕${lessonMeta.zh}，唯有坚持${primaryWord.hanzi}与${secondWord.hanzi}${idiomWord.hanzi}，方能行稳致远。`;

  const grammarAst = getGrammarAstDetail(lessonMeta);
  const nextLessonMeta =
    lessonMeta.id < 180 ? getHsk79LessonMetaById(lessonMeta.id + 1) : null;

  return {
    id: lessonMeta.stringId,
    numericId: lessonMeta.id,
    lessonNumber: lessonMeta.id,
    levelId: `lvl-${lessonMeta.level}`,
    chapterId: `ch-79-${lessonMeta.level}-${lessonMeta.moduleIndex}`,
    hskLevel: stageCfg.code,
    level: lessonMeta.level,
    moduleIndex: lessonMeta.moduleIndex,
    moduleTitle: lessonMeta.moduleTitle,
    title: lessonMeta.vi,
    zh: lessonMeta.zh,
    pinyin: lessonMeta.pinyin,
    vi: lessonMeta.vi,
    chineseTitle: lessonMeta.zh,
    grammarCode: lessonMeta.grammarCode,
    grammarPattern: lessonMeta.grammarPattern,
    keyVocab: lessonMeta.keyVocab,
    focusTool: lessonMeta.focusTool,
    xpReward: lessonMeta.level === 9 ? 120 : lessonMeta.level === 8 ? 100 : 80,
    nextLessonId: nextLessonMeta ? nextLessonMeta.stringId : null,
    isHsk79: true,
    objective: `Làm chủ ${vocabEntries.length} từ vựng/thành ngữ cấp ${stageCfg.code}, cấu trúc "${lessonMeta.grammarPattern}" và dịch chuẩn 3 tầng Trung ↔ Việt về "${lessonMeta.vi}".`,
    prerequisite: `Hoàn thành nền tảng HSK 1–6 (5.456 từ) hoặc đạt bài ${Math.max(121, lessonMeta.id - 1)}.`,
    completionCriteria: `Hoàn tất 9 bước học thuật, phân biệt được 3 tầng biên dịch và vượt thử thách phản biện HSK ${lessonMeta.level}.`,

    // Dedicated HSK 7–9 Advanced Fields
    vocabularyList: vocabEntries,
    academicPassage,
    translationDrills,
    translationDrill: lessonMeta.level >= 7 ? buildHsk7to9TranslationDrill(lessonMeta, vocabEntries) : null,
    essayBlueprint,
    writingAndSpeakingPrompt: essayBlueprint,
    grammarDetail: {
      code: lessonMeta.grammarCode,
      pattern: lessonMeta.grammarPattern,
      titleVi: lessonMeta.grammarTitleVi,
      formula_tokens: grammarAst.formula_tokens,
      explanationVi: `Mẫu cấu trúc "${lessonMeta.grammarPattern}" (${lessonMeta.grammarTitleVi}) thuộc nhóm văn viết trang trọng (书面语) bậc ${stageCfg.code}. ${grammarAst.reason}`,
      commonMistakes: [
        {
          wrong: grammarAst.wrong,
          correct: grammarAst.correct,
          reason: grammarAst.reason,
        },
      ],
    },

    // Compatible 9-step structure for InteractiveLessonPlayer
    step1_learn: {
      topic: `Bài ${lessonMeta.id} (${stageCfg.code}): ${lessonMeta.zh} — ${lessonMeta.vi}`,
      summary: `${lessonMeta.moduleTitle}. Chuyên đề trọng tâm về ngữ pháp văn viết "${lessonMeta.grammarPattern}", đọc hiểu học thuật 3 đoạn và xưởng biên dịch 3 tầng Trung ↔ Việt.`,
      toneGuide: [
        {
          name: 'Cấu trúc trung tâm',
          symbol: lessonMeta.grammarPattern,
          desc: lessonMeta.grammarTitleVi,
          example: academicPassage.paragraphsZh[1] || academicPassage.paragraphsZh[0],
        },
        {
          name: 'Chuẩn khảo thí CTI',
          symbol: `${stageCfg.code} · ${stageCfg.vocabTarget.toLocaleString('vi-VN')} từ`,
          desc: `${HSK79_STAGE_CONFIGS[lessonMeta.level].cbtSummary}`,
          example: `${primaryWord.hanzi} · ${secondWord.hanzi} · ${idiomWord.hanzi}`,
        },
      ],
    },
    step2_vocabulary: vocabEntries,
    step3_hanzi: step3Hanzi,
    step4_grammar: {
      code: lessonMeta.grammarCode,
      title: `${lessonMeta.grammarPattern} — ${lessonMeta.grammarTitleVi}`,
      formula: lessonMeta.grammarPattern,
      formula_tokens: grammarAst.formula_tokens,
      explanation: `Cấu trúc chuẩn văn viết (书面语) cấp ${stageCfg.code}: ${lessonMeta.grammarTitleVi}. ${grammarAst.reason}`,
      examples: [
        {
          hanzi: academicPassage.paragraphsZh[0],
          pinyin: lessonMeta.pinyin,
          meaning: 'Mệnh đề mở đầu xác lập bối cảnh học thuật.',
        },
        {
          hanzi: grammarAst.correct,
          pinyin: `${primaryWord.pinyin} · ${secondWord.pinyin}`,
          meaning: `Câu chuẩn HSK ${lessonMeta.level} minh họa trực tiếp mẫu "${lessonMeta.grammarPattern}".`,
        },
      ],
      commonMistake: {
        wrong: grammarAst.wrong,
        correct: grammarAst.correct,
        explanation: grammarAst.reason,
      },
    },
    step5_listening: {
      situation: `Tọa đàm chuyên đề ${stageCfg.code}: ${lessonMeta.vi}`,
      context: `Hai chuyên gia phân tích sâu vấn đề "${lessonMeta.vi}" và trao đổi chiến lược chuyển hóa ngôn ngữ học thuật.`,
      participants: 'A (Chủ tọa hội thảo) & B (Chuyên gia phản biện)',
      targetGoal: `Nghe bắt trọn từ khóa "${primaryWord.hanzi}", "${secondWord.hanzi}" và cấu trúc "${lessonMeta.grammarPattern}".`,
      audioText: `${academicPassage.paragraphsZh[0]} ${academicPassage.paragraphsZh[1]}`,
      dialogue: [
        {
          speaker: 'A',
          hanzi: academicPassage.paragraphsZh[0],
          pinyin: lessonMeta.pinyin,
          meaning: 'Nhận định bối cảnh vĩ mô và vai trò động lực của chủ đề.',
        },
        {
          speaker: 'B',
          hanzi: academicPassage.paragraphsZh[1],
          pinyin: `${primaryWord.pinyin} — ${lessonMeta.grammarPattern}`,
          meaning: 'Phân tích nút thắt thực tiễn và lập luận phản biện sâu sắc.',
        },
      ],
      usageNotes: `Trong phần Nghe HSK 7–9 (tốc độ tự nhiên 220–260 chữ/phút), hãy chú ý các từ chuyển mạch lập luận như 诚然, 然, 与其说…毋宁说… để đoán ý đồ người nói.`,
      question: `Theo đoạn trao đổi chuyên đề "${lessonMeta.vi}", yếu tố nào được nhấn mạnh là điều kiện tiên quyết để tạo đột phá bền vững?`,
      options: [
        `Kết hợp đồng bộ giữa ${primaryWord.hanzi} và ${secondWord.hanzi} cùng hành lang thể chế vững chắc`,
        'Bỏ qua mọi quy chuẩn để tăng trưởng nóng ngắn hạn',
        'Chỉ sử dụng khẩu ngữ giao tiếp hàng ngày trong văn bản',
        'Trì hoãn chuyển đổi cho đến khi không còn cạnh tranh',
      ],
      correctIndex: 0,
      explanation: `Cả hai đoạn đều khẳng định phải kết hợp động lực nội tại (${primaryWord.hanzi}, ${secondWord.hanzi}) với quản trị hệ thống và tầm nhìn dài hạn.`,
    },
    step6_speaking: {
      prompt: essayBlueprint.speakingDebatePrompt,
      targetSentence: targetSpeakSentence,
      targetPinyin: `Wéirào ${lessonMeta.pinyin}, wéiyǒu jiānchí ${primaryWord.pinyin} yǔ ${secondWord.pinyin}, fāng néng xíngwěn zhìyuǎn.`,
      targetMeaning: `Xoay quanh ${lessonMeta.vi}, chỉ khi kiên trì kết hợp các trụ cột cốt lõi mới có thể phát triển vững bền.`,
    },
    step7_writing: {
      prompt: `Sắp xếp các cụm từ học thuật HSK ${lessonMeta.level} thành câu luận hoàn chỉnh cho chủ đề "${lessonMeta.vi}":`,
      words: step7Words,
      correctOrder: step7Words,
    },
    step8_quiz: quizQuestions,
    step9_challenge: {
      title: `Thử thách Biên – Phiên dịch & Biện luận ${stageCfg.code}`,
      taskDesc: `Đọc to mệnh đề học thuật chuẩn ${stageCfg.code} dưới đây (hoặc luyện nói phản xạ 10 giây), đồng thời đối chiếu 3 tầng dịch thuật trong bảng Xưởng Dịch ngay bên dưới!`,
      targetPhrase: targetSpeakSentence,
      badge: `Học giả ${stageCfg.code} · Bài ${lessonMeta.id}`,
    },
  };
}

export function getHsk79LessonWithContent(lessonId) {
  const meta = getHsk79LessonMetaById(lessonId);
  if (!meta) return null;
  return synthesizeHsk79Lesson(meta);
}
