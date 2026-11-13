import {
  createVocabDeck,
  listVocabDecks,
  type VocabDeck,
} from '../../../services/vocabWorkspaceService.ts';
import {
  fetchOrGenerateDictionaryEntry,
  saveWordToDeck,
  type DictionaryEntry,
} from '../../../services/dictionaryService.ts';

export interface MistakeQuestionLike {
  questionId?: string | number;
  question_number?: number;
  isCorrect?: boolean;
  target_vocab?: string[];
  targetVocab?: string[];
  target_grammar_codes?: string[];
  target_grammar_code?: string;
  targetGrammarCode?: string;
  grammarPoint?: string;
  question?: string;
  explanation?: string;
}

export interface GrammarRemediationSuggestion {
  code: string;
  titleVi: string;
  questionNumbers: number[];
}

export interface MistakeRemediationSummary {
  paperCode: string;
  totalMistakes: number;
  vocabWords: string[];
  grammarSuggestions: GrammarRemediationSuggestion[];
}

const GRAMMAR_CODE_LABELS: Record<string, string> = {
  HSK3_BA_SENTENCE: 'Câu chữ 把 (Xử lý đối tượng)',
  HSK3_BEI_SENTENCE: 'Câu bị động với 被 / 让 / 叫',
  HSK4_BUGUAN_ZHIYAO_JIU: 'Cấu trúc điều kiện 不管...只要...就...',
  HSK4_SUIRAN_DANSHI: 'Cặp liên từ nhượng bộ 虽然...但是...',
  HSK5_CHULE_YIWAI: 'Cấu trúc 除了...以外',
  HSK6_CHENGFEN_CANQUE: 'Lỗi thiếu chủ ngữ (成分残缺)',
  HSK6_JUISHI_ZAROU: 'Lỗi trộn lẫn cấu trúc câu (句式杂糅)',
  HSK_ADJ_ZHUANGTAI: 'Bổ ngữ trạng thái & định ngữ',
};

/**
 * Quét toàn bộ các câu làm sai sau khi nộp bài CBT để trích xuất từ vựng & mã ngữ pháp cần ôn lại
 */
export function extractRemediationFromMistakes(
  mistakes: MistakeQuestionLike[],
  paperCode = 'HSK-CBT'
): MistakeRemediationSummary {
  const vocabSet = new Set<string>();
  const grammarMap = new Map<string, Set<number>>();

  const wrongOnly = (mistakes || []).filter((m) => m.isCorrect !== true);

  wrongOnly.forEach((m, idx) => {
    const qNum = m.question_number ?? idx + 1;

    const vocabArr = m.target_vocab || m.targetVocab || [];
    for (const w of vocabArr) {
      const clean = String(w || '').trim();
      if (clean) vocabSet.add(clean);
    }

    // Fallback: trích xuất cụm chữ Hán ngắn từ nội dung câu hỏi nếu chưa gắn tag target_vocab
    if (vocabArr.length === 0 && m.question) {
      const hanziTokens = m.question.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
      for (const tok of hanziTokens.slice(0, 2)) {
        vocabSet.add(tok);
      }
    }

    const gCodes = [
      ...(m.target_grammar_codes || []),
      ...(m.target_grammar_code ? [m.target_grammar_code] : []),
      ...(m.targetGrammarCode ? [m.targetGrammarCode] : []),
      ...(m.grammarPoint ? [m.grammarPoint] : []),
    ];

    for (const code of gCodes) {
      const cleanCode = String(code || '').trim();
      if (!cleanCode) continue;
      if (!grammarMap.has(cleanCode)) {
        grammarMap.set(cleanCode, new Set());
      }
      grammarMap.get(cleanCode)?.add(qNum);
    }
  });

  const grammarSuggestions: GrammarRemediationSuggestion[] = Array.from(grammarMap.entries()).map(
    ([code, qSet]) => ({
      code,
      titleVi: GRAMMAR_CODE_LABELS[code] || `Điểm ngữ pháp: ${code}`,
      questionNumbers: Array.from(qSet).sort((a, b) => a - b),
    })
  );

  return {
    paperCode,
    totalMistakes: wrongOnly.length,
    vocabWords: Array.from(vocabSet),
    grammarSuggestions,
  };
}

/**
 * 1-click đẩy toàn bộ từ vựng trong các câu làm sai vào Deck "Từ sai trong đề HSK [Mã đề]"
 */
export async function pushMistakeVocabToWorkspaceDeck(params: {
  paperCode: string;
  vocabWords: string[];
  user?: { id?: string | null } | null;
}): Promise<{
  deck: VocabDeck;
  pushedCount: number;
}> {
  const deckTitle = `Từ sai trong đề HSK ${params.paperCode}`;
  const existingDecks = await listVocabDecks(params.user);
  let deck = existingDecks.find((d) => d.name === deckTitle);

  if (!deck) {
    deck = await createVocabDeck(
      {
        name: deckTitle,
        description: `Tổng hợp từ vựng từ các câu làm sai trong đề ${params.paperCode}`,
        color_hex: '#f59e0b',
      },
      params.user
    );
  }

  let pushedCount = 0;
  for (const word of params.vocabWords) {
    const clean = word.trim();
    if (!clean) continue;

    let entry: DictionaryEntry | null = null;
    try {
      entry = await fetchOrGenerateDictionaryEntry(clean);
    } catch {
      entry = null;
    }

    const fallbackEntry: DictionaryEntry = entry || {
      id: `hsk-mistake-${clean}`,
      simplified: clean,
      traditional: clean,
      pinyin: '',
      pinyin_numbered: '',
      hsk_level: 4,
      meanings_vi: [`Từ sai trong đề HSK ${params.paperCode}`],
      examples: [],
    };

    await saveWordToDeck(fallbackEntry, params.user);
    pushedCount += 1;
  }

  return {
    deck,
    pushedCount,
  };
}
