# MqBarCode 条形码

基于 canvas 绘制的一维条码组件，内置紧凑 CODE128 编码器（自动选择 A/B/C 子集），无需引入第三方打包产物。

## 何时使用

- 展示商品编码、会员卡号、物流单号、门票序列号等一维条码。
- 需要对输入做严格校验：非法字符或不支持的格式通过 `valid` / `error` 事件反馈，不抛异常。
- 无 canvas 环境（如 jsdom）时自动降级为文字占位。

## 示例

```vue
<template>
  <mq-bar-code text="HELLO" :width="240" :height="60" />

  <!-- 数字内容自动使用 CODE128C，紧凑编码 -->
  <mq-bar-code text="12345678" :width="240" line-width="2" text-position="top" @valid="onValid" />

  <!-- 手动重绘 -->
  <mq-bar-code ref="barRef" text="MQ-001" :display-value="true" color="#0f3d32" />
  <button @click="barRef?.draw()">重绘</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MqBarCodeExpose } from '@mosquito/ui'

const barRef = ref<MqBarCodeExpose>()
function onValid(valid: boolean) {
  console.log('条码内容是否合法：', valid)
}
</script>
```

## API

### Props

| 参数（属性写法） | 说明                                                                     | 类型                                                    | 默认值      |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- | ----------- |
| `text`           | 条码内容；为空或非法时发出 `error` 并显示文字占位                        | `string`                                                | `''`        |
| `format`         | 条码格式；当前仅实现 `CODE128`，其余格式会发出 `error`                   | `'CODE128' \| 'EAN13' \| 'EAN8' \| 'UPC-A' \| 'CODE39'` | `'CODE128'` |
| `width`          | 画布宽度（px）；大于 0 时模块按宽度缩放，为 0 时按 `line-width` 自动计算 | `number`                                                | `0`         |
| `height`         | 画布高度（px，含文字区）                                                 | `number`                                                | `60`        |
| `line-width`     | 单个模块的基准宽度（px），仅 `width` 为 0 时生效                         | `number`                                                | `2`         |
| `display-value`  | 是否显示文字标注                                                         | `boolean`                                               | `true`      |
| `text-position`  | 文字位置                                                                 | `'top' \| 'bottom'`                                     | `'bottom'`  |
| `color`          | 条码与文字颜色                                                           | `string`                                                | `'#000000'` |
| `background`     | 背景色                                                                   | `string`                                                | `'#ffffff'` |
| `canvas-id`      | canvas 的 id，不传时自动生成                                             | `string`                                                | 自动生成    |

### Events

| 事件    | 说明                                                   | 回调参数         |
| ------- | ------------------------------------------------------ | ---------------- |
| `valid` | 每次绘制前发出，表示内容是否可编码                     | `valid: boolean` |
| `error` | 内容为空、含非法字符、格式不支持或无可用 canvas 时触发 | `error: Error`   |

### Slots

无。

### Methods

| 方法     | 说明                                 | 返回值 |
| -------- | ------------------------------------ | ------ |
| `draw()` | 立即重绘（修改属性后组件会自动重绘） | `void` |

## 主题变量

| 变量                  | 用途         | 回退值    |
| --------------------- | ------------ | --------- |
| `--mq-bg`             | 容器背景     | `#fffcf7` |
| `--mq-radius`         | 容器圆角     | `8px`     |
| `--mq-text-secondary` | 占位文字颜色 | `#6f675e` |
| `--mq-font-size`      | 占位文字字号 | `14px`    |

## 编码器能力

- `CODE128B`：完整覆盖 ASCII 32–126。
- `CODE128A`：覆盖 ASCII 0–95（含控制字符）。
- `CODE128C`：偶数位纯数字按两位一组压缩编码。
- 自动选择规则：偶数位纯数字 → C；全为可打印 ASCII → B；其余 ASCII 0–95 → A；超出范围抛错。
- `getCode128CheckDigit(values)` 与 `isValidBarCodeText(text, format)` 可单独使用。
