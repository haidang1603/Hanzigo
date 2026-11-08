import fs from 'node:fs';
import path from 'node:path';

function searchDir(dir, pattern, res = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === 'dist' || f === '.git') continue;
    if (fs.statSync(full).isDirectory()) searchDir(full, pattern, res);
    else if (f.endsWith('.js') || f.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      if (pattern.test(content)) res.push(full);
    }
  }
  return res;
}

console.log('1. activeTab === dashboard:', searchDir('./src', /activeTab\s*===\s*['"]dashboard['"]/));
console.log('2. setActiveTab("dashboard"):', searchDir('./src', /setActiveTab\s*\(\s*['"]dashboard['"]\s*\)/));
console.log('3. "#dashboard":', searchDir('./src', /#dashboard/));
console.log('4. id: "dashboard":', searchDir('./src', /id:\s*['"]dashboard['"]/));

