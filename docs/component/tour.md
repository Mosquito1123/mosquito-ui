# MqTour 新手引导

按步骤高亮页面元素并展示说明气泡，支持上一步 / 下一步 / 跳过 / 完成。目标元素通过 CSS 选择器测量，非 uni 环境（如 jsdom）会自动退化为居中气泡。

## 何时使用

- 首次进入产品时需要引导用户认识几个关键入口。
- 需要按固定顺序展示提示，并允许跳过或回看上一步。

## 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
const current = ref(0)
const steps = [
  { target: '.js-search', title: '搜索', content: '在这里查找内容', placement: 'bottom' },
  { target: '.js-profile', title: '个人中心', content: '查看你的资料', placement: 'top' },
]
</script>

<template>
  <view class="js-search">搜索</view>
  <view class="js-profile">我的</view>
  <mq-tour
    v-model:visible="visible"
    v-model:current="current"
    :steps="steps"
    @finish="visible = false"
    @skip="visible = false"
  />
</template>
```

高亮框通过 `uni.createSelectorQuery()` 测量；只需给目标元素加上对应的 class 或 id，并把选择器写进 `target`。

## API

### Props

| 参数              | 类型           | 默认值     | 说明                                                       |
| ----------------- | -------------- | ---------- | ---------------------------------------------------------- |
| `steps`           | `MqTourStep[]` | `[]`       | 步骤数组，每项含 `target`、`title`、`content`、`placement` |
| `v-model:visible` | `boolean`      | `false`    | 显隐                                                       |
| `show`            | `boolean`      | `false`    | `visible` 的别名，二者任一为 `true` 即显示                 |
| `v-model:current` | `number`       | `0`        | 当前步骤下标，越界会被夹到合法范围                         |
| `next-text`       | `string`       | `'下一步'` | 下一步按钮文案                                             |
| `prev-text`       | `string`       | `'上一步'` | 上一步按钮文案                                             |
| `done-text`       | `string`       | `'完成'`   | 最后一步按钮文案                                           |
| `overlay`         | `boolean`      | `true`     | 是否绘制半透明遮罩                                         |
| `mask-closable`   | `boolean`      | `false`    | 点击遮罩是否关闭                                           |

`placement` 取 `'top' \| 'bottom' \| 'left' \| 'right'`，决定气泡相对高亮框的位置。

### Events

| 事件             | 参数              | 说明                                                     |
| ---------------- | ----------------- | -------------------------------------------------------- |
| `update:visible` | `boolean`         | 关闭时发出                                               |
| `update:show`    | `boolean`         | 使用 `show` 时同步关闭                                   |
| `update:current` | `number`          | 步骤切换时发出                                           |
| `change`         | `{ index, step }` | 步骤变化，携带新下标与步骤对象                           |
| `finish`         | -                 | 点击最后一步的完成按钮，或调用 `next()` 到最后一步时发出 |
| `skip`           | -                 | 点击跳过                                                 |
| `close`          | -                 | 完成、跳过或点击遮罩关闭时发出                           |

### Methods

| 方法       | 说明                                    |
| ---------- | --------------------------------------- |
| `next()`   | 下一步；已是最后一步时等价于 `finish()` |
| `prev()`   | 上一步；第一步时无操作                  |
| `finish()` | 发出 `finish` 并关闭引导                |

### Slots

无插槽。

## 主题变量

| 变量                      | 默认值                  | 用途                   |
| ------------------------- | ----------------------- | ---------------------- |
| `--mq-z-popup`            | `1000`                  | 层级（在此基础上 +10） |
| `--mq-mask`               | `rgba(22, 18, 12, 0.6)` | 遮罩与高亮框外围暗色   |
| `--mq-bg`                 | `#fffcf7`               | 气泡背景               |
| `--mq-text`               | `#1c1915`               | 标题文字               |
| `--mq-text-secondary`     | `#6f675e`               | 正文、跳过、进度       |
| `--mq-color-primary`      | `#0f3d32`               | 高亮框边框与下一步按钮 |
| `--mq-color-primary-text` | `#f7f4ee`               | 下一步按钮文字         |
| `--mq-radius`             | `8px`                   | 圆角                   |
| `--mq-font-size`          | `14px`                  | 正文字号               |
