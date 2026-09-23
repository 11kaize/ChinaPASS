'use strict';

const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { app, BrowserWindow, shell, session } = require('electron');

const entryFile = path.resolve(__dirname, '..', 'demo', 'index.html');
const iconFile = path.resolve(__dirname, '..', 'desktop', 'icon.png');

app.setName('ChinaPASS');
if (process.platform === 'win32') app.setAppUserModelId('org.chinapass.desktop');

function isAppDocument(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'file:' && fileURLToPath(url) === entryFile;
  } catch {
    return false;
  }
}

function isExternalLink(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol === 'https:') {
      return Boolean(url.hostname) && !url.username && !url.password;
    }
    return url.protocol === 'tel:' && /^\+?[0-9]{2,15}$/.test(url.pathname);
  } catch {
    return false;
  }
}

function openExternalLink(rawUrl) {
  if (isExternalLink(rawUrl)) {
    shell.openExternal(rawUrl).catch((error) => {
      console.warn('Could not open external link:', error);
    });
  }
}

function createWindow() {
  const window = new BrowserWindow({
    title: 'ChinaPASS',
    width: 1240,
    height: 840,
    minWidth: 760,
    minHeight: 560,
    show: false,
    backgroundColor: '#f5f7f4',
    icon: iconFile,
    autoHideMenuBar: process.platform !== 'darwin',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  window.once('ready-to-show', () => window.show());

  window.webContents.on('will-navigate', (event, rawUrl) => {
    if (isAppDocument(rawUrl)) return;
    event.preventDefault();
    openExternalLink(rawUrl);
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalLink(url);
    return { action: 'deny' };
  });

  window.loadFile(entryFile).catch((error) => {
    console.error('Could not load ChinaPASS:', error);
  });
}

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (event) => event.preventDefault());
});

app.whenReady().then(() => {
  // The app runs local content. Clipboard write is needed for phrase cards.
  session.defaultSession.setPermissionRequestHandler((contents, permission, callback, details) => {
    const isLocalApp = contents && isAppDocument(contents.getURL());
    const fromLocalApp = !details.requestingUrl || isAppDocument(details.requestingUrl);
    callback(Boolean(isLocalApp && fromLocalApp && permission === 'clipboard-sanitized-write'));
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
