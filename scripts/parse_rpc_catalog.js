import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const serviceClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

// Parse schema.sql and migrations for all CREATE FUNCTION
const sqlFiles = ['supabase/schema.sql', 'supabase/migrations/20261108_final_security_hardening_v2.sql'];
const functionMap = new Map();

for (const file of sqlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const funcRegex = /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([a-zA-Z0-9_-]+)\s*\(([\s\S]*?)\)\s*RETURNS\s+([\s\S]*?)(?:LANGUAGE|AS|\$\$)/gi;
  let match;
  while ((match = funcRegex.exec(content)) !== null) {
    const name = match[1];
    const rawArgs = match[2].replace(/\s+/g, ' ').trim();
    const returnType = match[3].replace(/\s+/g, ' ').trim();
    
    // Look ahead for SECURITY DEFINER and search_path
    const bodyStart = match.index;
    const bodyChunk = content.slice(bodyStart, bodyStart + 1500);
    const isSecurityDefiner = /SECURITY\s+DEFINER/i.test(bodyChunk);
    const searchPathMatch = bodyChunk.match(/SET\s+search_path\s*=\s*([^;\n]+)/i);
    const searchPath = searchPathMatch ? searchPathMatch[1].trim() : 'NONE (Default)';

    functionMap.set(name, {
      name,
      args: rawArgs,
      returnType,
      isSecurityDefiner,
      searchPath,
      file
    });
  }
}

console.log(`Parsed ${functionMap.size} RPCs from codebase:`);
for (const [name, f] of functionMap.entries()) {
  console.log(`- ${name}(${f.args}) -> ${f.returnType}`);
  console.log(`  Security: ${f.isSecurityDefiner ? 'SECURITY DEFINER' : 'SECURITY INVOKER'} | search_path: ${f.searchPath}`);
}

