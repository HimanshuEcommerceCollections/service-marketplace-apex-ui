// Wrap a page component's top-level return fragment in a route-scope div.
// Anchors on `return (\n    <>` ... `\n    </>\n  );` — the 4-space-indented
// top-level fragment whose close is immediately followed by `);`. Inline icon
// fragments (`<>...</>` on one line) are not matched.
import fs from 'fs';
const [file, cls] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
const openRe = /return \(\r?\n(\s*)<>\r?\n/;
const closeRe = /\r?\n(\s*)<\/>\r?\n(\s*)\);/;
if (!openRe.test(s)) throw new Error('open fragment not found in ' + file);
if (!closeRe.test(s)) throw new Error('close fragment not found in ' + file);
s = s.replace(openRe, (m, ind) => `return (\n${ind}<div className="${cls}">\n`);
s = s.replace(closeRe, (m, ind, ind2) => `\n${ind}</div>\n${ind2});`);
fs.writeFileSync(file, s);
console.log('wrapped', file, 'with', cls);
