# AGENTS.md — AI 参与指南

## 项目概述

MyDiary 是一款基于 Electron + Vue 3 的个人日记桌面应用，支持日记、任务、账本管理。

## 技术栈

| 层       | 技术             | 版本    |
| -------- | ---------------- | ------- |
| 前端框架 | Vue 3            | `^3.5`  |
| 语言     | TypeScript       | `^6.0`  |
| 样式     | Tailwind CSS     | `^4.2`  |
| 构建工具 | Vite             | `^8.0`  |
| 桌面框架 | Electron         | `^42.0` |
| 打包工具 | electron-builder | `^26.8` |
| Lint     | oxlint           | `^1.63` |
| 格式化   | oxfmt            | `^0.48` |
| 包管理器 | npm / bun        | —       |

## 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 启动 Web 开发服务器 (localhost:5173)
npm run build        # 类型检查 + 构建 Web 版本 → dist/
npm run preview      # 预览 Web 构建产物
npm run electron:dev # Electron 开发模式
npm run electron:build   # 构建桌面应用 → release/
npm run electron:preview # 构建并启动 Electron 应用 (--no-sandbox)
npm run lint         # oxlint 检查
npm run lint:fix     # oxlint 自动修复
npm run fmt          # oxfmt 格式化
npm run fmt:check    # oxfmt 格式检查
```

## 关键配置文件

| 文件                          | 用途                                                            |
| ----------------------------- | --------------------------------------------------------------- |
| `vite.config.ts`              | Vite 构建配置，含 @tailwindcss/vite、vite-plugin-electron       |
| `tsconfig.json`               | TypeScript 配置 (moduleResolution: bundler, strict)             |
| `.oxlintrc.json`              | oxlint 规则 (typescript/import/vue 插件)                        |
| `.oxfmtrc.json`               | oxfmt 格式配置 (printWidth 100, singleQuote, trailingComma all) |
| `.github/workflows/build.yml` | CI 构建与发布流程                                               |
| `.npmrc`                      | npm 镜像源配置 (npmmirror)                                      |

## Tailwind CSS v4 注意事项

- **无 `tailwind.config.js`**：Tailwind 4 使用 CSS-first 配置
- 主题定义在 `src/style.css` 的 `@theme {}` 块中
- 使用 `@tailwindcss/vite` 插件而非 PostCSS 插件
- **已删除** `postcss.config.js`，不要重新创建
- 自定义颜色通过 CSS 变量定义（如 `--color-primary`），对应 class `bg-primary`、`text-primary` 等

## TypeScript 注意事项

- `src/vite-env.d.ts` 包含 `/// <reference types="vite/client" />`，为 `.css` 导入提供类型声明
- TypeScript 6 要求显式声明副作用导入的类型
- `vue-tsc` 作为类型检查器 (`noEmit: true`)

## 项目结构

```
src/
├── components/
│   ├── JournalEditor.vue   # 日记编辑器
│   ├── LedgerEditor.vue    # 账本编辑器
│   └── TaskEditor.vue      # 任务编辑器
├── utils/
│   ├── journalStorage.ts   # 日记 localStorage 操作
│   ├── ledgerStorage.ts    # 账本 localStorage 操作
│   └── taskStorage.ts      # 任务 localStorage 操作
├── App.vue                 # 主应用组件 (含侧边导航、路由逻辑)
├── main.ts                 # Vue 入口
├── style.css               # Tailwind CSS + @theme 定义
└── vite-env.d.ts           # Vite 类型声明
electron/
├── main.ts                 # Electron 主进程
└── preload.ts              # Electron 预加载脚本
```

## CI/CD

- **触发条件**：推送 `v*` 标签 或 手动触发 (`workflow_dispatch`)
- **流程**：Windows 构建 → Linux 构建 → Release (draft)
- **GitHub Actions 版本**：全部使用最新大版本 (checkout@v6, setup-node@v6, upload-artifact@v7, download-artifact@v8, action-gh-release@v3)
- **Node 版本**：22
- **发布**：electron-builder 构建时使用 `--publish never`，release 由 `softprops/action-gh-release` 创建 draft release
- **Electron 镜像**：CI 中通过 `ELECTRON_MIRROR` 环境变量指定 npmmirror

## 设计规范

### 色彩系统 (Material You 风格)

颜色定义在 `src/style.css` 的 `@theme` 块中，核心色值：

- `primary`: #4a654e, `primary-container`: #8ba88e
- `secondary`: #6b5c4c, `secondary-container`: #f4dfcb
- `tertiary`: #44617c, `tertiary-container`: #87a4c2
- `surface`: #fbf9f5, `background`: #fbf9f5
- `error`: #ba1a1a

### 字体

- 标题：Manrope
- 正文：Inter
- 图标：Material Symbols Icons

## 重要注意事项

1. **不要创建 `postcss.config.js`** — Tailwind 4 通过 Vite 插件处理
2. **不要创建 `tailwind.config.js`** — 配置已迁移到 CSS `@theme`
3. **`console.error/warn` 允许，`console.log` 产生 lint 警告**
4. **Electron Linux 开发需 `--no-sandbox`**（`electron:preview` 已含）
5. **存放路径有中文**（`/home/xingwangzhe/桌面/mydiary`），注意路径编码
6. **构建产物目录**：Web → `dist/`，桌面应用 → `release/`
7. **升级依赖后需同步 bun.lock**：`npm update && bun update`
8. **版本号在 `package.json` 中**，发版时打 `v*` tag 触发 CI
