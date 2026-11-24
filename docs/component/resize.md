# MqResize 元素尺寸监听

监听元素尺寸变化并发出 `resize`；优先使用 `ResizeObserver`，不可用时回退到 `uni.createSelectorQuery()`。

## 何时使用

- 需要根据容器宽高动态调整图表、画布或布局。
- 需要在小程序环境中兼容无 `ResizeObserver` 的场景。

## 示例

```vue
<script setup lang="ts">
import MqResize from '@mosquito/ui/components/mq-resize/MqResize.vue'

function onResize(size: { width: number; height: number }) {
  console.log(size.width, size.height)
}
</script>

<template>
  <MqResize :throttle="200" @resize="onResize">
    <view class="chart" />
  </MqResize>
</template>
```

也可通过 ref 调用 `measure()` 立即测量一次：`resizeRef.value?.measure()`。

## API

### Props

| 名称       | 类型      | 默认值  | 说明                                                              |
| ---------- | --------- | ------- | ----------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | 禁用监听与事件；禁用时 `measure()` 仍返回尺寸但不发事件。         |
| `throttle` | `number`  | `100`   | `resize` 事件的节流间隔（毫秒）。`0` 表示不节流。                 |
| `id`       | `string`  | 未设置  | 可选 id，回退查询时用作 `#<id>` 选择器；未设置时用 `.mq-resize`。 |

### Events

| 名称     | 参数                                        | 说明                                             |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| `resize` | `(size: { width: number; height: number })` | 尺寸变化时触发，参数为宽高（px）。禁用时不触发。 |

### Methods

| 名称      | 返回值                                      | 说明                                                                                      |
| --------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `measure` | `{ width: number; height: number } \| null` | 立即测量一次；未禁用时发出 `resize`。能读到 DOM 几何信息时读 DOM，否则走 uni 选择器查询。 |

### Slots

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 被监听的内容。 |

## 主题变量

本组件不消费主题变量；根节点仅做基础盒模型约束（`min-width`/`min-height` 为 `0`）。
