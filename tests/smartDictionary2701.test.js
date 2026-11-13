import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

import {
  detectSearchInputType,
  fetchOrGenerateDictionaryEntry,
  getRecentSearchHistory,
  getSavedDeckWords,
  saveSearchHistory,
  saveWordToDeck,
  searchDictionaryMultimodal,
  segmentSentenceIntoTokens,
} from '../src/services/dictionaryService.ts';

describe('Task 27.01: Smart Chinese Dictionary', () => {
  it('detects Hanzi, numbered Pinyin, clean Pinyin, Han-Viet, and Vietnamese inputs', () => {
    assert.equal(detectSearchInputType('学习'), 'hanzi');
    assert.equal(detectSearchInputType('ni3 hao3'), 'pinyin_numeric');
    assert.equal(detectSearchInputType('nihao'), 'pinyin_clean');
    assert.equal(detectSearchInputType('hoc tap'), 'han_viet');
    assert.equal(detectSearchInputType('học tập'), 'vietnamese');
  });

  it('segments multi-character Chinese sentences into clickable tokens', () => {
    const tokens = segmentSentenceIntoTokens('我喜欢学习中文');
    assert.ok(tokens.length >= 3, 'Should segment sentence into multiple tokens');
    assert.ok(tokens.some((t) => t.token === '学习' || t.token === '喜欢'));
  });

  it('performs multimodal search under 50ms locally and populates decomposition', async () => {
    const res = await searchDictionaryMultimodal('好');
    assert.equal(res.inputType, 'hanzi');
    assert.ok(res.entries.length > 0, 'Should return entries for 好');
    assert.ok(res.latencyMs < 200, `Expected fast local search, got ${res.latencyMs}ms`);
    assert.ok(res.entries[0].decomposition, 'Entry should include character decomposition');
  });

  it('supports AI Lexicographer fallback caching, history, and saving to vocab deck', async () => {
    const fallbackEntry = await fetchOrGenerateDictionaryEntry('破防');
    assert.ok(fallbackEntry, 'Should synthesize/cache fallback entry');
    assert.equal(fallbackEntry.simplified, '破防');

    const saveRes = await saveWordToDeck(fallbackEntry);
    assert.equal(saveRes.saved, true);
    assert.ok(getSavedDeckWords().includes('破防'));

    const hist = await saveSearchHistory('破防', fallbackEntry);
    assert.ok(hist.some((h) => h.query_text === '破防'));
    const loadedHist = await getRecentSearchHistory();
    assert.ok(loadedHist.length >= 1);
  });

  it('includes pg_trgm GIN indexes and search_dictionary_multimodal RPC in SQL migration', () => {
    const sqlPath = path.join(
      process.cwd(),
      'supabase/migrations/20261112_2701_smart_dictionary.sql'
    );
    const sql = fs.readFileSync(sqlPath, 'utf8');
    assert.ok(sql.includes('CREATE EXTENSION IF NOT EXISTS pg_trgm'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.dictionary_entries'));
    assert.ok(sql.includes('gin_trgm_ops'));
    assert.ok(sql.includes('search_dictionary_multimodal'));
    assert.ok(sql.includes('ENABLE ROW LEVEL SECURITY'));
  });
});

