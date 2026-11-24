// Seventeen Syllables of Debugging — a 5-7-5 haiku about debugging.
// Prints the haiku and validates its form: exactly 3 lines, 5-7-5 syllables,
// at most 200 characters. Node 22, stdlib only, no network.
import { readFileSync } from "node:fs";

const EXPECTED = [5, 7, 5];

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const groups = w.match(/[aeiouy]+/g) ?? [];
  let n = groups.length;
  // Trailing silent "e" (where, one) and silent "e" before a final "s"
  // (hides = hide + s) do not add a syllable.
  if (w.endsWith("e")) {
    n -= 1;
  } else if (w.endsWith("es") && !/[sxz]$/.test(w.slice(0, -2))) {
    n -= 1;
  }
  return Math.max(n, 1);
}

function main(): void {
  const text = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8").replace(/\r/g, "");
  const lines = text.replace(/\n$/, "").split("\n");
  if (lines.length !== EXPECTED.length) {
    console.error(`FAIL: expected 3 lines, got ${lines.length}`);
    process.exit(1);
  }
  if (text.length > 200) {
    console.error(`FAIL: ${text.length} characters, over the 200 limit`);
    process.exit(1);
  }
  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].trim().split(/\s+/).filter(Boolean);
    const got = words.reduce((sum, w) => sum + countSyllables(w), 0);
    if (got !== EXPECTED[i]) {
      console.error(`FAIL: line ${i + 1} has ${got} syllables, expected ${EXPECTED[i]}`);
      process.exit(1);
    }
    console.log(`line ${i + 1}: ${got}/${EXPECTED[i]} syllables — ${lines[i]}`);
  }
  console.log(text);
  console.log(`OK: 17 syllables in 5-7-5, ${text.length}/200 characters.`);
}

main();
