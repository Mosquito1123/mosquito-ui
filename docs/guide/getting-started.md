# 开始使用

`@mosquito/ui`（蚊式 UI）是面向 **uni-app（Vue 3）** 的轻量组件库，组件前缀为 `mq-`。运行时优先：单根节点、CSS 变量、弹出层关闭后卸载。

## 运行环境

- Vue 3.4+（包 `peerDependencies` 声明 `^3.4.0`）。
- uni-app Vue 3 项目；HBuilderX 或 `create-uni` / `uni-preset-vue` 脚手架均可。
- 本仓库是 pnpm workspace，库包名为 `@mosquito/ui`。

```bash
pnpm install
pnpm typecheck
pnpm test
```

## 引入样式

只在应用入口 `App.vue` 引入一次主题变量。不要写进 `uni.scss`，否则每个 scss 文件都会被注入一份。

```scss
@import '@mosquito/ui/styles/index.scss';
```

## 两种用法

**按需 easycom（推荐）**：在 `pages.json` 里配置自定义映射，映射指向 `.vue`，不要指向同目录的 `.uvue` 占位文件。

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^mq-button$": "@mosquito/ui/components/mq-button/MqButton.vue",
      "^mq-cell$": "@mosquito/ui/components/mq-cell/MqCell.vue",
      "^mq-popup$": "@mosquito/ui/components/mq-popup/MqPopup.vue",
      "^mq-toast$": "@mosquito/ui/components/mq-toast/MqToast.vue"
    }
  }
}
```

**手动导入**：适合少量引用。

```vue
<script setup lang="ts">
import { MqButton, showToast } from '@mosquito/ui'
</script>

<template>
  <MqButton type="primary" @click="showToast('已保存')">保存</MqButton>
</template>
```

完整的 `easycom.custom` 映射见仓库根 README。

## 命令式反馈

`showToast` / `hideToast` 和 `showNotify` / `hideNotify` 只更新一块响应式状态。页面里放一个宿主，提示就不会走原生兜底：

```vue
<mq-button type="primary" @click="showToast('已保存')">保存</mq-button>
<mq-toast />
<mq-notify />
```

`showToast('文案')` 默认 2000ms；传 `{ message, duration: 0 }` 会一直显示，需要调用 `hideToast()` 关闭。空白文案会被忽略。

## 下一步

- [安装](/guide/installation)：包引用、easycom 与构建注意事项。
- [主题](/guide/theming)：`--mq-*` 变量与明暗模式。
- [组合式函数](/guide/composables)：命令式 API 的组合式用法。
- 左侧「组件」分组：逐组件的属性、事件和插槽。
