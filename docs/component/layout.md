# MqLayout Flex 布局容器

单个 `view` 节点的 flex 布局容器，用 props 表达常用的方向、换行、对齐与间距。

## 何时使用

- 需要快速做水平/垂直排列、两端对齐、自动间距的布局。
- 希望避免为每个布局手写重复的 flex 样式。

## 示例

```vue
<script setup lang="ts">
import MqLayout from '@mosquito/ui/components/mq-layout/MqLayout.vue'
</script>

<template>
  <MqLayout direction="row" justify="space-between" align="center" :gutter="12">
    <text>左</text>
    <text>右</text>
  </MqLayout>

  <MqLayout direction="column" :gutter="8" full>
    <text>占满高度</text>
  </MqLayout>
</template>
```

## API

### Props

| 名称        | 类型                                                                                            | 默认值     | 说明                                         |
| ----------- | ----------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------- |
| `direction` | `'row' \| 'column'`                                                                             | `'row'`    | 主轴方向。                                   |
| `wrap`      | `'nowrap' \| 'wrap' \| 'wrap-reverse'`                                                          | `'nowrap'` | 换行方式。                                   |
| `justify`   | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | 未设置     | 主轴对齐。                                   |
| `align`     | `'flex-start' \| 'center' \| 'flex-end' \| 'stretch' \| 'baseline'`                             | 未设置     | 交叉轴对齐。                                 |
| `gutter`    | `number`                                                                                        | `0`        | 子元素间距，转成 `gap`（px）。`0` 时不设置。 |
| `full`      | `boolean`                                                                                       | `false`    | 高度设为 `100%`。                            |

### Events

无。

### Methods

无。

### Slots

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 布局子元素。 |

## 主题变量

本组件不消费额外主题变量，只使用 flex 相关 CSS 属性。间距与高度由 props 通过内联样式控制。
