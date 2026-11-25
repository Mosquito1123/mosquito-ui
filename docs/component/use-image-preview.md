# useImagePreview 图片预览

图片预览的 composable，返回与 `<mq-image-preview />` 共享同一份 reactive 状态的 `{ state, show, hide }`。

## 何时使用

- 需要在 `setup()` / 组合式函数里命令式打开或关闭全屏图片预览。
- 希望直接读取当前预览状态（例如根据 `state.index` 做联动）而不自己再建一份 ref。

## 示例

```vue
<script setup lang="ts">
import MqImagePreview from '@mosquito/ui/components/mq-image-preview/MqImagePreview.vue'
import { useImagePreview } from '@mosquito/ui/composables/use-image-preview'

const { state, show, hide } = useImagePreview()

function open() {
  const close = show({ urls: ['a.png', 'b.png'], current: 1 })
  // close 只关闭这一组，即使之后又打开了别的预览也不会误关。
}

function onSwiped() {
  console.log('当前索引', state.index)
}
</script>

<template>
  <text role="button" @click="open">预览</text>
  <text role="button" @click="hide">关闭</text>
  <MqImagePreview show-index @change="onSwiped" />
</template>
```

不传 props 的 `<mq-image-preview />` 会自动读取这份状态；受控模式（传了 `urls` / `modelValue`）则不会改动它。

## API

### 返回值

`useImagePreview(): UseImagePreviewReturn`

| 字段    | 类型                                                                                      | 说明                                                                               |
| ------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `state` | `MqImagePreviewState`                                                                     | 与 `imagePreviewState` 同一个 reactive 对象：`{ visible, urls, current, index }`。 |
| `show`  | `(input: string[] \| { urls: string[]; current?: number; index?: number }) => () => void` | 显示预览，返回只关闭本次的 closer。空白 / 空数组忽略，索引边界收敛。               |
| `hide`  | `() => void`                                                                              | 关闭当前预览。                                                                     |

### 状态字段

| 字段      | 类型       | 说明                                 |
| --------- | ---------- | ------------------------------------ |
| `visible` | `boolean`  | 是否显示。                           |
| `urls`    | `string[]` | 当前预览的图片地址。                 |
| `current` | `number`   | 本次调用的起始索引（已收敛）。       |
| `index`   | `number`   | 当前激活索引；轮播切换时由组件同步。 |

- `index` 优先于 `current`；二者非法时收敛为 0。
- `show()` 的返回值是「本次 closer」：预览已被更新时调用它不会关掉新的一组。

### Methods / Slots

无。

## 主题变量

本 composable 不渲染节点、不消费 CSS 变量，样式见 `MqImagePreview` 文档的主题变量章节。
