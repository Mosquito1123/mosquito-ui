# 主题

主题令牌全部是 CSS 变量，定义在 `packages/ui/src/styles/variables.scss`。组件不再读取 JS 主题对象；换肤只改自定义属性。

## 令牌

默认（亮色）值：

| 变量                      | 默认值                   | 用途           |
| ------------------------- | ------------------------ | -------------- |
| `--mq-color-primary`      | `#0f3d32`                | 主色           |
| `--mq-color-primary-text` | `#f7f4ee`                | 主色上的文字   |
| `--mq-color-success`      | `#2f7d4a`                | 成功           |
| `--mq-color-success-text` | `#f4fbf6`                | 成功色上的文字 |
| `--mq-color-warning`      | `#b86e00`                | 警告           |
| `--mq-color-warning-text` | `#fff8ee`                | 警告色上的文字 |
| `--mq-color-danger`       | `#b42318`                | 危险           |
| `--mq-color-danger-text`  | `#fff6f5`                | 危险色上的文字 |
| `--mq-text`               | `#1c1915`                | 正文           |
| `--mq-text-secondary`     | `#6f675e`                | 次要文字       |
| `--mq-bg`                 | `#fffcf7`                | 背景           |
| `--mq-bg-muted`           | `#f6f1e8`                | 弱化背景       |
| `--mq-bg-active`          | `#ebe4d8`                | 按压态背景     |
| `--mq-border`             | `#e6e2da`                | 边框           |
| `--mq-mask`               | `rgba(22, 18, 12, 0.45)` | 遮罩           |
| `--mq-radius`             | `8px`                    | 圆角           |
| `--mq-font-size`          | `14px`                   | 字号           |
| `--mq-duration`           | `200ms`                  | 过渡时长       |
| `--mq-z-popup`            | `1000`                   | 弹出层层级     |
| `--mq-z-toast`            | `1100`                   | 提示层级       |
| `--mq-safe-bg`            | `transparent`            | 安全区底色     |

组件里使用变量时都带回退值，例如 `var(--mq-color-primary, #0f3d32)`。

## 明暗两套

变量写在 `page`、`:root` 和 `.mq-theme-light` 上。系统偏好深色时，`@media (prefers-color-scheme: dark)` 会切换到暗色值；也可以给祖先节点加 `mq-theme-dark`：

```html
<view class="mq-theme-dark">
  <!-- 这片区域的 --mq-* 走暗色 -->
</view>
```

暗色值（部分）：`--mq-color-primary: #8fd0b4`、`--mq-text: #f6f3ee`、`--mq-bg: #161411`、`--mq-bg-muted: #241f1a`、`--mq-border: #3a332c`、`--mq-mask: rgba(0, 0, 0, 0.55)`。完整列表见 `styles/variables.scss`。

## 局部覆盖

用 `mq-config-provider` 把变量限制在子树里。`theme` 支持 `light` / `dark`；`themeVars` 的键可以省略 `--` 前缀。

```vue
<script setup lang="ts">
import { MqConfigProvider, MqButton } from '@mosquito/ui'
</script>

<template>
  <mq-config-provider theme="light" :theme-vars="{ 'color-primary': '#8a5a2b', radius: '12px' }">
    <mq-button type="primary">局部主色</mq-button>
  </mq-config-provider>
</template>
```

## 安全区

`mq-safe-bottom` 用 `constant(safe-area-inset-bottom)` / `env(safe-area-inset-bottom)` 垫高。`bg` 默认 `transparent`，同时写进行内背景和 `--mq-safe-bg`，留白和插槽内容共用同一块底色。需要贴底栏时，把栏放进它的默认插槽：

```vue
<mq-safe-bottom bg="#fffcf7">
  <mq-button block>收起</mq-button>
</mq-safe-bottom>
```

H5 要生效，视口需要 `viewport-fit=cover`，示例工程已带上。

## 约定

- 颜色、圆角、字号、时长、层级统一走 `--mq-*`，组件不为换肤做 JS 计算。
- 只在 `App.vue` 引入一次 `@mosquito/ui/styles/index.scss`；不要写进 `uni.scss`。
- 样式动画只用 `transform` 和 `opacity`，弹出层关闭后等过渡结束再卸载。
