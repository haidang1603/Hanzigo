/**
 * =========================================================================
 * HANZIGO — HSK 2.0 & HSK 3.0 BULK DICTIONARY INGESTION PIPELINE (TASK 32.04)
 * =========================================================================
 * Ingests HSK 2.0 (Levels 1-6) & HSK 3.0 (Levels 1-9) + CC-CEDICT + Han-Viet
 * into `public.dictionary_entries` with 400-row batching and (simplified, pinyin_numeric)
 * deduplication (compatible with both legacy `pinyin_tone` and Migration 38).
 *
 * Usage:
 *   node scripts/seedFullHskDictionary.js
 *   node scripts/seedFullHskDictionary.js --dry-run
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath, pathToFileURL } from 'url';
import { createClient } from '@supabase/supabase-js';
import {
  normalizePinyinTriple,
  registerHanVietReadings,
  resolveHanVietReading,
} from './utils/chinesePhoneticsNormalizer.js';

function loadEmbeddedSeedFullVocabulary() {
  const seedVocabPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seedFullVocabulary.js');
  if (!fs.existsSync(seedVocabPath)) return [];
  try {
    const source = fs.readFileSync(seedVocabPath, 'utf8');
    const marker = 'export const FULL_VOCABULARY_DATA =';
    const startIdx = source.indexOf(marker);
    if (startIdx === -1) return [];
    const arrayStart = source.indexOf('[', startIdx);
    const exportEnd = source.indexOf('];', arrayStart);
    if (arrayStart === -1 || exportEnd === -1) return [];
    const arrayCode = source.slice(arrayStart, exportEnd + 1);
    return vm.runInNewContext(arrayCode, Object.create(null));
  } catch {
    return [];
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const HSK_DATA_DIR = path.join(ROOT_DIR, 'data', 'hsk');
const CEDICT_DIR = path.join(ROOT_DIR, 'scripts', 'cedict_1_0_ts_utf-8_mdbg');
const BATCH_SIZE = 400;

/**
 * Embedded HSK 3.0 (Levels 7-9) & core compound vocabulary for offline CI/CD execution.
 */
const EMBEDDED_CORE_HSK_ENTRIES = [
  { simplified: '数据库', traditional: '數據庫', pinyin: 'shu4 ju4 ku4', hanviet: 'THỐ CỨ KHỐ', hsk_2_level: 6, hsk_3_level: 7, meaning: 'Cơ sở dữ liệu', pos: 'n.', rank: 2450 },
  { simplified: '坚持', traditional: '堅持', pinyin: 'jian1 chi2', hanviet: 'KIÊN TRÌ', hsk_2_level: 4, hsk_3_level: 4, meaning: 'Kiên trì, giữ vững', pos: 'v.', rank: 920 },
  { simplified: '努力', traditional: '努力', pinyin: 'nu:3 li4', hanviet: 'NỖ LỰC', hsk_2_level: 3, hsk_3_level: 3, meaning: 'Nỗ lực, cố gắng', pos: 'v./adj.', rank: 480 },
  { simplified: '人工智能', traditional: '人工智能', pinyin: 'ren2 gong1 zhi4 neng2', hanviet: 'NHÂN CÔNG TRÍ NĂNG', hsk_2_level: 6, hsk_3_level: 7, meaning: 'Trí tuệ nhân tạo (AI)', pos: 'n.', rank: 2100 },
  { simplified: '可持续发展', traditional: '可持續發展', pinyin: 'ke3 chi2 xu4 fa1 zhan3', hanviet: 'KHẢ TRÌ TỤC PHÁT TRIỂN', hsk_2_level: 6, hsk_3_level: 8, meaning: 'Phát triển bền vững', pos: 'n./phr.', rank: 3150 },
  { simplified: '文化交流', traditional: '文化交流', pinyin: 'wen2 hua4 jiao1 liu2', hanviet: 'VĂN HÓA GIAO LƯU', hsk_2_level: 5, hsk_3_level: 7, meaning: 'Giao lưu văn hóa', pos: 'n.', rank: 2680 },
  { simplified: '宏观调控', traditional: '宏觀調控', pinyin: 'hong2 guan1 tiao2 kong4', hanviet: 'HOÀNH QUAN ĐIỀU KHỐNG', hsk_2_level: null, hsk_3_level: 9, meaning: 'Điều tiết vĩ mô', pos: 'n./v.', rank: 4820 },
  { simplified: '体系结构', traditional: '體系結構', pinyin: 'ti3 xi4 jie2 gou4', hanviet: 'THỂ HỆ KẾT CẤU', hsk_2_level: null, hsk_3_level: 8, meaning: 'Kiến trúc hệ thống', pos: 'n.', rank: 4310 },
  { simplified: '综合素质', traditional: '綜合素質', pinyin: 'zong1 he2 su4 zhi4', hanviet: 'TỔNG HỢP TỐ CHẤT', hsk_2_level: 6, hsk_3_level: 8, meaning: 'Tố chất tổng hợp', pos: 'n.', rank: 3890 },
  { simplified: '学术研究', traditional: '學術研究', pinyin: 'xue2 shu4 yan2 jiu1', hanviet: 'HỌC THUẬT NGHIÊN CỨU', hsk_2_level: 6, hsk_3_level: 9, meaning: 'Nghiên cứu học thuật', pos: 'n.', rank: 4120 },
];

function loadEnvFileIfPresent() {
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.join(ROOT_DIR, filename);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && !(key in process.env)) {
        process.env[key] = val;
      }
    }
  }
}

export function chunkArray(items, size = BATCH_SIZE) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function parseLevelNumber(rawLevel) {
  if (rawLevel === null || rawLevel === undefined || rawLevel === '') return null;
  if (typeof rawLevel === 'number') {
    return Number.isInteger(rawLevel) ? rawLevel : null;
  }
  const match = String(rawLevel).match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function parseCsvLine(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current.trim());
  return cols;
}

function loadLocalHskFiles() {
  if (!fs.existsSync(HSK_DATA_DIR)) return [];
  const files = fs.readdirSync(HSK_DATA_DIR).filter((f) => /\.(json|csv)$/i.test(f));
  const collected = [];

  for (const file of files) {
    const fullPath = path.join(HSK_DATA_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const inferred30 = /3\.?0|hsk3/i.test(file);

    if (file.endsWith('.json')) {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : parsed.entries || parsed.words || [];
      for (const item of list) {
        collected.push({ ...item, _inferred30: inferred30 });
      }
    } else if (file.endsWith('.csv')) {
      const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) continue;
      const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
      for (let i = 1; i < lines.length; i += 1) {
        const values = parseCsvLine(lines[i]);
        const row = { _inferred30: inferred30 };
        headers.forEach((h, idx) => {
          row[h] = values[idx] ?? '';
        });
        collected.push(row);
      }
    }
  }

  return collected;
}

function loadCedictLookupMap() {
  const map = new Map();
  if (!fs.existsSync(CEDICT_DIR)) return map;

  const files = fs.readdirSync(CEDICT_DIR).filter((f) => /\.(u8|txt)$/i.test(f));
  for (const file of files) {
    const fullPath = path.join(CEDICT_DIR, file);
    const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
      if (!match) continue;
      const [, traditional, simplified, pinyinNumeric, defsRaw] = match;
      if (!map.has(simplified)) {
        map.set(simplified, {
          traditional,
          pinyinNumeric,
          meanings: defsRaw.split('/').filter(Boolean).slice(0, 4),
        });
      }
    }
  }
  return map;
}

export function buildDictionaryEntryRecord(rawItem, index = 0, cedictMap = new Map()) {
  const simplified = String(
    rawItem.simplified || rawItem.hanzi || rawItem.word || rawItem.chars || ''
  ).trim();
  if (!simplified || !/[\u4e00-\u9fa5]/.test(simplified)) {
    return null;
  }

  const cedictHit = cedictMap.get(simplified);
  const traditional = String(
    rawItem.traditional || cedictHit?.traditional || simplified
  ).trim();

  const rawPinyin = String(
    rawItem.pinyin_numeric ||
      rawItem.pinyin_display ||
      rawItem.pinyin ||
      cedictHit?.pinyinNumeric ||
      ''
  ).trim();

  const phonetics = normalizePinyinTriple(rawPinyin);
  if (!phonetics.pinyin_numeric) {
    return null;
  }

  const rawLevel = parseLevelNumber(rawItem.level ?? rawItem.hsk_level);
  let hsk2Level = parseLevelNumber(rawItem.hsk_2_level);
  let hsk3Level = parseLevelNumber(rawItem.hsk_3_level);

  if (hsk2Level === null && rawLevel !== null && rawLevel >= 1 && rawLevel <= 6 && !rawItem._inferred30) {
    hsk2Level = rawLevel;
  }
  if (hsk3Level === null && rawLevel !== null && rawLevel >= 1 && rawLevel <= 9) {
    hsk3Level = rawLevel;
  }
  if (hsk2Level !== null && (hsk2Level < 1 || hsk2Level > 6)) hsk2Level = null;
  if (hsk3Level !== null && (hsk3Level < 1 || hsk3Level > 9)) hsk3Level = null;

  const hanViet = resolveHanVietReading(
    simplified,
    rawItem.han_viet || rawItem.hanviet || ''
  );

  const meaningText = String(rawItem.meaning || rawItem.meaning_vi || '').trim();
  const posMeanings = Array.isArray(rawItem.pos_meanings)
    ? rawItem.pos_meanings
    : [
        {
          pos: rawItem.pos || rawItem.topic || 'n./v.',
          definitions: meaningText
            ? [meaningText]
            : cedictHit?.meanings || ['Từ vựng chuẩn HSK'],
        },
      ];

  const examples = Array.isArray(rawItem.examples)
    ? rawItem.examples
    : rawItem.example?.hanzi
      ? [
          {
            zh: rawItem.example.hanzi,
            pinyin: rawItem.example.pinyin || '',
            vi: rawItem.example.meaning || '',
          },
        ]
      : [];

  const decomposition =
    rawItem.decomposition && typeof rawItem.decomposition === 'object'
      ? rawItem.decomposition
      : {
          radical: rawItem.radical || '',
          strokes: Number(rawItem.strokes || 0) || null,
          mnemonic: rawItem.mnemonic || '',
        };

  return {
    simplified,
    traditional,
    pinyin_display: phonetics.pinyin_display,
    pinyin_tone: phonetics.pinyin_display,
    pinyin_numeric: phonetics.pinyin_numeric,
    pinyin_clean: phonetics.pinyin_clean,
    han_viet: hanViet,
    hsk_2_level: hsk2Level,
    hsk_3_level: hsk3Level,
    frequency_rank: Number(rawItem.frequency_rank || rawItem.rank || index + 1),
    pos_meanings: posMeanings,
    decomposition,
    measure_words: Array.isArray(rawItem.measure_words) ? rawItem.measure_words : [],
    synonyms_antonyms:
      rawItem.synonyms_antonyms && typeof rawItem.synonyms_antonyms === 'object'
        ? rawItem.synonyms_antonyms
        : {},
    examples,
  };
}

export function loadHskDictionarySources() {
  const embeddedVocab = loadEmbeddedSeedFullVocabulary();
  registerHanVietReadings(embeddedVocab);
  const cedictMap = loadCedictLookupMap();
  const localFilesRows = loadLocalHskFiles();

  const rawCombined = [
    ...embeddedVocab,
    ...EMBEDDED_CORE_HSK_ENTRIES,
    ...localFilesRows,
  ];

  const dedupMap = new Map();
  rawCombined.forEach((item, idx) => {
    const record = buildDictionaryEntryRecord(item, idx, cedictMap);
    if (!record) return;
    const dedupKey = `${record.simplified}::${record.pinyin_numeric}`;
    if (!dedupMap.has(dedupKey)) {
      dedupMap.set(dedupKey, record);
    }
  });

  return Array.from(dedupMap.values());
}

function renderProgressBar(processed, total, startedAtMs) {
  const ratio = total > 0 ? Math.min(1, processed / total) : 1;
  const width = 24;
  const filled = Math.round(ratio * width);
  const bar = `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
  const elapsedSec = Math.max(0.05, (Date.now() - startedAtMs) / 1000);
  const speed = Math.round(processed / elapsedSec);
  process.stdout.write(
    `\r[${bar}] ${Math.round(ratio * 100)}% | ${processed}/${total} từ | ${speed} từ/giây`
  );
}

function summarizeByHskLevel(records) {
  const stats = {};
  for (let lvl = 1; lvl <= 9; lvl += 1) {
    stats[`HSK ${lvl}`] = 0;
  }
  for (const rec of records) {
    const lvl = rec.hsk_3_level || rec.hsk_2_level;
    if (lvl && stats[`HSK ${lvl}`] !== undefined) {
      stats[`HSK ${lvl}`] += 1;
    }
  }
  return stats;
}

async function upsertBatchCompatible(supabase, batch) {
  const simplifiedList = Array.from(new Set(batch.map((r) => r.simplified)));
  const { data: existingRows, error: fetchError } = await supabase
    .from('dictionary_entries')
    .select('id, simplified, pinyin_numeric')
    .in('simplified', simplifiedList);

  if (fetchError) {
    throw fetchError;
  }

  const existingByPair = new Map();
  for (const row of existingRows || []) {
    existingByPair.set(`${row.simplified}::${row.pinyin_numeric}`, row.id);
  }

  const toInsert = [];
  const toUpdate = [];

  for (const item of batch) {
    const pairKey = `${item.simplified}::${item.pinyin_numeric}`;
    const existingId = existingByPair.get(pairKey);
    if (existingId) {
      toUpdate.push({ id: existingId, ...item });
    } else {
      toInsert.push(item);
    }
  }

  let omitLegacyPinyinTone = false;
  const stripLegacy = (row) => {
    if (!omitLegacyPinyinTone) return row;
    const { pinyin_tone: _ignored, ...rest } = row;
    return rest;
  };

  if (toInsert.length > 0) {
    let insertRes = await supabase
      .from('dictionary_entries')
      .insert(toInsert.map(stripLegacy));

    if (insertRes.error?.message?.includes('pinyin_tone')) {
      omitLegacyPinyinTone = true;
      insertRes = await supabase
        .from('dictionary_entries')
        .insert(toInsert.map(stripLegacy));
    }

    if (insertRes.error) {
      throw insertRes.error;
    }
  }

  if (toUpdate.length > 0) {
    let updateRes = await supabase
      .from('dictionary_entries')
      .upsert(toUpdate.map(stripLegacy), { onConflict: 'id' });

    if (updateRes.error?.message?.includes('pinyin_tone')) {
      omitLegacyPinyinTone = true;
      updateRes = await supabase
        .from('dictionary_entries')
        .upsert(toUpdate.map(stripLegacy), { onConflict: 'id' });
    }

    if (updateRes.error) {
      throw updateRes.error;
    }
  }

  return { inserted: toInsert.length, updated: toUpdate.length };
}

export async function runSeedFullHskDictionary({ dryRun = false, limit = 0 } = {}) {
  loadEnvFileIfPresent();

  let records = loadHskDictionarySources();
  if (limit > 0) {
    records = records.slice(0, limit);
  }

  const levelStats = summarizeByHskLevel(records);
  const chunks = chunkArray(records, BATCH_SIZE);
  const startedAtMs = Date.now();

  if (dryRun) {
    let processed = 0;
    for (const chunk of chunks) {
      processed += chunk.length;
      renderProgressBar(processed, records.length, startedAtMs);
    }
    process.stdout.write('\n');
    return {
      dryRun: true,
      total: records.length,
      inserted: records.length,
      updated: 0,
      chunks: chunks.length,
      levelStats,
    };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Thiếu biến môi trường VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY để nạp dictionary_entries.'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let processed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;

  for (const chunk of chunks) {
    const res = await upsertBatchCompatible(supabase, chunk);
    totalInserted += res.inserted;
    totalUpdated += res.updated;
    processed += chunk.length;
    renderProgressBar(processed, records.length, startedAtMs);
  }
  process.stdout.write('\n');

  return {
    dryRun: false,
    total: records.length,
    inserted: totalInserted,
    updated: totalUpdated,
    chunks: chunks.length,
    levelStats,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1], 10) : 0;

  console.log(
    `🚀 HanziGo HSK 2.0 & 3.0 Dictionary Ingestion (${dryRun ? 'DRY-RUN' : 'LIVE'})...`
  );
  const result = await runSeedFullHskDictionary({ dryRun, limit });
  console.log(
    `✅ Hoàn tất: ${result.total} từ (${result.inserted} thêm mới, ${result.updated} cập nhật, ${result.chunks} lô).`
  );
  console.log('📊 Thống kê theo cấp HSK 1-9:', result.levelStats);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error('❌ Lỗi nạp từ điển HSK:', err?.message || err);
    process.exit(1);
  });
}
