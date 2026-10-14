#!/usr/bin/env node
/* Smoke-test every external URL in the static demo.
 *
 *   node scripts/check-links.mjs
 *
 * The demo's .js files are classic browser scripts with no exports — data.js
 * declares `const UI = ...` at the top level and would throw if imported as a
 * module. So they are read as TEXT and the URLs are lifted out with a regex.
 * That also catches the links that are not in the scene data, such as the
 * gov.cn one hardcoded in app.js.
 *
 * A BAD line means the URL did not answer. That is not always a dead link:
 * some hosts block datacentres, rate-limit, or geo-fence, and Chinese
 * government sites in particular are slow and picky. Re-check from a normal
 * browser before deleting anything — but do check, because a demo that opens
 * a 404 in front of the class is worse than a link that was never added.
 *
 * Run it before every release. Trip.com and Amap change their deep paths
 * without notice, and those are the links most likely to rot.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "demo");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/* Brackets are excluded outright rather than trimmed afterwards: every URL in
   this project ends in a letter, a slash or a path segment, and allowing them
   would swallow the ")" of an enclosing function call. */
const URL_RE = /https?:\/\/[^\s"'`<>()[\]{}]+/g;

/* Not links: XML namespaces, and the localhost address that appears in prose
   in app.js and sw.js when they explain what the service worker does. */
const IGNORE = [/^https:\/\/www\.w3\.org\//, /^https?:\/\/(localhost|127\.0\.0\.1)/i];

async function collect() {
  const files = (await readdir(demoDir)).filter((f) => f.endsWith(".js")).sort();
  const found = new Map(); // url -> Set<file>
  for (const file of files) {
    const text = await readFile(path.join(demoDir, file), "utf8");
    for (const m of text.matchAll(URL_RE)) {
      const url = m[0].replace(/[.,;:]+$/, "");
      if (IGNORE.some((re) => re.test(url))) continue;
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(file);
    }
  }
  return found;
}

async function probe(url) {
  const base = {
    redirect: "follow",
    headers: { "user-agent": UA, accept: "text/html,*/*" }
  };

  // HEAD first, then a one-byte ranged GET. Plenty of hosts answer 403/405/501
  // to HEAD while serving the page perfectly well to a browser, and reporting
  // those as dead would train us to ignore this script.
  try {
    const head = await fetch(url, { ...base, method: "HEAD", signal: AbortSignal.timeout(20000) });
    if (![403, 405, 501].includes(head.status)) {
      return { status: head.status, ok: head.ok, final: head.url };
    }
  } catch {
    /* fall through to GET */
  }

  try {
    const res = await fetch(url, { ...base, signal: AbortSignal.timeout(20000), headers: { ...base.headers, range: "bytes=0-0" } });
    await res.body?.cancel();
    return { status: res.status, ok: res.ok, final: res.url };
  } catch (err) {
    return { status: 0, ok: false, error: `${err.name}: ${err.message}` };
  }
}

const found = await collect();
const urls = [...found.keys()].sort();
console.log(`Checking ${urls.length} external URLs found in demo/*.js\n`);

const dead = [];
for (const url of urls) {
  const r = await probe(url); // sequential on purpose — .cn hosts rate-limit
  if (!r.ok) dead.push(url);
  const where = [...found.get(url)].join(",");
  const detail = r.error ? `  ${r.error}` : r.final && r.final !== url ? `  -> ${r.final}` : "";
  console.log(`${r.ok ? "ok  " : "DEAD"} ${String(r.status).padStart(3)}  ${url}${detail}\n         in ${where}`);
}

console.log(`\n${urls.length - dead.length}/${urls.length} reachable`);
if (dead.length) {
  console.log("\nNot reachable from this network:");
  for (const url of dead) console.log(`  - ${url}`);
  console.log("\nOpen these in a browser before removing them — a block or a geo-fence\nlooks the same as a 404 from here.");
}
process.exitCode = dead.length ? 1 : 0;
