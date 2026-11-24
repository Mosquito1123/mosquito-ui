# Changelog

本文件记录 `@mosquito/ui` 的用户可见变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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
