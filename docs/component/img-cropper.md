# MqImgCropper 图片裁剪

单根节点图片裁剪组件，支持选图、拖动、双击缩放、旋转、按宽高比导出，并通过 ref 暴露命令式方法。

## 何时使用

- 上传头像或封面前需要用户手动裁剪。
- 需要固定比例（如 `1:1`、`16:9`）的输出图。
- 希望在 jsdom / 原生能力缺失的环境下安全降级而不是抛错。

## 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import MqImgCropper from '@mosquito/ui/components/mq-img-cropper/MqImgCropper.vue'
import type { MqImgCropperResult } from '@mosquito/ui/components/mq-img-cropper/types'

const cropper = ref<InstanceType<typeof MqImgCropper> | null>(null)

function onConfirm(result: MqImgCropperResult) {
  console.log(result.path, result.width, result.height)
}
</script>

<template>
  <MqImgCropper
    ref="cropper"
    src="a.png"
    :width="200"
    aspect-ratio="1:1"
    :quality="0.9"
    show-grid
    @ready="({ width, height }) => console.log(width, height)"
    @confirm="onConfirm"
    @cancel="onCancel"
  />

  <text role="button" @click="cropper?.chooseImage()">选图</text>
  <text role="button" @click="cropper?.rotate()">旋转</text>
  <text role="button" @click="cropper?.crop()">裁剪</text>
  <text role="button" @click="cropper?.reset()">重置</text>
</template>
```

裁剪框内的图片可单指拖动、双击在 1 倍 / 2 倍间切换缩放；底部也有对应的文字按钮。

## API

### Props

| 名称          | 类型               | 默认值  | 说明                                                                                                      |
| ------------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------------- |
| `src`         | `string`           | `''`    | 图片地址。为空时不渲染图片。                                                                              |
| `width`       | `number \| string` | 未设置  | 裁剪框 / 导出宽度（px）。数字字符串按 px 解析；未设置按 `200`。                                           |
| `height`      | `number \| string` | 未设置  | 裁剪框 / 导出高度（px）。未设置按 `200`。                                                                 |
| `aspectRatio` | `number \| string` | 未设置  | 宽高比：数字表示宽 / 高，字符串支持 `'1:1'`、`'16:9'`。只给一边时按比例推算另一边；两边都给时尊重显式值。 |
| `quality`     | `number`           | `1`     | 导出质量，收敛到 `0 - 1`。非法值按 `1`。                                                                  |
| `disabled`    | `boolean`          | `false` | 禁用态：不响应交互、不发出事件。                                                                          |
| `showGrid`    | `boolean`          | `false` | 是否显示裁剪框九宫格参考线。                                                                              |

### Events

| 名称      | 参数                                                | 说明                                      |
| --------- | --------------------------------------------------- | ----------------------------------------- |
| `ready`   | `({ width: number; height: number })`               | `uni.getImageInfo` 成功且尺寸有效时发出。 |
| `cancel`  | —                                                   | 点击「取消」时发出，禁用态不发。          |
| `confirm` | `({ path: string; width: number; height: number })` | `uni.canvasToTempFilePath` 成功时发出。   |

### Methods

通过 `ref` 调用。

| 名称          | 类型         | 说明                                                  |
| ------------- | ------------ | ----------------------------------------------------- |
| `chooseImage` | `() => void` | 调用 `uni.chooseImage` 选图并重新加载，禁用态不生效。 |
| `crop`        | `() => void` | 按当前尺寸 / 比例 / 旋转导出，成功时发出 `confirm`。  |
| `rotate`      | `() => void` | 顺时针旋转 90 度，禁用态不生效。                      |
| `reset`       | `() => void` | 重置旋转、缩放与位移。                                |

### Slots

无。

## 主题变量

| 变量                            | 默认值                                  | 说明                        |
| ------------------------------- | --------------------------------------- | --------------------------- |
| `--mq-cropper-bg`               | `var(--mq-bg, #fffcf7)`                 | 组件背景。                  |
| `--mq-cropper-color`            | `var(--mq-text, #1c1915)`               | 文字颜色。                  |
| `--mq-cropper-gutter`           | `16px`                                  | 内边距 / 按钮上边距。       |
| `--mq-cropper-disabled-opacity` | `0.5`                                   | 禁用态透明度。              |
| `--mq-cropper-stage-bg`         | `rgba(0, 0, 0, 0.06)`                   | 裁剪区域底色。              |
| `--mq-cropper-frame-border`     | `1px dashed var(--mq-primary, #0f3d32)` | 裁剪框边框。                |
| `--mq-cropper-grid`             | `rgba(255, 255, 255, 0.5)`              | 九宫格参考线颜色。          |
| `--mq-cropper-duration`         | `200ms`                                 | 图片变换过渡时长。          |
| `--mq-cropper-action-size`      | `56px`                                  | 底部按钮最小宽度。          |
| `--mq-cropper-action-padding`   | `8px 10px`                              | 底部按钮内边距。            |
| `--mq-cropper-action-gap`       | `4px`                                   | 底部按钮间距。              |
| `--mq-cropper-action-bg`        | `var(--mq-bg-muted, #f6f1e8)`           | 普通按钮背景。              |
| `--mq-cropper-action-color`     | `var(--mq-text-secondary, #6f675e)`     | 普通按钮文字。              |
| `--mq-cropper-confirm-color`    | `#fff`                                  | 确认按钮文字。              |
| `--mq-radius`                   | `8px`                                   | 按钮圆角。                  |
| `--mq-primary`                  | `#0f3d32`                               | 确认按钮背景 / 裁剪框主色。 |
