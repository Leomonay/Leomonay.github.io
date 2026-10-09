// Verifies that every messages/*.json file has exactly the same shape as the default
// locale's (same keys, same array lengths, same value types). Catches the classic
// "added an experience in Spanish, forgot the English one" mistake before it ships.
// Run with `npm run check:messages`.

import { readdirSync, readFileSync } from 'node:fs';

const DIR = new URL('../messages/', import.meta.url);
const REFERENCE = 'es.json';

const load = (file) => JSON.parse(readFileSync(new URL(file, DIR), 'utf8'));
const kind = (value) => (Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value);

function compare(ref, other, path, problems) {
  if (kind(ref) !== kind(other)) {
    problems.push(`${path || '(root)'}: expected ${kind(ref)}, found ${kind(other)}`);
    return;
  }
  if (kind(ref) === 'array') {
    if (ref.length !== other.length) {
      problems.push(`${path}: expected ${ref.length} items, found ${other.length}`);
    }
    ref.forEach(
      (item, i) => i < other.length && compare(item, other[i], `${path}[${i}]`, problems),
    );
  } else if (kind(ref) === 'object') {
    for (const key of new Set([...Object.keys(ref), ...Object.keys(other)])) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in other)) problems.push(`${childPath}: missing`);
      else if (!(key in ref)) problems.push(`${childPath}: not in ${REFERENCE}`);
      else compare(ref[key], other[key], childPath, problems);
    }
  }
}

const reference = load(REFERENCE);
let failed = false;

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== REFERENCE)) {
  const problems = [];
  compare(reference, load(file), '', problems);
  if (problems.length) {
    failed = true;
    console.error(`${file} differs from ${REFERENCE}:\n  ${problems.join('\n  ')}`);
  } else {
    console.log(`${file} matches ${REFERENCE}.`);
  }
}

process.exit(failed ? 1 : 0);
