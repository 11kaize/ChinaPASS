#!/usr/bin/env node
import { spawnSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { homedir } from 'node:os';
import { dirname, resolve, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mobile = resolve(root, 'mobile');
const bundled = resolve(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node');
const runtime = process.platform !== 'win32' && existsSync(bundled) ? bundled : process.execPath;
const version = spawnSync(runtime, ['-p', 'process.versions.node'], { encoding: 'utf8' });
const [major, minor] = (version.stdout || '').trim().split('.').map(Number);
if (version.status !== 0 || !(major > 22 || (major === 22 && minor >= 13))) {
  console.error('ChinaHand requires Node.js 22.13 or newer. Install the current Node.js LTS, then restart this launcher.');
  process.exit(1);
}
const env = { ...process.env, PATH: `${dirname(runtime)}${delimiter}${process.env.PATH || ''}` };
const npmCLI = resolve(dirname(runtime), process.platform === 'win32' ? 'node_modules/npm/bin/npm-cli.js' : '../lib/node_modules/npm/bin/npm-cli.js');
function npm(args) {
  // Invoke the JS CLI directly on Windows: no Bash, PowerShell policy or cmd quoting required.
  return existsSync(npmCLI)
    ? spawnSync(runtime, [npmCLI, ...args], { cwd: mobile, env, stdio: 'inherit' })
    : spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, { cwd: mobile, env, stdio: 'inherit', shell: process.platform === 'win32' });
}
const lock = JSON.parse(readFileSync(resolve(mobile, 'package-lock.json'), 'utf8'));
const fingerprint = createHash('sha256').update(readFileSync(resolve(mobile, 'package-lock.json'))).digest('hex');
const stamp = resolve(mobile, 'node_modules/.chinahand-lock.sha256');
const dependencies = JSON.parse(readFileSync(resolve(mobile, 'package.json'), 'utf8')).dependencies;
const installed = Object.keys(dependencies).every(name => {
  try { return JSON.parse(readFileSync(resolve(mobile, 'node_modules', name, 'package.json'), 'utf8')).version === lock.packages[`node_modules/${name}`]?.version; }
  catch { return false; }
});
const changed = existsSync(stamp) && readFileSync(stamp, 'utf8') !== fingerprint;
if (!installed || changed) {
  console.log('Preparing ChinaHand dependencies…');
  const result = npm(['ci']);
  if (result.status !== 0) process.exit(result.status || 1);
}
writeFileSync(stamp, fingerprint);

const args = process.argv.slice(2);
const preview = args.includes('--preview');
const flags = args.filter(x => x !== '--preview');
let port = 8081;
const portIndex = flags.indexOf('--port');
if (portIndex >= 0) { port = Number(flags[portIndex + 1]); flags.splice(portIndex, 2); }
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Port must be a number from 1 to 65535.');
  process.exit(1);
}
async function available(candidate) {
  return new Promise(resolveResult => {
    const probe = createServer();
    probe.once('error', () => resolveResult(false));
    probe.listen(candidate, '0.0.0.0', () => probe.close(() => resolveResult(true)));
  });
}
while (!(await available(port))) {
  console.log(`Port ${port} is in use; trying the next port.`);
  if (++port > 65535) process.exit(1);
}
flags.push('--port', String(port));

const cli = resolve(mobile, 'node_modules/expo/bin/cli');
const child = spawn(runtime, [cli, 'start', '--lan', '--go', ...(preview ? ['--web'] : []), ...flags], { cwd: mobile, env: preview ? { ...env, BROWSER: 'none' } : env, stdio: 'inherit' });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });

if (preview) {
  const url = `http://localhost:${port}`;
  console.log(`ChinaHand preview: ${url}`);
  void (async () => {
    const deadline = Date.now() + 60000;
    while (Date.now() < deadline && child.exitCode === null && child.signalCode === null) {
      try {
        const response = await fetch(`${url}/status`, { signal: AbortSignal.timeout(1000) });
        if ((await response.text()).includes('packager-status:running')) {
          const opener = process.platform === 'win32'
            ? spawn('cmd.exe', ['/d', '/s', '/c', `start "" "${url}"`], { env, stdio: 'ignore' })
            : spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { env, stdio: 'ignore' });
          opener.on('error', () => console.log(`Open ${url} in your browser.`));
          opener.on('exit', code => { if (code) console.log(`Open ${url} in your browser.`); });
          console.log(`Opening ChinaHand demo: ${url}`);
          return;
        }
      } catch { /* Metro is still starting. */ }
      await delay(500);
    }
    if (child.exitCode === null && child.signalCode === null) console.log(`Open ${url} when Metro is ready.`);
  })();
}
