import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  analyzeSentenceComprehensibility,
  findOptimalIPlusOneSentences,
  scanEcosystemForImmersionRecommendations,
  mineSentenceToMultimediaCard,
  listMinedSentenceCards,
  getUserKnownWordsSet,
} from '../src/services/sentenceMiningEngine.ts';

test('analyzeSentenceComprehensibility detects Golden i+1 sentence with exactly 1 unknown word', () => {
  const known = new Set(['我', '今天', '去', '超市', '买']);
  const candidate = {
    sentence_zh: '我今天去超市买东西。',
    sentence_pinyin: 'Wǒ jīntiān qù chāoshì mǎi dōngxi.',
    sentence_vi: 'Hôm nay tôi đi siêu thị mua đồ.',
    tokens: [
      { text: '我', pinyin: 'wǒ', meaning_vi: 'tôi', hsk_level: 1 },
      { text: '今天', pinyin: 'jīntiān', meaning_vi: 'hôm nay', hsk_level: 1 },
      { text: '去', pinyin: 'qù', meaning_vi: 'đi', hsk_level: 1 },
      { text: '超市', pinyin: 'chāoshì', meaning_vi: 'siêu thị', hsk_level: 2 },
      { text: '买', pinyin: 'mǎi', meaning_vi: 'mua', hsk_level: 1 },
      { text: '东西', pinyin: 'dōngxi', meaning_vi: 'đồ đạc', hsk_level: 1 },
      { text: '。', is_punctuation: true },
    ],
    media_context: {
      source_module: 'video',
      source_id: 'vid-1',
      source_title: 'Đi siêu thị',
      video_id: 'vid-1',
      start_ms: 1200,
      end_ms: 4200,
    },
  };

  const result = analyzeSentenceComprehensibility(candidate, known);
  assert.equal(result.is_i_plus_one, true);
  assert.deepEqual(result.unknown_words, ['东西']);
  assert.equal(result.target_word, '东西');
  assert.equal(result.known_count, 5);
  assert.equal(result.total_content_words, 6);
  assert.ok(result.comprehensibility_ratio > 0.8);
});

test('findOptimalIPlusOneSentences filters out 0-unknown and >1-unknown sentences and deduplicates target words', () => {
  const known = new Set(['我', '喜欢', '看', '书']);
  const baseContext = {
    source_module: 'article',
    source_id: 'art-1',
    source_title: 'Test Article',
  };

  const candidates = [
    // 0 unknown -> excluded
    {
      sentence_zh: '我喜欢看书。',
      sentence_pinyin: 'Wǒ xǐhuan kàn shū.',
      sentence_vi: 'Tôi thích đọc sách.',
      tokens: [{ text: '我' }, { text: '喜欢' }, { text: '看' }, { text: '书' }],
      media_context: baseContext,
    },
    // 1 unknown ('电影') -> included
    {
      sentence_zh: '我喜欢看电影。',
      sentence_pinyin: 'Wǒ xǐhuan kàn diànyǐng.',
      sentence_vi: 'Tôi thích xem phim.',
      tokens: [{ text: '我' }, { text: '喜欢' }, { text: '看' }, { text: '电影', pinyin: 'diànyǐng' }],
      media_context: baseContext,
    },
    // duplicate target_word ('电影') -> deduplicated
    {
      sentence_zh: '我看电影。',
      sentence_pinyin: 'Wǒ kàn diànyǐng.',
      sentence_vi: 'Tôi xem phim.',
      tokens: [{ text: '我' }, { text: '看' }, { text: '电影', pinyin: 'diànyǐng' }],
      media_context: baseContext,
    },
    // 2 unknown -> excluded
    {
      sentence_zh: '我每天晚上看小说。',
      sentence_pinyin: 'Wǒ měitiān wǎnshang kàn xiǎoshuō.',
      sentence_vi: 'Mỗi tối tôi đọc tiểu thuyết.',
      tokens: [{ text: '我' }, { text: '每天' }, { text: '看' }, { text: '小说' }],
      media_context: baseContext,
    },
  ];

  const optimal = findOptimalIPlusOneSentences(candidates, known);
  assert.equal(optimal.length, 1);
  assert.equal(optimal[0].target_word, '电影');
});

test('scanEcosystemForImmersionRecommendations returns coverage channels and candidates across modules', async () => {
  const known = await getUserKnownWordsSet();
  assert.ok(known.size > 0);

  const scan = await scanEcosystemForImmersionRecommendations();
  assert.ok(Array.isArray(scan.recommendedChannels));
  assert.ok(scan.recommendedChannels.length > 0);
  assert.ok(Array.isArray(scan.goldenQueue));
  assert.ok(scan.knownWordsCount > 0);
});

test('mineSentenceToMultimediaCard saves card locally and retrieves it via listMinedSentenceCards', async () => {
  const known = new Set(['今天', '天气', '很']);
  const analyzed = analyzeSentenceComprehensibility(
    {
      sentence_zh: '今天天气很凉快。',
      sentence_pinyin: 'Jīntiān tiānqì hěn liángkuai.',
      sentence_vi: 'Thời tiết hôm nay rất mát mẻ.',
      tokens: [
        { text: '今天' },
        { text: '天气' },
        { text: '很' },
        { text: '凉快', pinyin: 'liángkuai', meaning_vi: 'mát mẻ' },
      ],
      media_context: {
        source_module: 'video',
        source_id: 'vid-weather',
        source_title: 'Dự báo thời tiết',
        video_id: 'vid-weather',
        start_ms: 5000,
        end_ms: 8500,
      },
    },
    known
  );

  const card = await mineSentenceToMultimediaCard({ analyzed });
  assert.ok(card.id);
  assert.equal(card.target_word, '凉快');
  assert.equal(card.is_i_plus_one, true);
  assert.equal(card.media_context.source_module, 'video');

  const allCards = await listMinedSentenceCards();
  assert.ok(allCards.some((c) => c.id === card.id));
});

test('SQL migration 20261112_2908_sentence_mining_hub.sql defines mined_sentence_cards and RLS', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261112_2908_sentence_mining_hub.sql'
  );
  assert.ok(fs.existsSync(migrationPath));
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.mined_sentence_cards/i);
  assert.match(sql, /media_context JSONB/i);
  assert.match(sql, /comprehensibility_ratio/i);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/i);
});
