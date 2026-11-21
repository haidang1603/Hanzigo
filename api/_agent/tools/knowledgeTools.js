/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: READ-ONLY KNOWLEDGE TOOLS (LOW RISK)
 * =========================================================================
 * 6 real read-only tools backed by HanziGo's curated HSK 1-9 datasets,
 * Supabase verified tables (when configured), and Hybrid RAG retriever.
 * Node.js / Vercel Serverless safe (no window/localStorage/DOM usage).
 */

import { RISK_LEVELS } from '../contracts.js';
import { sanitizeUntrustedContext } from '../guardrails.js';
import {
  BUILTIN_CURATED_CHUNKS,
  retrieveRagKnowledge,
} from '../../_utils/ragRetriever.js';

import { VOCABULARY_LIST } from '../../../src/data/chineseData.js';
import { HSK79_VOCAB_GLOSSARY } from '../../../src/features/curriculum/hsk79VocabGlossary.js';
import { EXTENDED_COMMON_CHARS } from '../../../src/data/commonCharactersDict.js';
import { getHanziDecomposition } from '../../../src/data/hanziDecomposition.js';
import {
  getCharacterDecomposition,
  getConfusingPairForChar,
} from '../../../src/data/characterDecompositionData.js';
import { findRadical } from '../../../src/data/radicalsData.js';
import { FUNCTION_WORDS_VOCAB_LIST } from '../../../src/data/functionWordsData.js';
import { HSK6_IDIOMS_DATABASE } from '../../../src/data/hsk6IdiomsData.js';
import { LEARNING_LESSONS } from '../../../src/data/learningPathData.js';

const MAX_RESULTS_PER_CALL = 5;

function clampLimit(limit, fallback = MAX_RESULTS_PER_CALL) {
  const n = Number.parseInt(limit, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(MAX_RESULTS_PER_CALL, n);
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

/**
 * 1. lookup_dictionary_entry
 */
export const lookupDictionaryEntryTool = {
  name: 'lookup_dictionary_entry',
  description: 'Tra cứu nghĩa tiếng Việt, Pinyin, âm Hán-Việt, cấp HSK và ví dụ từ kho từ điển HSK 1-9 của HanziGo.',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Từ chữ Hán, Pinyin hoặc nghĩa tiếng Việt cần tra.', maxLength: 100 },
      hskLevel: { type: 'string', description: 'Lọc theo cấp HSK (ví dụ HSK 1, HSK 7-9).', maxLength: 20 },
      limit: { type: 'integer', minimum: 1, maximum: 5, description: 'Số lượng kết quả tối đa (1-5).' },
    },
    required: ['query'],
  },
  async execute(args, context = {}) {
    const q = String(args.query || '').trim();
    const qLower = q.toLowerCase();
    const maxItems = clampLimit(args.limit);
    const levelFilter = normalizeText(args.hskLevel);
    const items = [];
    const sources = [];
    const seen = new Set();

    const pushItem = (item, source) => {
      if (items.length >= maxItems) return;
      const key = `${item.hanzi}:${item.pinyin}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
      if (source) sources.push(source);
    };

    // 1a. Curated HSK 1-6 VOCABULARY_LIST
    for (const entry of VOCABULARY_LIST) {
      if (items.length >= maxItems) break;
      if (levelFilter && normalizeText(entry.level) !== levelFilter) continue;
      const matched =
        entry.hanzi === q ||
        entry.traditional === q ||
        normalizeText(entry.hanzi).includes(qLower) ||
        normalizeText(entry.pinyin).includes(qLower) ||
        normalizeText(entry.meaning).includes(qLower);
      if (!matched) continue;

      pushItem(
        {
          hanzi: entry.hanzi,
          traditional: entry.traditional || entry.hanzi,
          pinyin: entry.pinyin,
          hanviet: entry.hanviet || '',
          pos: entry.pos || '',
          meaning: entry.meaning,
          level: entry.level || 'HSK',
          example: entry.example || null,
        },
        {
          sourceId: `dict:chineseData:${entry.id || entry.hanzi}`,
          title: `${entry.hanzi} (${entry.level || 'HSK'}) — ${entry.source || 'HanziGo Vocabulary'}`,
          type: 'dictionary',
          verified: true,
        }
      );
    }

    // 1b. Curated HSK 7-9 Glossary
    if (items.length < maxItems && (!levelFilter || levelFilter.includes('7') || levelFilter.includes('8') || levelFilter.includes('9'))) {
      for (const [word, meta] of Object.entries(HSK79_VOCAB_GLOSSARY)) {
        if (items.length >= maxItems) break;
        const matched =
          word === q ||
          word.includes(q) ||
          normalizeText(meta?.pinyin).includes(qLower) ||
          normalizeText(meta?.meaning).includes(qLower);
        if (!matched) continue;

        pushItem(
          {
            hanzi: word,
            traditional: word,
            pinyin: meta.pinyin || '',
            hanviet: meta.hanViet || '',
            pos: meta.pos || '',
            meaning: meta.meaning || '',
            level: 'HSK 7-9',
            register: meta.register || null,
            collocations: Array.isArray(meta.collocations) ? meta.collocations.slice(0, 3) : [],
          },
          {
            sourceId: `dict:hsk79:${word}`,
            title: `${word} (HSK 7-9 Glossary)`,
            type: 'dictionary',
            verified: true,
          }
        );
      }
    }

    // 1c. Common single characters fallback
    if (items.length < maxItems && EXTENDED_COMMON_CHARS[q]) {
      const ch = EXTENDED_COMMON_CHARS[q];
      pushItem(
        {
          hanzi: q,
          traditional: q,
          pinyin: ch.pinyin,
          hanviet: ch.hanviet || '',
          meaning: ch.meaning,
          level: 'Common',
          radical: ch.radical || '',
          strokesCount: ch.strokesCount || null,
        },
        {
          sourceId: `dict:commonChar:${q}`,
          title: `${q} — Common Characters Dictionary`,
          type: 'dictionary',
          verified: true,
        }
      );
    }

    // 1d. Optional Supabase dictionary_entries enrichment
    if (items.length < maxItems && context?.supabaseClient) {
      try {
        const { data } = await context.supabaseClient
          .from('dictionary_entries')
          .select('id, simplified, traditional, pinyin_display, han_viet, pos_meanings')
          .eq('simplified', q)
          .limit(maxItems - items.length);
        for (const row of data || []) {
          const meaningsText = Array.isArray(row.pos_meanings)
            ? row.pos_meanings.map((m) => `${m.pos || ''}: ${(m.definitions || []).join('; ')}`).join(' | ')
            : '';
          pushItem(
            {
              hanzi: row.simplified,
              traditional: row.traditional || row.simplified,
              pinyin: row.pinyin_display || '',
              hanviet: row.han_viet || '',
              meaning: sanitizeUntrustedContext(meaningsText),
              level: 'Curated DB',
            },
            {
              sourceId: `dictionary_entries:${row.id || row.simplified}`,
              title: `${row.simplified} (dictionary_entries)`,
              type: 'dictionary',
              verified: true,
            }
          );
        }
      } catch {
        // Non-fatal fallback to local curated data
      }
    }

    return {
      data: { found: items.length > 0, count: items.length, items },
      sources,
    };
  },
};

/**
 * 2. lookup_hanzi_decomposition
 */
export const lookupHanziDecompositionTool = {
  name: 'lookup_hanzi_decomposition',
  description: 'Chiết tự bộ thủ, cấu trúc chữ Hán, số nét và cặp chữ dễ nhầm từ dữ liệu Hán tự HanziGo.',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      character: { type: 'string', description: '1 đến 4 chữ Hán cần chiết tự.', maxLength: 16 },
    },
    required: ['character'],
  },
  async execute(args) {
    const chars = Array.from(String(args.character || '').trim())
      .filter((ch) => /[\u4e00-\u9fa5\u3400-\u4dbf]/.test(ch))
      .slice(0, MAX_RESULTS_PER_CALL);

    const items = [];
    const sources = [];

    for (const ch of chars) {
      const idsDecomp = getHanziDecomposition(ch);
      const basicDecomp = getCharacterDecomposition(ch);
      const confusing = getConfusingPairForChar(ch);
      const radicalInfo = findRadical(ch);

      if (!idsDecomp && !basicDecomp && !radicalInfo) continue;

      items.push({
        character: ch,
        structure: idsDecomp?.structure || basicDecomp?.structure || null,
        components: idsDecomp?.components || basicDecomp?.components || [],
        radical: idsDecomp?.radical || basicDecomp?.radical || radicalInfo?.radical || null,
        strokes: idsDecomp?.strokes || basicDecomp?.strokes || radicalInfo?.strokes || null,
        mnemonic: idsDecomp?.mnemonic || basicDecomp?.mnemonic || null,
        confusingPair: confusing || null,
      });

      sources.push({
        sourceId: `hanzi:decomp:${ch}`,
        title: `Chiết tự Hán tự ${ch}`,
        type: 'hanzi',
        verified: true,
      });
    }

    return {
      data: { found: items.length > 0, count: items.length, items },
      sources,
    };
  },
};

/**
 * 3. lookup_grammar_pattern
 */
export const lookupGrammarPatternTool = {
  name: 'lookup_grammar_pattern',
  description: 'Tra cứu công thức ngữ pháp, hư từ và lỗi thường gặp theo chuẩn HSK.',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Từ khóa ngữ pháp, mã điểm ngữ pháp hoặc hư từ (ví dụ 把, 比, 的).', maxLength: 100 },
      hskLevel: { type: 'string', description: 'Cấp độ HSK.', maxLength: 20 },
      limit: { type: 'integer', minimum: 1, maximum: 5 },
    },
    required: ['query'],
  },
  async execute(args, context = {}) {
    const q = String(args.query || '').trim();
    const qLower = q.toLowerCase();
    const maxItems = clampLimit(args.limit);
    const items = [];
    const sources = [];
    const seen = new Set();

    const pushGrammar = (item, source) => {
      if (items.length >= maxItems || seen.has(item.title)) return;
      seen.add(item.title);
      items.push(item);
      if (source) sources.push(source);
    };

    // 3a. Curated grammar chunks
    for (const chunk of BUILTIN_CURATED_CHUNKS) {
      if (items.length >= maxItems) break;
      if (chunk.chunk_type !== 'grammar') continue;
      const matched =
        chunk.simplified === q ||
        q.includes(chunk.simplified) ||
        normalizeText(chunk.grammar_pattern).includes(qLower) ||
        normalizeText(chunk.vietnamese_meaning).includes(qLower);
      if (!matched) continue;

      pushGrammar(
        {
          title: chunk.simplified,
          hskLevel: chunk.hsk_level,
          pattern: chunk.grammar_pattern,
          meaning: chunk.vietnamese_meaning,
          notes: chunk.pedagogical_notes,
          examples: (chunk.example_sentences || []).slice(0, 2),
        },
        {
          sourceId: chunk.source_id || chunk.id,
          title: chunk.source_title,
          type: 'grammar',
          verified: true,
        }
      );
    }

    // 3b. Function words & particles data
    for (const fw of FUNCTION_WORDS_VOCAB_LIST) {
      if (items.length >= maxItems) break;
      const matched =
        fw.hanzi === q ||
        q.includes(fw.hanzi) ||
        normalizeText(fw.pinyin).includes(qLower) ||
        normalizeText(fw.meaning).includes(qLower);
      if (!matched) continue;

      pushGrammar(
        {
          title: `${fw.hanzi} (${fw.pinyin})`,
          hskLevel: fw.level || 'HSK',
          pos: fw.pos || 'Hư từ',
          meaning: fw.meaning,
          notes: fw.mnemonic || '',
          examples: fw.example ? [fw.example] : [],
        },
        {
          sourceId: `grammar:functionWord:${fw.id || fw.hanzi}`,
          title: `${fw.hanzi} — ${fw.source || 'Function Words Bank'}`,
          type: 'grammar',
          verified: true,
        }
      );
    }

    // 3c. Optional Supabase grammar_points
    if (items.length < maxItems && context?.supabaseClient) {
      try {
        const { data } = await context.supabaseClient
          .from('grammar_points')
          .select('code, title_vi, pattern_display, hsk_level, explanation_vi, common_mistakes')
          .or(`code.ilike.%${q}%,pattern_display.ilike.%${q}%,title_vi.ilike.%${q}%`)
          .limit(maxItems - items.length);
        for (const row of data || []) {
          pushGrammar(
            {
              title: `[${row.code}] ${row.pattern_display}`,
              hskLevel: `HSK ${row.hsk_level || ''}`.trim(),
              pattern: row.pattern_display,
              meaning: sanitizeUntrustedContext(row.title_vi),
              notes: sanitizeUntrustedContext(row.explanation_vi),
              commonMistakes: Array.isArray(row.common_mistakes) ? row.common_mistakes.slice(0, 2) : [],
            },
            {
              sourceId: `grammar_points:${row.code}`,
              title: `${row.code}: ${row.pattern_display}`,
              type: 'grammar',
              verified: true,
            }
          );
        }
      } catch {
        // Non-fatal fallback
      }
    }

    return {
      data: { found: items.length > 0, count: items.length, items },
      sources,
    };
  },
};

/**
 * 4. lookup_chengyu_idiom
 */
export const lookupChengyuIdiomTool = {
  name: 'lookup_chengyu_idiom',
  description: 'Tra cứu thành ngữ 4 chữ Trung Quốc (nghĩa đen, nghĩa bóng, lỗi hay sai, ví dụ).',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Thành ngữ chữ Hán, Pinyin hoặc nghĩa tiếng Việt.', maxLength: 80 },
      limit: { type: 'integer', minimum: 1, maximum: 5 },
    },
    required: ['query'],
  },
  async execute(args, context = {}) {
    const q = String(args.query || '').trim();
    const qLower = q.toLowerCase();
    const maxItems = clampLimit(args.limit);
    const items = [];
    const sources = [];
    const seen = new Set();

    for (const idiom of HSK6_IDIOMS_DATABASE) {
      if (items.length >= maxItems) break;
      const matched =
        idiom.chengyu === q ||
        q.includes(idiom.chengyu) ||
        normalizeText(idiom.chengyu).includes(qLower) ||
        normalizeText(idiom.pinyin).includes(qLower) ||
        normalizeText(idiom.meaning).includes(qLower);
      if (!matched) continue;

      seen.add(idiom.chengyu);
      items.push({
        chengyu: idiom.chengyu,
        pinyin: idiom.pinyin,
        hanviet: idiom.hanviet,
        meaning: idiom.meaning,
        literalMeaning: idiom.literalMeaning,
        figurativeMeaning: idiom.figurativeMeaning,
        commonMistakes: idiom.commonMistakes || null,
        example: idiom.example
          ? { chinese: idiom.example, pinyin: idiom.examplePinyin, vietnamese: idiom.exampleMeaning }
          : null,
      });
      sources.push({
        sourceId: `chengyu:${idiom.id || idiom.chengyu}`,
        title: `${idiom.chengyu} — HSK 6 Idioms Database`,
        type: 'chengyu',
        verified: true,
      });
    }

    if (items.length < maxItems && context?.supabaseClient) {
      try {
        const { data } = await context.supabaseClient
          .from('chengyu_entries')
          .select('chengyu, pinyin, han_viet, literal_meaning_vi, figurative_meaning_vi, vietnamese_equivalent_idiom')
          .ilike('chengyu', `%${q}%`)
          .limit(maxItems - items.length);
        for (const row of data || []) {
          if (seen.has(row.chengyu)) continue;
          seen.add(row.chengyu);
          items.push({
            chengyu: row.chengyu,
            pinyin: row.pinyin,
            hanviet: row.han_viet,
            literalMeaning: sanitizeUntrustedContext(row.literal_meaning_vi),
            figurativeMeaning: sanitizeUntrustedContext(row.figurative_meaning_vi),
            vietnameseEquivalent: sanitizeUntrustedContext(row.vietnamese_equivalent_idiom),
          });
          sources.push({
            sourceId: `chengyu_entries:${row.chengyu}`,
            title: `${row.chengyu} (chengyu_entries)`,
            type: 'chengyu',
            verified: true,
          });
        }
      } catch {
        // Non-fatal fallback
      }
    }

    return {
      data: { found: items.length > 0, count: items.length, items },
      sources,
    };
  },
};

/**
 * 5. get_curriculum_lesson_context
 */
export const getCurriculumLessonContextTool = {
  name: 'get_curriculum_lesson_context',
  description: 'Lấy ngữ cảnh bài học trong lộ trình chuẩn HanziGo (theo mã bài học hoặc cấp HSK + từ khóa).',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      lessonId: { type: 'string', description: 'Mã bài học (ví dụ l-101, l-304).', maxLength: 32 },
      hskLevel: { type: 'string', description: 'Cấp độ HSK (ví dụ HSK 1, HSK 3).', maxLength: 20 },
      query: { type: 'string', description: 'Từ khóa chủ đề bài học.', maxLength: 80 },
      limit: { type: 'integer', minimum: 1, maximum: 5 },
    },
    required: [],
  },
  async execute(args) {
    const lessonId = normalizeText(args.lessonId);
    const levelFilter = normalizeText(args.hskLevel);
    const query = normalizeText(args.query);
    const maxItems = clampLimit(args.limit, 3);

    const matches = [];
    for (const lesson of LEARNING_LESSONS) {
      if (matches.length >= maxItems) break;
      if (lessonId && normalizeText(lesson.id) !== lessonId) continue;
      if (levelFilter) {
        const lvlMatch =
          normalizeText(lesson.levelId).includes(levelFilter.replace(/\D/g, '')) ||
          normalizeText(lesson.hskLevel) === levelFilter;
        if (!lvlMatch) continue;
      }
      if (query) {
        const hay = `${lesson.title || ''} ${lesson.chineseTitle || ''} ${lesson.desc || ''} ${lesson.grammarFocus || ''}`.toLowerCase();
        if (!hay.includes(query)) continue;
      }

      matches.push({
        id: lesson.id,
        title: lesson.title,
        chineseTitle: lesson.chineseTitle || '',
        chapterId: lesson.chapterId || '',
        levelId: lesson.levelId || '',
        desc: lesson.desc || '',
        vocabCount: Array.isArray(lesson.vocabIds) ? lesson.vocabIds.length : 0,
      });
    }

    const sources = matches.map((m) => ({
      sourceId: `curriculum:lesson:${m.id}`,
      title: `Bài ${m.id}: ${m.title}`,
      type: 'curriculum',
      verified: true,
    }));

    return {
      data: { found: matches.length > 0, count: matches.length, items: matches },
      sources,
    };
  },
};

/**
 * 6. search_curated_knowledge
 */
export const searchCuratedKnowledgeTool = {
  name: 'search_curated_knowledge',
  description: 'Tìm kiếm tri thức sư phạm đã kiểm duyệt qua Hybrid RAG (Vector + Lexical + Built-in Curated Chunks).',
  riskLevel: RISK_LEVELS.LOW,
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Câu hỏi hoặc từ khóa tiếng Trung/Việt cần tìm nguồn kiểm duyệt.', maxLength: 200 },
      hskLevel: { type: 'string', description: 'Cấp độ HSK ưu tiên.', maxLength: 20 },
      limit: { type: 'integer', minimum: 1, maximum: 5 },
    },
    required: ['query'],
  },
  async execute(args, context = {}) {
    const ragRes = await retrieveRagKnowledge({
      query: args.query,
      hskLevel: args.hskLevel || null,
      topK: clampLimit(args.limit, 4),
      supabaseClient: context?.supabaseClient || null,
    });

    const verifiedChunks = (ragRes?.chunks || []).filter(
      (c) => c && c.is_verified !== false
    );

    const items = verifiedChunks.map((c) => ({
      id: c.id,
      simplified: sanitizeUntrustedContext(c.simplified || ''),
      pinyin: sanitizeUntrustedContext(c.pinyin || ''),
      hskLevel: c.hsk_level || '',
      chunkType: c.chunk_type || 'curriculum',
      meaning: sanitizeUntrustedContext(c.vietnamese_meaning || ''),
      grammarPattern: c.grammar_pattern ? sanitizeUntrustedContext(c.grammar_pattern) : null,
      pedagogicalNotes: c.pedagogical_notes ? sanitizeUntrustedContext(c.pedagogical_notes) : null,
      confidence: Number((c.confidence || c.hybrid_score || 0).toFixed(4)),
    }));

    const sources = verifiedChunks.map((c) => ({
      sourceId: String(c.source_id || c.id),
      title: String(c.source_title || c.simplified || c.id),
      type: 'rag_curated',
      verified: true,
    }));

    return {
      data: {
        found: items.length > 0,
        evidenceStatus: ragRes?.evidenceStatus || (items.length > 0 ? 'grounded' : 'insufficient_evidence'),
        retrievalMode: ragRes?.retrievalMode || 'unknown',
        count: items.length,
        items,
      },
      sources,
    };
  },
};

export const READ_ONLY_KNOWLEDGE_TOOLS = Object.freeze([
  lookupDictionaryEntryTool,
  lookupHanziDecompositionTool,
  lookupGrammarPatternTool,
  lookupChengyuIdiomTool,
  getCurriculumLessonContextTool,
  searchCuratedKnowledgeTool,
]);

export function registerKnowledgeTools(registry) {
  for (const tool of READ_ONLY_KNOWLEDGE_TOOLS) {
    registry.register(tool);
  }
  return registry;
}
