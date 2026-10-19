# 截屏 / 截长图

实现在 [`packages/uts-screenshot`](../packages/uts-screenshot)，不在 `@mosquito/ui` 里。

## 为什么单独成 UTS 库

- 整窗截图依赖 Android `PixelCopy` / iOS 窗口快照，必须进原生
- UI 组件库保持可在无原生工具链下做 typecheck / 单测
- uni-app 与 uni-app x 共用同一套 `uni_modules` 插件目录

## 接入

1. 复制 `packages/uts-screenshot` → 业务工程 `uni_modules/mosquito-screenshot`
2. App 端使用自定义基座或云打包编译 UTS
3. 调用 `captureScreen` / `stitchImages`，或使用 `<mq-screenshot />`

细节、错误码和平台表见插件 [README](../packages/uts-screenshot/README.md)。
