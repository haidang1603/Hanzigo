import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  CURATED_TEXTBOOK_SERIES,
  CURATED_TEXTBOOK_UNITS,
  listUnitsForSeries,
  extractUniqueHanziFromUnit,
  syncTextbookUnitToWorkspace,
  markTextbookUnitCompleted,
} from '../src/services/textbookCompanionService.ts';

test('CURATED_TEXTBOOK_SERIES covers all 4 standard textbooks', () => {
  const slugs = CURATED_TEXTBOOK_SERIES.map((s) => s.series_slug);
  assert.ok(slugs.includes('hsk-standard-course'));
  assert.ok(slugs.includes('han-ngu-6-quyen'));
  assert.ok(slugs.includes('boya-chinese'));
  assert.ok(slugs.includes('msutong'));
});

test('listUnitsForSeries and extractUniqueHanziFromUnit return ordered vocab and unique Hanzi chars', async () => {
  const hskSeries = CURATED_TEXTBOOK_SERIES.find((s) => s.series_slug === 'hsk-standard-course');
  assert.ok(hskSeries);

  const units = await listUnitsForSeries(hskSeries.id);
  assert.ok(units.length >= 2);
  const unit5 = units.find((u) => u.volume_number === 3 && u.unit_number === 5);
  assert.ok(unit5);

  const chars = extractUniqueHanziFromUnit(unit5);
  assert.ok(chars.includes('发'));
  assert.ok(chars.includes('烧'));
  assert.ok(chars.includes('胖'));
  assert.equal(new Set(chars).size, chars.length);
});

test('syncTextbookUnitToWorkspace creates an SRS Deck and returns cross-module payload', async () => {
  const series = CURATED_TEXTBOOK_SERIES[0];
  const unit = CURATED_TEXTBOOK_UNITS[0];

  const res = await syncTextbookUnitToWorkspace(series, unit);
  assert.ok(res.deck.id);
  assert.match(res.deck.name, /HSK标准教程/);
  assert.equal(res.syncedWordsCount, unit.unit_vocab_list.length);
  assert.ok(res.writingChars.length > 0);
  assert.ok(res.grammarIds.length > 0);
});

test('markTextbookUnitCompleted records unit completion in enrollment', async () => {
  const series = CURATED_TEXTBOOK_SERIES[0];
  const unit = CURATED_TEXTBOOK_UNITS[0];
  const updated = await markTextbookUnitCompleted(series.id, unit.id);
  assert.ok(updated.completed_unit_ids.includes(unit.id));
});

test('SQL migration 20261112_2907_textbook_companion.sql defines series, units, and enrollments', () => {
  const migrationPath = path.resolve(
    process.cwd(),
    'supabase/migrations/20261112_2907_textbook_companion.sql'
  );
  assert.equal(fs.existsSync(migrationPath), true);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.textbook_series/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.textbook_units/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.user_textbook_enrollments/);
});

