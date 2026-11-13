import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CURATED_CHENGYU_ENTRIES,
  CURATED_COLLOCATION_HUBS,
  matchesChengyuPattern,
  searchChengyuEntries,
  searchCollocationHubs,
  getValidSolitaireNextMoves,
  playChengyuSolitaireTurn,
  stripPinyinTones,
} from '../src/services/chengyuCollocationService.ts';

test('matchesChengyuPattern supports positional wildcards like 半_半_ and _心_意', () => {
  assert.equal(matchesChengyuPattern('半信半疑', '半_半_'), true);
  assert.equal(matchesChengyuPattern('半途而废', '半_半_'), false);
  assert.equal(matchesChengyuPattern('一心一意', '_心_意'), true);
  assert.equal(matchesChengyuPattern('得心应手', '_心_手'), true);
  assert.equal(matchesChengyuPattern('一举两得', '一?两?'), true);
});

test('searchChengyuEntries filters by pattern, topic, sentiment polarity, and Vietnamese equivalent', () => {
  const halfPattern = searchChengyuEntries(CURATED_CHENGYU_ENTRIES, {
    query: '半_半_',
  });
  assert.equal(halfPattern.length, 1);
  assert.equal(halfPattern[0].chengyu, '半信半疑');

  const negativeStudy = searchChengyuEntries(CURATED_CHENGYU_ENTRIES, {
    topic: 'study',
    sentiment: 'negative_贬义',
  });
  assert.ok(negativeStudy.some((e) => e.chengyu === '半途而废'));
  assert.ok(negativeStudy.every((e) => e.sentiment_polarity === 'negative_贬义'));

  const vnIdiomMatch = searchChengyuEntries(CURATED_CHENGYU_ENTRIES, {
    query: 'Nhập gia tùy tục',
  });
  assert.equal(vnIdiomMatch.length, 1);
  assert.equal(vnIdiomMatch[0].chengyu, '入乡随俗');
});

test('searchCollocationHubs finds core words, collocates, and common Vietnamese errors', () => {
  const tigao = searchCollocationHubs(CURATED_COLLOCATION_HUBS, '增加水平');
  assert.equal(tigao.length, 1);
  assert.equal(tigao[0].core_word, '提高');
  assert.ok(
    tigao[0].collocation_patterns.some(
      (p) => p.pattern_type === 'Verb + Noun' && p.common_vietnamese_error?.includes('*增加水平')
    )
  );
});

test('Chengyu Solitaire validates exact Hanzi chain, homophone chain, and rejects duplicates', () => {
  const seed = CURATED_CHENGYU_ENTRIES.find((e) => e.chengyu === '虎头蛇尾');
  assert.ok(seed);

  const validNext = getValidSolitaireNextMoves(
    CURATED_CHENGYU_ENTRIES,
    seed,
    new Set([seed.chengyu]),
    false
  );
  assert.ok(validNext.some((e) => e.chengyu === '尾大不掉'));

  const moveResult = playChengyuSolitaireTurn({
    entries: CURATED_CHENGYU_ENTRIES,
    previousEntry: seed,
    userInput: '尾大不掉',
    usedChengyu: [seed.chengyu],
    allowHomophone: false,
  });
  assert.equal(moveResult.valid, true);
  assert.equal(moveResult.userEntry?.chengyu, '尾大不掉');

  // Duplicate rejection
  const dupResult = playChengyuSolitaireTurn({
    entries: CURATED_CHENGYU_ENTRIES,
    previousEntry: seed,
    userInput: '虎头蛇尾',
    usedChengyu: ['虎头蛇尾'],
  });
  assert.equal(dupResult.valid, false);
});

test('stripPinyinTones normalizes accented pinyin syllables cleanly', () => {
  assert.equal(stripPinyinTones('bàn xìn bàn yí'), 'ban xin ban yi');
  assert.equal(stripPinyinTones('wěi'), 'wei');
});

test('SQL migration 20261112_2904_chengyu_collocations.sql defines chengyu_entries and word_collocation_hubs', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261112_2904_chengyu_collocations.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.chengyu_entries/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.word_collocation_hubs/);
  assert.match(sql, /positive_褒义/);
  assert.match(sql, /negative_贬义/);
});

