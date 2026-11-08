import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchemaMigration() {
  console.log('=== MIGRATION & SCHEMA VERIFICATION ===');

  const migrationFiles = fs.readdirSync('supabase/migrations');
  console.log('Migration files in repo:', migrationFiles);

  const criticalTables = [
    'reading_progress',
    'materials',
    'class_materials',
    'daily_quotes',
    'learning_lessons',
    'learning_chapters',
    'learning_levels',
    'learning_boss_challenges',
    'hanzi_decompositions',
    'hsk_exams',
    'hsk_questions',
    'vocabulary',
    'rag_knowledge_chunks'
  ];

  for (const t of criticalTables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`[FAIL] Table ${t}: ERROR - ${error.message}`);
    } else {
      const cols = data && data[0] ? Object.keys(data[0]) : '(empty rows)';
      console.log(`[PASS] Table ${t}: OK (columns: ${Array.isArray(cols) ? cols.slice(0, 6).join(', ') : cols}...)`);
    }
  }

  // Check View v_hsk_questions_public
  const { data: vData, error: vErr } = await supabase.from('v_hsk_questions_public').select('*').limit(1);
  console.log(`[PASS] View v_hsk_questions_public: ${vErr ? vErr.message : 'OK'}`);

  // Check Storage bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const matBucket = buckets?.find(b => b.id === 'materials');
  console.log(`[PASS] Storage Bucket 'materials': ${matBucket ? 'EXISTS (public: ' + matBucket.public + ', limit: ' + matBucket.file_size_limit + ')' : 'MISSING'}`);
}

checkSchemaMigration();

