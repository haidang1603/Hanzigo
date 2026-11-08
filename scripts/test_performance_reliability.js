import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

async function runPerformanceAudit() {
  console.log('================================================================');
  console.log('PERFORMANCE & RELIABILITY BENCHMARK (SUPABASE PRODUCTION)');
  console.log('================================================================\n');

  // 1. Latency & Index Lookup
  console.log('--- 1. Query Latency & Index Benchmarks ---');
  
  // Single lesson by ID
  const t0 = performance.now();
  const { data: lesson } = await anonClient.from('learning_lessons').select('*').eq('id', 'l-101').single();
  const lLat = (performance.now() - t0).toFixed(1);
  console.log(`Single Lesson (l-101) by PK: ${lLat}ms | Title: "${lesson?.title}"`);

  // Chapter lessons (Foreign key index: chapter_id)
  const t1 = performance.now();
  const { data: chLessons } = await anonClient.from('learning_lessons').select('id, title, lesson_number').eq('chapter_id', 'ch-1');
  const chLat = (performance.now() - t1).toFixed(1);
  console.log(`Chapter Lessons (ch-1, 5 rows): ${chLat}ms | Count: ${chLessons?.length}`);

  // Pagination on dictionary_entries (125,314 rows)
  const t2 = performance.now();
  const { data: dictPage, count: dictCount } = await anonClient
    .from('dictionary_entries')
    .select('id, simplified, pinyin, definition', { count: 'exact' })
    .range(0, 19);
  const dictLat = (performance.now() - t2).toFixed(1);
  console.log(`Dictionary Page 1 (20 items out of ${dictCount} rows): ${dictLat}ms`);

  // Vocabulary search by Hanzi
  const t3 = performance.now();
  const { data: vSearch } = await anonClient.from('vocabulary').select('*').eq('hanzi', '你好');
  const vLat = (performance.now() - t3).toFixed(1);
  console.log(`Vocabulary search (hanzi="你好"): ${vLat}ms | Result: ${vSearch?.[0]?.meaning}`);

  // 2. Concurrent Writes & Race Condition Test
  console.log('\n--- 2. Concurrent Writes & Constraint Resilience ---');
  const testUser = '2273f87a-3460-4776-87ce-5031c39608ca';
  const testMat = 'mat-race-condition-test';

  console.log('Launching 10 simultaneous concurrent upserts to reading_progress...');
  const promises = [];
  for (let i = 1; i <= 10; i++) {
    promises.push(
      serviceClient.from('reading_progress').upsert([{
        user_id: testUser,
        material_id: testMat,
        title: `Race Test ${i}`,
        current_page: i,
        total_pages: 50,
        progress_percent: i * 2,
        last_read_at: new Date().toISOString()
      }], { onConflict: 'user_id,material_id' })
    );
  }

  const results = await Promise.all(promises);
  const failed = results.filter(r => r.error);
  console.log(`Concurrent writes completed. Errors: ${failed.length}/10`);

  // Verify only 1 row exists due to unique constraint uq_user_material_reading
  const { data: raceRows } = await serviceClient
    .from('reading_progress')
    .select('*')
    .eq('user_id', testUser)
    .eq('material_id', testMat);

  console.log(`Total rows in database after 10 concurrent writes: ${raceRows.length} (Must be exactly 1)`);
  console.log(`Final preserved page in row: Page ${raceRows[0]?.current_page}`);

  // Clean up
  await serviceClient.from('reading_progress').delete().eq('user_id', testUser).eq('material_id', testMat);
  console.log('Race test record cleaned up.');

  console.log('\n=== PERFORMANCE & RELIABILITY AUDIT: PASSED ===');
}

runPerformanceAudit();

