// One-time route-CSS scoping codemod.
//
// Prefixes every selector in a route stylesheet with a route-scope class
// (e.g. `.stepper` -> `.pg-book .stepper`) so the sheet can only style its own
// page even though the App Router keeps all route CSS injected across client
// navigation. Declarations are never touched — this is a pure specificity/scope
// transform, so each page (which always carries its wrapper class) renders
// identically; it just can no longer leak onto other routes.
//
// Left GLOBAL (not prefixed):
//   - @keyframes / @font-face / @import / @charset (and steps inside @keyframes)
//   - :root (custom-property definitions)
//   - selectors anchored above the page wrapper: anything starting with
//     html / body / :root  (e.g. the `html.hero-preanim ...` FOUC guard)
//   - bare element/pseudo resets used globally: *  a  img  video  svg
//     ::selection  ::before  ::after  :focus-visible
//
// Usage: node scripts/scope-css.mjs <file> <scopeClass> [wrapperLineHeight]
import fs from 'fs';
import postcss from 'postcss';

const [file, scope, lineHeight] = process.argv.slice(2);
if (!file || !scope) { console.error('usage: scope-css.mjs <file> <.scope> [line-height]'); process.exit(1); }

const css = fs.readFileSync(file, 'utf8');
const root = postcss.parse(css);

const BARE_GLOBAL = new Set(['*', 'a', 'img', 'video', 'svg', '::selection', '::before', '::after', ':focus-visible']);
const isGlobalPart = (part) => {
  const t = part.trim();
  if (!t) return true;
  if (/^(html|body|:root)\b/.test(t)) return true; // anchored on/above <html>/<body>
  return BARE_GLOBAL.has(t); // bare reset, exact match only
};

const declsBefore = [];
root.walkDecls((d) => declsBefore.push(d.prop + ':' + d.value));

let prefixed = 0, keptGlobal = 0;
root.walkRules((rule) => {
  const p = rule.parent;
  if (p && p.type === 'atrule' && /keyframes/i.test(p.name)) return; // keyframe steps: leave
  const parts = rule.selector.split(',');
  if (parts.every(isGlobalPart)) { keptGlobal++; return; }
  rule.selector = parts
    .map((part) => (isGlobalPart(part) ? part.trim() : `${scope} ${part.trim()}`))
    .join(', ');
  prefixed++;
});

if (lineHeight) root.prepend(postcss.parse(`${scope}{line-height:${lineHeight}}\n`));

// integrity: declarations must be unchanged (pure scope transform)
const declsAfter = [];
postcss.parse(root.toString()).walkDecls((d) => declsAfter.push(d.prop + ':' + d.value));
const addedLH = lineHeight ? 1 : 0;
if (declsAfter.length !== declsBefore.length + addedLH) {
  throw new Error(`declaration count changed: ${declsBefore.length}(+${addedLH}) -> ${declsAfter.length}`);
}

fs.writeFileSync(file, root.toString());
console.log(`${file}: scope=${scope} prefixed=${prefixed} keptGlobal=${keptGlobal} decls=${declsBefore.length}(+${addedLH})`);
