import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const VIETNAMESE_DIACRITIC_RE =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export const CEDICT_RAW_RE =
  /(\bCL:|variant of\b|old variant\b|\bsurname\s+[A-Z]|\babbr\.\s*(for|of)\b|\bsee also\b|\blit\.\s|\bfig\.\s|\[[a-zü:]+[1-5]\])/i;

export const ENGLISH_PREFIX_RE = /^(?:to\s+[a-z]{2,}|a\s+[a-z]{3,}|an\s+[a-z]{3,}|the\s+[a-z]{3,})/i;
export const NUMBERED_PINYIN_RE = /\b[a-zü:]{1,6}[1-5]\b/i;
export const PLACEHOLDER_MEANING_RE =
  /^(|\.\.\.|tbd|n\/a|none|null|undefined|chưa cập nhật|đang cập nhật|\?+|-+)$/i;

export const ENGLISH_PAREN_RE =
  /\b(?:Freeship|Involution|Job Offer|Big Data|Delivery Date|Arbitration|Net Zero|Marginal cost|Intangible cultural|Identity dilemma|Tech for Good|Computing infrastructure|Carbon neutrality|Algorithm|Burnout|High Concurrency|Microservices|Throughput|Fault Tolerance|LLM|Vector Database|Inference|Semantics|Encryption|Compliance|Deployment|Code Review|Compute Power|Customs Clearance|Breach of Contract|Force Majeure|MOU|Abstract|Paradigm|Metaphor|Sampling|Domestication|Simultaneous Interpreting|Parallelism|Empower|Ethics|Resilience|Collocation|Merger|Governance|Inspire|Parataxis|Game theory|Spillover|Hedging|Market Clearing|Valuation|Due Diligence|Earn-out|Decentralization|Sense Group|Linear Processing|Subtext|word-by-word)\b/i;

export const CURATED_VOCAB_FILES = [
  'src/data/chineseData.js',
  'src/data/commonCharactersDict.js',
  'src/data/functionWordsData.js',
  'src/data/radicalsData.js',
  'src/data/hsk6IdiomsData.js',
  'src/data/characterDecompositionData.js',
  'src/data/hanziDecomposition.js',
  'src/data/curriculum/hsk1Lessons.js',
  'src/data/curriculum/hsk2Lessons.js',
  'src/data/curriculum/hsk3Lessons.js',
  'src/data/curriculum/hsk4Lessons.js',
  'src/data/curriculum/hsk5Lessons.js',
  'src/data/curriculum/hsk6Lessons.js',
  'src/data/gradedReadersData.js',
  'src/data/materials/grammarCompendium.js',
  'src/data/materials/practicalGuides.js',
  'src/features/curriculum/hsk120SupplementalVocab.js',
  'src/features/curriculum/hsk79VocabGlossary.js',
];

export function classifyMeaningQuality(rawValue) {
  if (rawValue === undefined || rawValue === null) return 'missing';
  const text = String(rawValue).trim();
  if (PLACEHOLDER_MEANING_RE.test(text)) return 'missing';
  if (CEDICT_RAW_RE.test(text)) return 'cedict';
  if (ENGLISH_PREFIX_RE.test(text) && !/^to\s+lớn/i.test(text)) return 'english';
  if (ENGLISH_PAREN_RE.test(text)) return 'mixed_english';
  if (!VIETNAMESE_DIACRITIC_RE.test(text) && /\b(the|and|for|with|from|person|people|time|year|day|work|good|bad|big|small|new|old)\b/i.test(text)) {
    return 'english';
  }
  return 'ok';
}

export async function auditAllCuratedVocabularies(rootDir = process.cwd()) {
  const reports = [];

  for (const rel of CURATED_VOCAB_FILES) {
    const fullPath = path.join(rootDir, rel);
    if (!fs.existsSync(fullPath)) continue;

    const mod = await import(pathToFileURL(fullPath).href);
    const st = {
      file: rel,
      total: 0,
      missing: 0,
      english: 0,
      cedictOrMixed: 0,
      exampleOrPinyinIssues: 0,
      duplicateIds: 0,
      samples: [],
    };
    const seen = new WeakSet();
    const ids = new Set();

    const walk = (node, parentKey = '') => {
      if (!node || typeof node !== 'object' || seen.has(node)) return;
      seen.add(node);
      if (Array.isArray(node)) {
        for (const item of node) walk(item, parentKey);
        return;
      }

      const isHanziKey = /^[\u4e00-\u9fa5]+$/.test(parentKey);
      const word =
        node.hanzi ||
        node.simplified ||
        node.char ||
        node.word ||
        node.idiom ||
        node.chengyu ||
        node.radical ||
        (isHanziKey ? parentKey : null);
      const meaningKey = [
        'meaningVi',
        'meaning_vi',
        'vietnamese',
        'translationVi',
        'meaning',
        'vietnamese_meaning',
        'vi',
      ].find((k) => k in node);

      if (word && typeof word === 'string' && /[\u4e00-\u9fa5]/.test(word) && meaningKey) {
        st.total += 1;
        if (node.id !== undefined && node.id !== null) {
          const idKey = String(node.id);
          if (ids.has(idKey)) st.duplicateIds += 1;
          else ids.add(idKey);
        }

        const cls = classifyMeaningQuality(node[meaningKey]);
        if (cls === 'missing') {
          st.missing += 1;
          if (st.samples.length < 10) st.samples.push({ type: cls, word, val: node[meaningKey] });
        } else if (cls === 'english') {
          st.english += 1;
          if (st.samples.length < 10) st.samples.push({ type: cls, word, val: node[meaningKey] });
        } else if (cls === 'cedict' || cls === 'mixed_english') {
          st.cedictOrMixed += 1;
          if (st.samples.length < 10) st.samples.push({ type: cls, word, val: node[meaningKey] });
        }

        if (typeof node.pinyin === 'string' && NUMBERED_PINYIN_RE.test(node.pinyin)) {
          st.exampleOrPinyinIssues += 1;
          if (st.samples.length < 10) st.samples.push({ type: 'numPinyin', word, val: node.pinyin });
        }

        if (node.example && typeof node.example === 'object') {
          const exZh = node.example.hanzi || node.example.chinese || node.example.zh;
          const exVi =
            node.example.meaning ??
            node.example.meaningVi ??
            node.example.vietnamese ??
            node.example.vi;
          if (exZh && /[\u4e00-\u9fa5]/.test(String(exZh))) {
            const exCls = classifyMeaningQuality(exVi);
            if (exCls !== 'ok') {
              st.exampleOrPinyinIssues += 1;
              if (st.samples.length < 10) st.samples.push({ type: `ex_${exCls}`, word, val: exVi });
            }
            if (typeof node.example.pinyin === 'string' && NUMBERED_PINYIN_RE.test(node.example.pinyin)) {
              st.exampleOrPinyinIssues += 1;
              if (st.samples.length < 10) st.samples.push({ type: 'exNumPinyin', word, val: node.example.pinyin });
            }
          }
        }
      }

      for (const [k, v] of Object.entries(node)) {
        if (v && typeof v === 'object') walk(v, k);
      }
    };

    walk(mod);
    reports.push(st);
  }

  // Pipe-delimited HSK 7-9 Lexicon
  const lexPath = path.join(rootDir, 'src/features/curriculum/hsk7to9LexiconAndGrammarBank.js');
  if (fs.existsSync(lexPath)) {
    const { HSK_7_TO_9_RAW_LEXICON } = await import(pathToFileURL(lexPath).href);
    const st = {
      file: 'src/features/curriculum/hsk7to9LexiconAndGrammarBank.js',
      total: 0,
      missing: 0,
      english: 0,
      cedictOrMixed: 0,
      exampleOrPinyinIssues: 0,
      duplicateIds: 0,
      samples: [],
    };
    for (const [word, spec] of Object.entries(HSK_7_TO_9_RAW_LEXICON || {})) {
      st.total += 1;
      const [pinyin = '', , , meaning = ''] = String(spec || '').split('|');
      const cls = classifyMeaningQuality(meaning);
      if (cls === 'missing') st.missing += 1;
      else if (cls === 'english') st.english += 1;
      else if (cls === 'cedict' || cls === 'mixed_english') st.cedictOrMixed += 1;
      if (NUMBERED_PINYIN_RE.test(pinyin)) st.exampleOrPinyinIssues += 1;
    }
    reports.push(st);
  }

  // TypeScript HSK 7-9 Curriculum Data (static regex scan)
  const tsPath = path.join(rootDir, 'src/data/hsk7to9CurriculumData.ts');
  if (fs.existsSync(tsPath)) {
    const src = fs.readFileSync(tsPath, 'utf8');
    const st = {
      file: 'src/data/hsk7to9CurriculumData.ts',
      total: 0,
      missing: 0,
      english: 0,
      cedictOrMixed: 0,
      exampleOrPinyinIssues: 0,
      duplicateIds: 0,
      samples: [],
    };
    for (const m of src.matchAll(/(meaningVi|exampleVi):\s*'([^']*)'/g)) {
      st.total += 1;
      const cls = classifyMeaningQuality(m[2]);
      if (cls === 'missing') st.missing += 1;
      else if (cls === 'english') st.english += 1;
      else if (cls === 'cedict' || cls === 'mixed_english') st.cedictOrMixed += 1;
    }
    reports.push(st);
  }

  const rawCedictPath = path.join(rootDir, 'scripts/cedict_1_0_ts_utf-8_mdbg/cedict_ts.u8');
  let rawCedictCount = 0;
  if (fs.existsSync(rawCedictPath)) {
    const rawLines = fs.readFileSync(rawCedictPath, 'utf8').split(/\r?\n/);
    rawCedictCount = rawLines.filter((l) => l && !l.startsWith('#')).length;
  }

  return { reports, rawCedictCount };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { reports, rawCedictCount } = await auditAllCuratedVocabularies();
  console.log('File | Tổng mục | Thiếu nghĩa | Lọt tiếng Anh | Lỗi ký hiệu/hỗn hợp | Lỗi ví dụ/Pinyin');
  console.log('--- | ---: | ---: | ---: | ---: | ---:');
  for (const r of reports) {
    console.log(
      `${r.file} | ${r.total} | ${r.missing} | ${r.english} | ${r.cedictOrMixed} | ${r.exampleOrPinyinIssues}`
    );
  }
  console.log(`Raw offline CC-CEDICT source (non-curated cloud seed input): ${rawCedictCount} entries`);
}
