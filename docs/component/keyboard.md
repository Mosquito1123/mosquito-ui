# MqKeyboard 全键盘

字母 / 数字 / 符号三页软键盘，不依赖原生 `input`，所有按键由 `view`、`text` 与 touch 事件绘制。

## 何时使用

- 需要自定义输入面板（如安全键盘、搜索框、金额输入），又不希望唤起系统软键盘。
- 需要在字母、数字、符号之间切换，并自行接管每个字符的输入结果。
- 需要随机排列键位以降低固定位置记忆风险。

## 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const text = ref('')
const mode = ref<'abc' | 'num' | 'symbol'>('abc')

function onInput(char: string) {
  text.value += char
}
function onDelete() {
  text.value = text.value.slice(0, -1)
}
function onModeChange(next: 'abc' | 'num' | 'symbol') {
  mode.value = next
}
</script>

<template>
  <view @click="visible = true">{{ text || '点击输入' }}</view>
  <mq-keyboard
    v-model:visible="visible"
    :mode="mode"
    :maxlength="20"
    random-order
    show-confirm
    confirm-text="完成"
    @input="onInput"
    @delete="onDelete"
    @change="onModeChange"
    @confirm="visible = false"
  />
</template>
```

字母页的 `Shift` 键切换大小写；数字页与符号页提供返回键，回到进入符号页前的文字页。

## API

### Props

| 参数              | 类型                         | 默认值   | 说明                       |
| ----------------- | ---------------------------- | -------- | -------------------------- |
| `v-model:visible` | `boolean`                    | `false`  | 键盘显隐                   |
| `mode`            | `'abc' \| 'num' \| 'symbol'` | `'abc'`  | 当前键盘页，可外部受控     |
| `confirm-text`    | `string`                     | `'完成'` | 确认按钮文案               |
| `show-confirm`    | `boolean`                    | `false`  | 是否显示确认按钮           |
| `random-order`    | `boolean`                    | `false`  | 是否打乱字母和数字键顺序   |
| `maxlength`       | `number`                     | `-1`     | 最多接收字符数，负数不限制 |

### Events

| 事件             | 参数             | 说明                               |
| ---------------- | ---------------- | ---------------------------------- |
| `update:visible` | `boolean`        | 关闭时发出，配合 `v-model:visible` |
| `input`          | `string`         | 输入一个字符，含空格               |
| `delete`         | -                | 点击删除键                         |
| `confirm`        | -                | 点击确认按钮，随后会关闭键盘       |
| `close`          | -                | 点击遮罩或确认关闭时发出           |
| `change`         | `MqKeyboardMode` | 键盘页切换时发出当前页             |

### Methods

无对外暴露方法。

### Slots

无插槽。

## 主题变量

| 变量                      | 默认值                   | 用途             |
| ------------------------- | ------------------------ | ---------------- |
| `--mq-z-popup`            | `1000`                   | 层级             |
| `--mq-mask`               | `rgba(22, 18, 12, 0.45)` | 遮罩             |
| `--mq-bg`                 | `#fffcf7`                | 键帽背景         |
| `--mq-bg-muted`           | `#f6f1e8`                | 面板与功能键背景 |
| `--mq-bg-active`          | `#ebe4d8`                | 按键按下态       |
| `--mq-text`               | `#1c1915`                | 键帽文字         |
| `--mq-text-secondary`     | `#6f675e`                | 功能键文字       |
| `--mq-color-primary`      | `#0f3d32`                | 激活态与确认按钮 |
| `--mq-color-primary-text` | `#f7f4ee`                | 激活态文字       |
| `--mq-radius`             | `8px`                    | 圆角             |
| `--mq-font-size`          | `14px`                   | 功能键字号       |
| `--mq-duration`           | `200ms`                  | 过渡时长         |
