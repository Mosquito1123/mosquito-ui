# MqQrCode 二维码

基于 canvas 绘制的二维码组件，纯算法生成布尔矩阵（MIT，davidshimjs / Kazuhiko Arase），不引入外部二维码依赖。

## 何时使用

- 展示链接、支付地址、票据凭证、设备绑定等二维码。
- 需要在内容变化时自动重绘，或在 H5 下导出 PNG data URL。
- 无 canvas 环境（如 jsdom）或内容非法时，自动降级为文字占位且不抛错。

## 示例

```vue
<template>
  <mq-qr-code text="https://example.com" :size="200" level="M" />

  <!-- 自定义颜色与外边距 -->
  <mq-qr-code
    text="MQ-2024-001"
    :size="180"
    :margin="8"
    color-dark="#0f3d32"
    color-light="#fffcf7"
    canvas-id="ticket-qr"
    @click="onClick"
    @error="onError"
  />

  <!-- H5 导出图片 -->
  <mq-qr-code ref="qrRef" text="HELLO" />
  <button @click="save">导出</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MqQrCodeExpose } from '@mosquito/ui'

const qrRef = ref<MqQrCodeExpose>()
function save() {
  const url = qrRef.value?.toDataURL()
  if (url) console.log(url)
}
function onClick(event: Event) {
  console.log(event)
}
function onError(error: Error) {
  console.warn(error.message)
}
</script>
```

## API

### Props

| 参数（属性写法） | 说明                                                            | 类型                       | 默认值      |
| ---------------- | --------------------------------------------------------------- | -------------------------- | ----------- |
| `text`           | 二维码内容；为空时发出 `error` 并显示文字占位                   | `string`                   | `''`        |
| `size`           | 二维码边长；数字按 px，字符串原样使用                           | `number \| string`         | `200`       |
| `level`          | 纠错级别，优先级高于 `correct-level`                            | `'L' \| 'M' \| 'Q' \| 'H'` | `'H'`       |
| `color-dark`     | 深色模块颜色                                                    | `string`                   | `'#000000'` |
| `color-light`    | 浅色模块颜色                                                    | `string`                   | `'#ffffff'` |
| `margin`         | 模块四周留白，单位 px                                           | `number`                   | `0`         |
| `canvas-id`      | canvas 的 id，不传时自动生成                                    | `string`                   | 自动生成    |
| `correct-level`  | 兼容别名；`level` 未提供时生效，等价于 wot-ui 的 `correctLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | -           |

### Events

| 事件    | 说明                                 | 回调参数       |
| ------- | ------------------------------------ | -------------- |
| `click` | 点击组件                             | `event: Event` |
| `error` | 内容为空、超长或无可用 canvas 时触发 | `error: Error` |

### Slots

无。

### Methods

| 方法          | 说明                                                     | 返回值                |
| ------------- | -------------------------------------------------------- | --------------------- |
| `draw()`      | 立即重绘（修改属性后组件会自动重绘）                     | `void`                |
| `toDataURL()` | H5 下导出 PNG data URL；无真实 canvas 时返回 `undefined` | `string \| undefined` |

## 主题变量

| 变量                  | 用途         | 回退值    |
| --------------------- | ------------ | --------- |
| `--mq-bg`             | 容器背景     | `#fffcf7` |
| `--mq-radius`         | 容器圆角     | `8px`     |
| `--mq-text-secondary` | 占位文字颜色 | `#6f675e` |
| `--mq-font-size`      | 占位文字字号 | `14px`    |
