import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Supabase URL or Key not found in environment.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function runAudit() {
  console.log('================================================================');
  console.log('HANZIGO SUPABASE LIVE AUDIT');
  console.log('Endpoint:', url);
  console.log('================================================================\n');

  // 1. Get all table names mentioned in schema.sql + migrations
  const schemaContent = fs.readFileSync('supabase/schema.sql', 'utf8');
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([^\s(]+)/gi;
  let match;
  const tableSet = new Set(['reading_progress', 'materials', 'class_materials', 'daily_quotes']);

  while ((match = createTableRegex.exec(schemaContent)) !== null) {
    const raw = match[1].replace(/["`]/g, '').trim();
    const tName = raw.includes('.') ? raw.split('.')[1] : raw;
    tableSet.add(tName);
  }

  // Also scan all files in src/ for .from('...')
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = `${dir}/${file}`;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        scanDir(fullPath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const fromMatches = content.matchAll(/\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g);
        for (const m of fromMatches) {
          tableSet.add(m[1]);
        }
      }
    }
  }
  scanDir('src');
  scanDir('api');

  const tableList = Array.from(tableSet).sort();
  console.log(`Auditing ${tableList.length} potential tables...\n`);

  const results = {
    existing: [],
    missing: [],
    errors: []
  };

  for (const table of tableList) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('not found')) {
          results.missing.push({ table, error: error.message, code: error.code });
        } else {
          results.errors.push({ table, error: error.message, code: error.code });
        }
      } else {
        results.existing.push({ table, count: count ?? 0 });
      }
    } catch (err) {
      results.errors.push({ table, error: err.message });
    }
  }

  console.log('--- EXISTING TABLES IN SUPABASE ---');
  results.existing.forEach(r => {
    console.log(`  ✓ ${r.table.padEnd(30)} : ${r.count} rows`);
  });

  console.log('\n--- MISSING TABLES IN SUPABASE (NEED MIGRATION) ---');
  results.missing.forEach(r => {
    console.log(`  ✗ ${r.table.padEnd(30)} : ${r.error}`);
  });

  if (results.errors.length) {
    console.log('\n--- TABLES WITH ERRORS / PERMISSION ISSUES ---');
    results.errors.forEach(r => {
      console.log(`  ! ${r.table.padEnd(30)} : ${r.error} (${r.code})`);
    });
  }

  // 2. Storage Buckets Audit
  console.log('\n================================================================');
  console.log('STORAGE BUCKETS AUDIT');
  console.log('================================================================');
  try {
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) {
      console.error('Lỗi lấy danh sách buckets:', bucketErr.message);
    } else {
      console.log(`Tìm thấy ${buckets.length} storage buckets:`);
      for (const b of buckets) {
        console.log(`  - Bucket: "${b.name}" | Public: ${b.public} | Created: ${b.created_at}`);
        // List files in bucket
        try {
          const { data: files, error: filesErr } = await supabase.storage.from(b.name).list('', { limit: 20 });
          if (filesErr) {
            console.log(`    (Lỗi đọc tệp: ${filesErr.message})`);
          } else {
            console.log(`    Objects count in root (${files.length}):`, files.map(f => f.name).join(', ') || 'trống');
          }
        } catch (e) {
          console.log(`    (Không thể liệt kê tệp: ${e.message})`);
        }
      }
    }
  } catch (err) {
    console.error('Storage audit exception:', err.message);
  }

  // Save report JSON
  fs.writeFileSync('scripts/supabase_audit_result.json', JSON.stringify({
    url,
    timestamp: new Date().toISOString(),
    results
  }, null, 2));
  console.log('\nAudit data saved to scripts/supabase_audit_result.json');
}

runAudit().catch(console.error);

