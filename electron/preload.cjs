'use strict';

const { contextBridge } = require('electron');

// A marker for optional desktop-only UI. No Node or Electron APIs reach the page.
contextBridge.exposeInMainWorld('chinaPassDesktop', Object.freeze({
  isDesktop: true,
  platform: process.platform
}));
