import { spawnSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mobile = path.join(root, 'mobile');
const baseUrl = process.env.CHINAHAND_WEB_BASE_URL || '/ChinaPASS/demo/app';
if (!/^\/[A-Za-z0-9_/-]+$/.test(baseUrl)) throw new Error('Use an absolute, query-free deployment path.');
for (const args of [['scripts/prepare-artwork.mjs'], ['scripts/sync-content.mjs'], ['node_modules/expo/bin/cli', 'export', '--platform', 'web']]) {
  const result = spawnSync(process.execPath, args, { cwd: mobile, stdio: 'inherit', env: { ...process.env, CHINAHAND_WEB_BASE_URL: baseUrl, EXPO_PUBLIC_LEGACY_DEMO_URL: baseUrl.replace(/\/app$/, "/legacy.html") } });
  if (result.status !== 0) process.exit(result.status || 1);
}
const source = path.join(mobile, 'dist');
// GitHub Pages needs /route/index.html for direct navigation and refresh.
async function directoryRoutes(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const current = path.join(dir, entry.name);
    if (entry.isDirectory()) await directoryRoutes(current);
    else if (entry.name.endsWith('.html') && !['index.html', '404.html', '+not-found.html'].includes(entry.name)) {
      const dest = current.slice(0, -5);
      await mkdir(dest, { recursive: true });
      await rename(current, path.join(dest, 'index.html'));
    }
  }
}
await directoryRoutes(source);
const content = JSON.parse(await readFile(path.join(mobile, 'src/content/content.json'), 'utf8'));
for (const { id } of [...content.scenes, ...content.shortGuides]) {
  await readFile(path.join(source, 'guide', id, 'index.html'));
}
const productRoutes = ['community', 'community-search', 'create-post', 'post', 'login', 'register', 'upgrade', 'preferences', 'transport', 'account', 'orders'];
for (const route of productRoutes) await readFile(path.join(source, route, 'index.html'));
const artworkReport = JSON.parse(await readFile(path.join(mobile, 'assets/optimized/manifest.json'), 'utf8'));
const artwork = {
  count: artworkReport.length,
  sourceBytes: artworkReport.reduce((sum, item) => sum + item.sourceBytes, 0),
  encodedBytes: artworkReport.reduce((sum, item) => sum + item.encodedBytes, 0),
  webTransport: 'embedded WebP data URIs; decoded before navigation',
  nativeTransport: 'packaged local assets',
};
const destination = path.join(root, 'demo/app');
await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
await writeFile(path.join(destination, 'deployment.json'), JSON.stringify({ baseUrl, scenes: content.scenes.length, shortGuides: content.shortGuides.length, ports: content.ports.length, apiKeyStorage: 'memory-only; reload clears session', productRoutes, membership: 'local demo; no billing', community: 'local demo; media supported', appearance: 'day and night artwork', artwork }, null, 2) + '\n');
console.log(`Published static demo files: ${destination} (${baseUrl})`);
