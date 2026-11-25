# Changelog

本文件记录 `@mosquito/ui` 的用户可见变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [Unreleased]

### Added

- CD：`deploy-docs.yml` 在推送到 `main` 后构建 VitePress 站点并部署到 GitHub Pages；文档 base 路径可通过 `VITE_DOCS_BASE` 覆盖，本地与 CI 仍用根路径。
- CD：`release.yml` 在推送 `v*` 标签时校验标签与包版本一致，通过后发布 `@mosquito/ui` 到 npm（需配置 `NPM_TOKEN` secret）。

## [0.12.0] - 2026-11-25

### Added

- 国际化：`localeState`、`t`、`setLocale`、`addMessages`、`zhCN` / `enUS` 内置语言包（77 条文案）与 `useLocale()`；`MqConfigProvider` 支持 `locale` prop。组件内置展示文案已改为可翻译。
- 主题令牌流水线：`theme-tokens.json` 唯一数据源、`pnpm build:theme-vars` 生成 SCSS map 与 TS 类型、暗色模式支持 `[data-mq-theme='dark']`。
- 条形码补齐 EAN13 / EAN8 / UPC-A / CODE39 编码与校验位 API。
- Playwright E2E 冒烟测试（文档站 9 个场景）。
- `pnpm docs:gen`：按 `types.ts` 与 README 组件表生成缺失的逐组件文档（97 篇）。

### Changed

- 逐组件文档补齐至 119 篇，文档站侧边栏链接全部可解析。
- CI 增加文档构建与 E2E 步骤。

## [0.11.0] - 2026-11-24

### Added

- 新增组件：`mq-icon`、`mq-layout`、`mq-resize`、`mq-root-portal`、`mq-rich-text`、`mq-keyboard`、`mq-select-picker`、`mq-tour`、`mq-swiper`、`mq-image-preview`、`mq-video-preview`、`mq-img-cropper`、`mq-bar-code`、`mq-qr-code`。
- 新增组合式函数：`useToast`、`useNotify`、`useDialog`、`useCountDown`、`useUpload`、`useConfigProvider`、`useImagePreview`、`useVideoPreview`。
- 新增 VitePress 文档站骨架与逐组件文档。
- 扩展 `examples/uni-app-demo`，按分类展示全部组件与组合式函数。
- 新增 Vitest + @vue/test-utils 组件测试、`tests/setup.ts` 的 `uni` 兼容层与覆盖率配置。

### Changed

- 工具函数测试迁移到 Vitest；CI 增加 lint、格式检查与覆盖率步骤。
- 新增 ESLint、Prettier、commitlint、husky 与 lint-staged 配置。
- `pnpm test` 统一由 Vitest 驱动。

## [0.10.0]

- 原有 85 个组件、工具函数测试与 CI 基础配置。
