// Checks every HTML page in the repo: it must have a <title>, and every inline
// <script> must parse as valid JavaScript.
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';
import vm from 'node:vm';

const SKIP = new Set(['.git', 'node_modules', '_site']);
function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

let failed = 0, count = 0;
for (const file of htmlFiles('.')) {
  count++;
  const html = readFileSync(file, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) { console.error(`${file}: missing <title>`); failed++; }
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = re.exec(html))) {
    i++;
    try { new vm.Script(m[1], {filename: `${file}#script${i}`}); }
    catch (e) { console.error(`${file} script ${i}: ${e.message}`); failed++; }
  }
}
console.log(`Checked ${count} page(s).`);
if (failed) { console.error(`${failed} problem(s) found.`); process.exit(1); }
