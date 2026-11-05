import test from 'node:test';
import assert from 'node:assert/strict';
import { DAILY_QUOTES, getDailyQuote, getRandomQuote } from '../src/data/dailyQuotesData.js';

test('Daily Quotes: Dataset completeness and schema validity', () => {
  assert.ok(DAILY_QUOTES.length >= 30, 'Must contain at least 30 inspiring proverbs for monthly rotation');

  DAILY_QUOTES.forEach((q, idx) => {
    assert.ok(q.id, `Quote at index ${idx} must have an id`);
    assert.ok(typeof q.hanzi === 'string' && q.hanzi.length > 0, `Quote ${q.id} must have valid hanzi`);
    assert.ok(typeof q.pinyin === 'string' && q.pinyin.length > 0, `Quote ${q.id} must have valid pinyin`);
    assert.ok(typeof q.meaning === 'string' && q.meaning.length > 0, `Quote ${q.id} must have valid Vietnamese meaning`);
    assert.ok(typeof q.author === 'string' && q.author.length > 0, `Quote ${q.id} must have author/source`);
  });
});

test('Daily Quotes: Deterministic quote selection per calendar day', () => {
  const day1 = new Date('2026-11-05');
  const day2 = new Date('2026-11-06');
  const day3 = new Date('2026-11-07');

  const quoteDay1A = getDailyQuote(day1);
  const quoteDay1B = getDailyQuote(day1);
  assert.equal(quoteDay1A.id, quoteDay1B.id, 'Same calendar day must always return the exact same quote');

  const quoteDay2 = getDailyQuote(day2);
  const quoteDay3 = getDailyQuote(day3);

  // Different days yield rotating quotes
  assert.notEqual(quoteDay1A.id, quoteDay2.id, 'Adjacent days must rotate to different quotes');
  assert.notEqual(quoteDay2.id, quoteDay3.id, 'Day 2 and Day 3 must rotate to different quotes');
});

test('Daily Quotes: getRandomQuote retrieves diverse quote excluding current', () => {
  const currentQuote = DAILY_QUOTES[0];
  for (let i = 0; i < 15; i++) {
    const random = getRandomQuote(currentQuote.id);
    assert.ok(random.id, 'Must return valid quote');
    assert.notEqual(random.id, currentQuote.id, 'Must exclude current quote when requested');
  }
});

