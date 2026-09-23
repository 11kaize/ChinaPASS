# ChinaPASS 桌面版

桌面版使用 Electron 加载仓库内的 `demo/index.html`。页面和卡片内容仍是本地静态文件，收藏、清单及外观设置保存在本机。首次启动和日常使用均不需要本地服务器。

## 开发运行

需要 Node.js 22.12 或更高版本。在仓库根目录执行：

```bash
npm install
npm run desktop:dev
```

`npm install` 会生成锁文件；提交正式版本时应一并提交锁文件，使后续安装可复现。

## 打包

请优先在目标系统上运行相应命令，输出位于 `release/`：

```bash
npm run desktop:win    # Windows 安装程序 (.exe)
npm run desktop:mac    # macOS 磁盘映像和 ZIP
npm run desktop:linux  # Linux AppImage 和 .deb
```

`npm run desktop:build` 按当前系统的默认目标构建。面向公众分发时，Windows 和 macOS 安装包还需要发布者的代码签名；macOS 公证也需要相应的 Apple 开发者凭据。

## 桌面行为

- 应用窗口只加载随包发布的 `demo/index.html`。同页的 `#/` 路由正常工作。
- HTTPS 链接及数字电话号码交给系统默认应用打开。其他导航和新窗口请求会被拒绝。
- 页面不能直接访问 Node.js 或 Electron API。预加载脚本仅暴露只读的桌面环境标记。
- 应用图标在 `desktop/icon.png`，打包器会为各平台转换格式。
- 网页版入口及部署流程不依赖 Electron。桌面版更新页面内容后须重新打包。

桌面外壳采用 [Electron 安全建议](https://www.electronjs.org/docs/latest/tutorial/security) 中的隔离、沙盒和导航限制。安装包配置遵循 [electron-builder 图标约定](https://www.electron.build/docs/features/icons-and-images/)。
