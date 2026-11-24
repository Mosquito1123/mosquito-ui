# MqVideoPreview 视频预览

全屏视频预览，读取全局状态或由 props 受控，转发播放、暂停与结束事件。

## 何时使用

- 点击列表中的视频封面后需要全屏播放。
- 希望从任意位置用一行代码打开视频，而不用把状态层层透传。
- 需要在播放结束 / 暂停时做埋点或联动。

## 示例

命令式（推荐）：

```vue
<script setup lang="ts">
import MqVideoPreview from '@mosquito/ui/components/mq-video-preview/MqVideoPreview.vue'
import { useVideoPreview } from '@mosquito/ui/composables/use-video-preview'

const { show } = useVideoPreview()
</script>

<template>
  <text role="button" @click="show({ src: 'a.mp4', title: '演示', poster: 'cover.png' })">播放</text>
  <MqVideoPreview autoplay />
</template>
```

受控：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import MqVideoPreview from '@mosquito/ui/components/mq-video-preview/MqVideoPreview.vue'

const visible = ref(false)
</script>

<template>
  <text role="button" @click="visible = true">播放</text>
  <MqVideoPreview v-model="visible" src="a.mp4" title="演示" poster="cover.png" @end="onEnd" />
</template>
```

`v-model:visible` 也支持；`modelValue` 与 `visible` 同时传入时优先 `modelValue`。

## API

### Props

| 名称         | 类型      | 默认值  | 说明                              |
| ------------ | --------- | ------- | --------------------------------- |
| `src`        | `string`  | 未设置  | 视频地址。不传时读取全局状态。    |
| `title`      | `string`  | 未设置  | 顶部标题。不传时读取全局状态。    |
| `poster`     | `string`  | 未设置  | 封面图地址。不传时读取全局状态。  |
| `modelValue` | `boolean` | 未设置  | 配合 `v-model` 控制显隐。         |
| `visible`    | `boolean` | 未设置  | 配合 `v-model:visible` 控制显隐。 |
| `autoplay`   | `boolean` | `false` | 是否自动播放。                    |
| `showClose`  | `boolean` | `true`  | 是否显示关闭按钮。                |

### Events

| 名称                | 参数               | 说明                     |
| ------------------- | ------------------ | ------------------------ |
| `update:modelValue` | `(value: boolean)` | 请求关闭时发出 `false`。 |
| `update:visible`    | `(value: boolean)` | 请求关闭时发出 `false`。 |
| `close`             | —                  | 关闭按钮触发关闭时发出。 |
| `play`              | —                  | 原生 `play` 事件转发。   |
| `pause`             | —                  | 原生 `pause` 事件转发。  |
| `end`               | —                  | 原生 `ended` 事件转发。  |

### Methods

无。命令式关闭使用 `hideVideoPreview()` 或 `useVideoPreview().hide()`。

### Slots

无。

### 全局 API

从 `@mosquito/ui/utils/video-preview` 或 `useVideoPreview()` 获取。

| 名称                | 类型                                                                                | 说明                                                    |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `videoPreviewState` | `MqVideoPreviewState`                                                               | 全局 reactive 状态：`{ visible, src, title, poster }`。 |
| `showVideoPreview`  | `(input: string \| { src: string; title?: string; poster?: string }) => () => void` | 显示预览，返回只关闭本次的 closer。空白地址忽略。       |
| `hideVideoPreview`  | `() => void`                                                                        | 关闭当前预览。                                          |

## 主题变量

| 变量                      | 默认值                      | 说明                          |
| ------------------------- | --------------------------- | ----------------------------- |
| `--mq-z-preview`          | `2000`                      | 根节点层级，与图片预览共用。  |
| `--mq-preview-bg`         | `rgba(0, 0, 0, 0.92)`       | 全屏背景。                    |
| `--mq-preview-color`      | `#fff`                      | 文字与关闭按钮颜色。          |
| `--mq-preview-font-size`  | `14px`                      | 标题字号。                    |
| `--mq-preview-close-size` | `24px`                      | 关闭按钮字号。                |
| `--mq-preview-gutter`     | `16px`                      | 水平内边距 / 关闭按钮右边距。 |
| `--mq-preview-safe-top`   | `0px`                       | 顶部安全区补偿。              |
| `--mq-preview-button-bg`  | `rgba(255, 255, 255, 0.12)` | 关闭按钮背景。                |
| `--mq-video-width`        | `100%`                      | 视频宽度。                    |
| `--mq-video-max-height`   | `80vh`                      | 视频最大高度。                |
| `--mq-video-bg`           | `#000`                      | 视频背景。                    |
| `--mq-radius-round`       | `999px`                     | 关闭按钮圆角。                |
