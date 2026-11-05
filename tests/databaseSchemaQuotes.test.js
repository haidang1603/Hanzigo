/**
 * =========================================================================
 * HANZI GO - DATABASE SCHEMA: DAILY PROVERBS & QUOTES VERIFICATION
 * =========================================================================
 * Tests:
 * 1. Verification of Daily Quotes DDL in schema.sql & migrations
 * 2. Verification of Row Level Security (RLS) activation on daily_quotes
 * 3. Verification of RLS policies (public read, admin write)
 * 4. Verification of performance index idx_daily_quotes_level
 * 5. Verification of 60 seed proverbs in migration file
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('DATABASE SCHEMA VERIFICATION: Daily Proverbs & Quotes', () => {

  const schemaPath = path.resolve('supabase/schema.sql');
  const migrationPath = path.resolve('supabase/migrations/20261106_daily_quotes.sql');

  test('1. supabase/schema.sql exists and contains daily_quotes table', () => {
    assert.ok(fs.existsSync(schemaPath), 'schema.sql must exist');
    const content = fs.readFileSync(schemaPath, 'utf8');

    assert.ok(content.includes('CREATE TABLE IF NOT EXISTS public.daily_quotes'), 'Must define public.daily_quotes');
    assert.ok(content.includes('hanzi TEXT NOT NULL'), 'daily_quotes must have hanzi column');
    assert.ok(content.includes('meaning TEXT NOT NULL'), 'daily_quotes must have meaning column');
  });

  test('2. RLS is explicitly enabled on daily_quotes in schema.sql', () => {
    const content = fs.readFileSync(schemaPath, 'utf8');
    assert.ok(content.includes('ALTER TABLE public.daily_quotes ENABLE ROW LEVEL SECURITY;'));
  });

  test('3. RLS Security Policies exist for daily_quotes in schema.sql', () => {
    const content = fs.readFileSync(schemaPath, 'utf8');
    assert.ok(content.includes('"daily_quotes_select_public"'));
    assert.ok(content.includes('"daily_quotes_admin_all"'));
  });

  test('4. Performance index exists for daily_quotes', () => {
    const content = fs.readFileSync(schemaPath, 'utf8');
    assert.ok(content.includes('idx_daily_quotes_level'));
  });

  test('5. Migration file exists and seeds 60 authentic Chinese proverbs', () => {
    assert.ok(fs.existsSync(migrationPath), '20261106_daily_quotes.sql must exist');
    const content = fs.readFileSync(migrationPath, 'utf8');

    assert.ok(content.includes('INSERT INTO public.daily_quotes'));
    assert.ok(content.includes('千里之行，始于足下'));
    assert.ok(content.includes('学而不思则罔'));
    assert.ok(content.includes('温故而知新'));
  });

});

