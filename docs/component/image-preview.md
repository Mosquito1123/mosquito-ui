# MqImagePreview 图片预览

全屏图片预览，支持轮播、序号、圆点指示、双击放大与长按保存事件。可在页面里放一个宿主组件后用命令式 API 打开，也可用 props 受控。

## 何时使用

- 点击缩略图后需要全屏查看一组图片。
- 希望在任意脚本里一行代码唤起预览，而不想每层都维护 `show` 变量。
- 需要拿到长按事件自行调用保存到相册。

## 示例

命令式（推荐）：页面里放一个不带 props 的宿主，用 `useImagePreview()` 打开。

```vue
<script setup lang="ts">
import MqImagePreview from '@mosquito/ui/components/mq-image-preview/MqImagePreview.vue'
import { useImagePreview } from '@mosquito/ui/composables/use-image-preview'

const { show } = useImagePreview()
</script>

<template>
  <image src="a.png" @click="show(['a.png', 'b.png'])" />
  <image src="b.png" @click="show({ urls: ['a.png', 'b.png'], current: 1 })" />
  <MqImagePreview show-index />
</template>
```

受控：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import MqImagePreview from '@mosquito/ui/components/mq-image-preview/MqImagePreview.vue'

const visible = ref(false)
const urls = ['a.png', 'b.png']
</script>

<template>
  <text role="button" @click="visible = true">查看图片</text>
  <MqImagePreview
    v-model="visible"
    :urls="urls"
    :current="0"
    show-index
    @change="({ index }) => console.log(index)"
  />
</template>
```

`v-model:visible` 也支持；`modelValue` 与 `visible` 同时传入时优先 `modelValue`。

## API

### Props

| 名称           | 类型       | 默认值  | 说明                                                            |
| -------------- | ---------- | ------- | --------------------------------------------------------------- |
| `urls`         | `string[]` | 未设置  | 图片地址列表。不传时读取全局状态；空白项会被组件内轮播忽略。    |
| `current`      | `number`   | 未设置  | 起始索引，收敛到 `[0, urls.length - 1]`。不传时读全局状态索引。 |
| `modelValue`   | `boolean`  | 未设置  | 配合 `v-model` 控制显隐。                                       |
| `visible`      | `boolean`  | 未设置  | 配合 `v-model:visible` 控制显隐。                               |
| `showIndex`    | `boolean`  | `false` | 顶部显示「当前 / 总数」。                                       |
| `loop`         | `boolean`  | `true`  | 是否循环轮播。                                                  |
| `indicator`    | `boolean`  | `true`  | 是否显示底部圆点，多于一张时出现。                              |
| `maskClosable` | `boolean`  | `true`  | 点击遮罩是否关闭；关闭按钮始终可用。                            |

### Events

| 名称                | 参数                               | 说明                                 |
| ------------------- | ---------------------------------- | ------------------------------------ |
| `update:modelValue` | `(value: boolean)`                 | 请求关闭时发出 `false`。             |
| `update:visible`    | `(value: boolean)`                 | 请求关闭时发出 `false`。             |
| `change`            | `({ index: number })`              | 轮播切换且索引确实变化时发出。       |
| `close`             | —                                  | 遮罩或关闭按钮触发关闭时发出。       |
| `longpress`         | `({ index: number; url: string })` | 长按当前图片时发出，可据此保存图片。 |

### Methods

无。命令式关闭使用 `hideImagePreview()` 或 `useImagePreview().hide()`。

### Slots

无。

### 全局 API

从 `@mosquito/ui/utils/image-preview` 或 `useImagePreview()` 获取。

| 名称                | 类型                                                                                      | 说明                                                      |
| ------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `imagePreviewState` | `MqImagePreviewState`                                                                     | 全局 reactive 状态：`{ visible, urls, current, index }`。 |
| `showImagePreview`  | `(input: string[] \| { urls: string[]; current?: number; index?: number }) => () => void` | 显示预览，返回只关闭本次的 closer。空白 / 空数组忽略。    |
| `hideImagePreview`  | `() => void`                                                                              | 关闭当前预览。                                            |

`index` 优先于 `current`；两者非法时都收敛为 0。

## 主题变量

| 变量                       | 默认值                      | 说明                 |
| -------------------------- | --------------------------- | -------------------- |
| `--mq-z-preview`           | `2000`                      | 根节点层级。         |
| `--mq-preview-bg`          | `rgba(0, 0, 0, 0.92)`       | 全屏背景。           |
| `--mq-preview-color`       | `#fff`                      | 文字与关闭按钮颜色。 |
| `--mq-preview-font-size`   | `14px`                      | 序号文字字号。       |
| `--mq-preview-close-size`  | `24px`                      | 关闭按钮字号。       |
| `--mq-preview-gutter`      | `16px`                      | 关闭按钮右边距。     |
| `--mq-preview-safe-top`    | `0px`                       | 顶部安全区补偿。     |
| `--mq-preview-safe-bottom` | `0px`                       | 底部安全区补偿。     |
| `--mq-preview-button-bg`   | `rgba(255, 255, 255, 0.12)` | 关闭按钮背景。       |
| `--mq-preview-dot`         | `rgba(255, 255, 255, 0.4)`  | 未选中圆点。         |
| `--mq-preview-dot-active`  | `#fff`                      | 选中圆点。           |
| `--mq-preview-duration`    | `200ms`                     | 双击缩放过渡时长。   |
| `--mq-radius-round`        | `999px`                     | 关闭按钮圆角。       |
