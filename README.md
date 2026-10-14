# @mosquito/ui

蚊式 UI。面向 **uni-app（Vue 3）** 的轻量组件库，运行时少节点、少计算；目录和文档按 **uni-app x** 预留，当前不把 `.uvue` 当成正式实现。

这不是 [wot-ui](https://github.com/wot-ui/wot-ui) 或 [cool-unix](https://gitee.com/cool-team-official/cool-unix) 的分支。组件前缀是 `mq-`，主题令牌和 DOM 结构都是重新设计的。

## 定位

- 先服务 uni-app 运行时：单根节点、CSS 变量、弹出层关闭后卸载。
- 组件按 easycom 分目录：`src/components/mq-*/`。
- 每个组件一份可用的 `ComponentName.vue`，旁边放 `ComponentName.uvue` 占位，方便以后补 uni-app x。
- 命令式反馈走 `showToast` / `hideToast`，不把 toast 套进另一套弹层组件。

## 安装

仓库是 pnpm workspace。库包名是 `@mosquito/ui`。

```bash
pnpm install
pnpm typecheck
```

业务项目里：

```bash
pnpm add @mosquito/ui
```

包尚未发布到 npm 时，可先用 workspace，或在业务 `package.json` 里指向本仓库的 `packages/ui`。

在 `App.vue` 引入一次主题变量（不要写进 `uni.scss`，否则每个 scss 都会再注入一份）：

```scss
@import '@mosquito/ui/styles/index.scss';
```

`pages.json` 按需 easycom（文件名是帕斯卡形式，所以用自定义映射）：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^mq-button$": "@mosquito/ui/components/mq-button/MqButton.vue",
      "^mq-cell$": "@mosquito/ui/components/mq-cell/MqCell.vue",
      "^mq-popup$": "@mosquito/ui/components/mq-popup/MqPopup.vue",
      "^mq-toast$": "@mosquito/ui/components/mq-toast/MqToast.vue",
      "^mq-loading$": "@mosquito/ui/components/mq-loading/MqLoading.vue",
      "^mq-safe-bottom$": "@mosquito/ui/components/mq-safe-bottom/MqSafeBottom.vue"
    }
  }
}
```

若工具链不解析 `exports`，把路径改成 `node_modules/@mosquito/ui/src/components/...`。也可以手动导入：

```vue
<script setup lang="ts">
import { MqButton, showToast } from '@mosquito/ui'
</script>
```

## 组件

| 组件 | 能力 |
| --- | --- |
| `mq-button` | `type` / `size` / `block` / `disabled`，发出 `click` |
| `mq-cell` | `title` / `value` / `is-link` |
| `mq-popup` | `v-model` 控制显隐，`position` 为 `bottom` 或 `center` |
| `mq-toast` | `showToast` / `hideToast`；页面放一个 `<mq-toast />` 作为宿主 |
| `mq-loading` | 单节点旋转指示，可选 `size`、`color` |
| `mq-safe-bottom` | 底部安全区留白，`bg` 可改背景，默认透明 |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@mosquito/ui'

const visible = ref(false)
</script>

<template>
  <mq-cell title="说明" value="打开" is-link @click="visible = true" />
  <mq-button type="primary" block @click="showToast('已保存')">保存</mq-button>
  <mq-popup v-model="visible" position="bottom">
    <mq-safe-bottom bg="#fffcf7">
      <mq-button block @click="visible = false">关闭</mq-button>
    </mq-safe-bottom>
  </mq-popup>
  <mq-toast />
</template>
```

没有宿主时，`showToast` 会改走 `uni.showToast`（运行环境里存在 `uni` 时）。

## 性能原则

少层级、列表虚拟化、列表里不套深组件、条件编译、easycom 按需引入。细节见 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)。

## uni-app x 路线

`.vue` 与 `.uvue` 双文件、蒸汽模式 flatten、`list-view`、UTS 只用于原生插件。见 [docs/UNIAPPX.md](docs/UNIAPPX.md)。

当前 `.uvue` 只有「uni-app x 占位」。uni-app x 在同目录同时存在两种文件时会优先编译 `.uvue`，所以在补完实现之前不要把这些占位文件带进 x 端生产包。

## 示例

[examples/uni-app-demo](examples/uni-app-demo) 是一份可拷进 HBuilderX 或 `create-uni` / `uni-preset-vue` 的薄页面，不含完整 `@dcloudio` 依赖。运行方式写在该目录的 README。

```bash
pnpm --filter @mosquito/uni-app-demo dev
```

## 目录

```
mosquito-ui/
  packages/ui/          @mosquito/ui
  examples/uni-app-demo
  docs/PERFORMANCE.md
  docs/UNIAPPX.md
```

## 致谢

交互与属性形态参考了 [wot-ui](https://github.com/wot-ui/wot-ui)（MIT）：按钮类型与尺寸、单元格、`v-model` 弹出层、命令式 toast。本仓库没有复制它的源码树，也不使用 `wot` / `wd-` 命名。

目录与性能结构参考了 [cool-unix](https://gitee.com/cool-team-official/cool-unix)（[GitHub](https://github.com/cool-team-official/cool-unix)，MIT）：`components/名称/名称` 的 easycom 习惯、`theme.json` 的明暗令牌拆分、安全区组件、`useUi().showToast` 这种命令式入口，以及 uni-app x 的 `list-view`。本仓库没有引入其 Tailwind、PassThrough 或 `cl-` 组件实现；主题做成 CSS 变量，安全区用 `env(safe-area-inset-bottom)`，toast 不再套一层 popup。

## 许可

[MIT](LICENSE)。Copyright (c) 2026 Mosquito1123 / 无住。
