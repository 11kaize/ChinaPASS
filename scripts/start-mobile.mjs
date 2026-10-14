#!/usr/bin/env node
import { spawnSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
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
if (!existsSync(resolve(mobile, 'node_modules/expo/package.json'))) {
  const result = npm(['ci']);
  if (result.status !== 0) process.exit(result.status || 1);
}
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const flags = args.filter(x => x !== '--preview');
const cli = resolve(mobile, 'node_modules/expo/bin/cli');
const child = spawn(runtime, [cli, 'start', '--lan', '--go', ...(preview ? ['--web'] : []), ...flags], { cwd: mobile, env, stdio: 'inherit' });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
