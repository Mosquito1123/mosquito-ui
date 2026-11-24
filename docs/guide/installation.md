# 安装

## 包引用

仓库是 pnpm workspace，库包名是 `@mosquito/ui`：

```bash
pnpm add @mosquito/ui
```

包尚未发布到 npm 时，可用 workspace 协议，或在业务 `package.json` 里指向本仓库的 `packages/ui`：

```json
{
  "dependencies": {
    "@mosquito/ui": "file:../../packages/ui"
  }
}
```

包的入口是 `src/index.ts`（`main` / `module` / `types` 都指向它），样式入口是 `@mosquito/ui/styles/index.scss`。

## 引入主题样式

在 `App.vue` 里引入**一次**：

```scss
@import '@mosquito/ui/styles/index.scss';
```

`uni.scss` 会被 uni-app 注入到每个 scss 文件，主题不要写进那里。组件样式跟在各自的 SFC 里，随 easycom 按需进入页面，不要把整库 CSS 打进全局。

## easycom 映射

组件目录名和标签一致，但组件文件名是帕斯卡形式，所以 `pages.json` 要用自定义映射。映射要指向 `.vue`，不要指向同目录的 `.uvue` 占位：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^mq-button$": "@mosquito/ui/components/mq-button/MqButton.vue",
      "^mq-cell$": "@mosquito/ui/components/mq-cell/MqCell.vue",
      "^mq-cell-group$": "@mosquito/ui/components/mq-cell-group/MqCellGroup.vue",
      "^mq-popup$": "@mosquito/ui/components/mq-popup/MqPopup.vue",
      "^mq-toast$": "@mosquito/ui/components/mq-toast/MqToast.vue",
      "^mq-notify$": "@mosquito/ui/components/mq-notify/MqNotify.vue",
      "^mq-safe-bottom$": "@mosquito/ui/components/mq-safe-bottom/MqSafeBottom.vue"
    }
  }
}
```

若工具链不解析包的 `exports`，把路径改成：

```text
node_modules/@mosquito/ui/src/components/mq-button/MqButton.vue
```

其余组件把 `MqButton.vue` 换成对应文件名即可。完整清单见仓库根 README 的 `easycom.custom` 全文。

## 手动导入

```vue
<script setup lang="ts">
import { MqButton, showToast } from '@mosquito/ui'
</script>
```

页面多时优先 easycom，避免一个 barrel 把全部组件都拽进依赖图。

## H5 安全区

H5 端要让 `env(safe-area-inset-bottom)` 生效，视口需要带 `viewport-fit=cover`。示例 `examples/uni-app-demo/index.html` 已处理。

## uni-app x

**现在不要用这套源码打 uni-app x 包。** 每个组件旁的 `.uvue` 只是占位，不是实现；uni-app x 在同目录同时存在 `.vue` 和 `.uvue` 时会优先编译 `.uvue`。补完 x 端实现或移走占位之前，保持 easycom 指向 `.vue`，只在 uni-app（Vue 3）里使用。路线见仓库的 `docs/UNIAPPX.md`。
