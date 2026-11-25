# useVideoPreview 视频预览

视频预览的 composable，返回与 `<mq-video-preview />` 共享同一份 reactive 状态的 `{ state, show, hide }`。

## 何时使用

- 需要在 `setup()` / 组合式函数里命令式打开或关闭全屏视频预览。
- 希望根据 `state.src` / `state.title` 做联动，而不自己再维护一份 ref。

## 示例

```vue
<script setup lang="ts">
import MqVideoPreview from '@mosquito/ui/components/mq-video-preview/MqVideoPreview.vue'
import { useVideoPreview } from '@mosquito/ui/composables/use-video-preview'

const { state, show, hide } = useVideoPreview()

function open() {
  const close = show({ src: 'a.mp4', title: '演示', poster: 'cover.png' })
  // close 只关闭这一次。
}
</script>

<template>
  <text role="button" @click="open">播放</text>
  <text role="button" @click="hide">关闭</text>
  <text v-if="state.visible">正在预览：{{ state.title }}</text>
  <MqVideoPreview autoplay />
</template>
```

不传 props 的 `<mq-video-preview />` 会自动读取这份状态；受控模式（传了 `src` / `modelValue`）则不会改动它。

## API

### 返回值

`useVideoPreview(): UseVideoPreviewReturn`

| 字段    | 类型                                                                                | 说明                                                                             |
| ------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `state` | `MqVideoPreviewState`                                                               | 与 `videoPreviewState` 同一个 reactive 对象：`{ visible, src, title, poster }`。 |
| `show`  | `(input: string \| { src: string; title?: string; poster?: string }) => () => void` | 显示预览，返回只关闭本次的 closer。空白地址忽略。                                |
| `hide`  | `() => void`                                                                        | 关闭当前预览。                                                                   |

### 状态字段

| 字段      | 类型      | 说明                        |
| --------- | --------- | --------------------------- |
| `visible` | `boolean` | 是否显示。                  |
| `src`     | `string`  | 当前视频地址（去空白）。    |
| `title`   | `string`  | 标题，未提供时为 `''`。     |
| `poster`  | `string`  | 封面地址，未提供时为 `''`。 |

`show()` 的返回值是「本次 closer」：预览已被更新时调用它不会关掉新的一个。

### Methods / Slots

无。

## 主题变量

本 composable 不渲染节点、不消费 CSS 变量，样式见 `MqVideoPreview` 文档的主题变量章节。
