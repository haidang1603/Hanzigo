// =========================================================================
// HANZIGO UNIFIED GRAMMAR AST BANK (HSK 1-9 · 180 LESSONS)
// File: src/features/curriculum/hsk120GrammarAstBank.js
// =========================================================================

import { HSK_120_LESSONS } from './hsk120CurriculumData.js';
import { HSK_7_TO_9_GRAMMAR_AST_MAP } from './hsk7to9LexiconAndGrammarBank.js';

export const SPECIFIC_GRAMMAR_AST_MAP = {};

for (const lesson of HSK_120_LESSONS) {
  const g = lesson.step4_grammar;
  if (!g) continue;
  const code = lesson.grammarCode || g.code || `G-${lesson.id.toUpperCase()}`;
  const firstEx = Array.isArray(g.examples) && g.examples[0] ? g.examples[0] : {};
  const tokens = Array.isArray(g.formula_tokens) && g.formula_tokens.length > 0
    ? g.formula_tokens.map((t, idx) => ({
        role: idx === 0 ? 'S' : idx === 1 ? 'Keyword' : 'Complement',
        label_zh: t.token,
        label_vi: t.role || `Thành phần #${idx + 1}`,
      }))
    : String(g.formula || g.title || '')
        .split(/[+|/→↔]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((tok, idx) => ({
          role: idx === 0 ? 'S' : idx === 1 ? 'Keyword' : 'Complement',
          label_zh: tok,
          label_vi: idx === 0 ? 'Thành phần mở' : `Thành phần #${idx + 1}`,
        }));

  SPECIFIC_GRAMMAR_AST_MAP[code] = {
    patternDisplay: g.formula || g.title,
    category: g.title || lesson.title,
    formulaTokens: tokens,
    explanationVi: g.explanation || lesson.title,
    wrong_zh: g.commonMistake?.wrong || 'Tránh đảo sai trật tự câu hoặc dùng sai hư từ.',
    right_zh: g.commonMistake?.correct || firstEx.hanzi || g.formula,
    pinyin: firstEx.pinyin || '',
    meaning_vi: firstEx.meaning || lesson.title,
    reason_vi: g.commonMistake?.explanation || g.explanation || '',
  };
}

// Merge HSK 7-9 AST Rules for unified 180-lesson lookup
Object.assign(SPECIFIC_GRAMMAR_AST_MAP, HSK_7_TO_9_GRAMMAR_AST_MAP);

export function getUnifiedGrammarAst(grammarCode) {
  return SPECIFIC_GRAMMAR_AST_MAP[grammarCode] || null;
}

/**
 * Tra cứu cấu trúc Ngữ pháp AST cho các bài học HSK 1-6
 */
export function resolveCuratedGrammarAST(lessonMeta = {}) {
  const step4 = lessonMeta?.step4_grammar || {};
  const code = lessonMeta?.grammarCode || step4.code || `G-${String(lessonMeta?.canonicalId || lessonMeta?.id || '1').toUpperCase()}`;
  const astEntry = SPECIFIC_GRAMMAR_AST_MAP[code];
  const hskLevel = Number(lessonMeta?.level) || Number(String(lessonMeta?.hskLevel || lessonMeta?.levelId || '1').replace(/\D/g, '')) || 1;
  const titleVi = lessonMeta?.vi || lessonMeta?.title || step4.title || `Ngữ pháp ${code}`;

  if (astEntry) {
    return {
      code,
      titleVi,
      patternDisplay: astEntry.patternDisplay,
      hskLevel,
      category: astEntry.category || `Ngữ pháp HSK ${hskLevel}`,
      formulaTokens: astEntry.formulaTokens || [],
      explanationVi: astEntry.explanationVi || titleVi,
      commonMistakes: [
        {
          wrong_zh: astEntry.wrong_zh,
          right_zh: astEntry.right_zh,
          pinyin: astEntry.pinyin || lessonMeta?.pinyin || '',
          meaning_vi: astEntry.meaning_vi || titleVi,
          reason_vi: astEntry.reason_vi || astEntry.explanationVi || '',
        },
      ],
    };
  }

  return {
    code,
    titleVi,
    patternDisplay: step4.formula || lessonMeta?.zh || titleVi,
    hskLevel,
    category: step4.title || `Ngữ pháp HSK ${hskLevel}`,
    formulaTokens: Array.isArray(lessonMeta?.grammarAst) && lessonMeta.grammarAst.length > 0
      ? lessonMeta.grammarAst.map((t, idx) => ({
          role: idx === 0 ? 'S' : idx === 1 ? 'Keyword' : 'Complement',
          label_zh: t.token || t.label_zh || String(t),
          label_vi: t.role || t.label_vi || `Thành phần #${idx + 1}`,
        }))
      : [],
    explanationVi: step4.explanation || titleVi,
    commonMistakes: step4.commonMistake
      ? [
          {
            wrong_zh: step4.commonMistake.wrong,
            right_zh: step4.commonMistake.correct,
            pinyin: lessonMeta?.pinyin || '',
            meaning_vi: titleVi,
            reason_vi: step4.commonMistake.explanation || '',
          },
        ]
      : [],
  };
}

export default SPECIFIC_GRAMMAR_AST_MAP;
