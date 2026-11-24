# MqSelectPicker 单选型选择器

轻量单选弹层，复用 `MqPopup`，API 贴近 wot-ui 的 `select-picker`。与支持搜索、多选的 `mq-select` 不同，这里只做单选。

## 何时使用

- 只需要从一组选项中挑一个，不需要搜索或多选。
- 希望保留「取消 / 确定」确认流程，选项可以是字符串、数字或自定义对象。

## 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<string | number>('sh')
const visible = ref(false)
const options = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz', disabled: true },
]
</script>

<template>
  <view @click="visible = true">{{ value }}</view>
  <mq-select-picker
    v-model="value"
    v-model:visible="visible"
    title="选择城市"
    :options="options"
    @confirm="({ value }) => console.log(value)"
  />
</template>
```

也可以直接传 `['北京', '上海']`，此时值和文案都是元素本身。对象选项默认读 `value` / `label`，可通过 `value-key`、`label-key` 改键名。

## API

### Props

| 参数              | 类型                                              | 默认值      | 说明                               |
| ----------------- | ------------------------------------------------- | ----------- | ---------------------------------- |
| `v-model`         | `string \| number \| undefined`                   | `undefined` | 当前选中值                         |
| `options`         | `(string \| number \| Record<string, unknown>)[]` | `[]`        | 选项列表                           |
| `v-model:visible` | `boolean`                                         | `false`     | 弹层显隐                           |
| `title`           | `string`                                          | `''`        | 标题，为空时无障碍名称用「请选择」 |
| `value-key`       | `string`                                          | `'value'`   | 对象选项取值键名                   |
| `label-key`       | `string`                                          | `'label'`   | 对象选项取文案键名                 |
| `disabled`        | `boolean`                                         | `false`     | 禁用整个选择器，不响应点击与打开   |
| `mask-closable`   | `boolean`                                         | `true`      | 点击遮罩是否关闭                   |
| `safe-area`       | `boolean`                                         | `true`      | 面板底部是否留安全区               |

### Events

| 事件                | 参数                    | 说明                                        |
| ------------------- | ----------------------- | ------------------------------------------- |
| `update:modelValue` | `MqSelectPickerValue`   | 确认时发出                                  |
| `update:visible`    | `boolean`               | 显隐变化                                    |
| `confirm`           | `MqSelectPickerPayload` | 点击确定，参数含 `value`、`label`、`option` |
| `change`            | `MqSelectPickerPayload` | 点选不同选项时发出                          |
| `cancel`            | -                       | 点击取消或关闭弹层时发出                    |
| `open`              | -                       | 弹层打开                                    |
| `close`             | -                       | 弹层关闭（含遮罩、取消、确认）              |

### Methods

| 方法      | 说明                           |
| --------- | ------------------------------ |
| `open()`  | 打开弹层，已打开或禁用时无操作 |
| `close()` | 关闭弹层                       |

### Slots

无插槽。

## 主题变量

| 变量                  | 默认值    | 用途             |
| --------------------- | --------- | ---------------- |
| `--mq-bg`             | `#fffcf7` | 面板背景         |
| `--mq-border`         | `#e6e2da` | 头部边框         |
| `--mq-border-light`   | `#f0ece4` | 选项分隔线       |
| `--mq-text`           | `#1c1915` | 标题与选项文字   |
| `--mq-text-secondary` | `#6f675e` | 取消按钮与空状态 |
| `--mq-color-primary`  | `#0f3d32` | 确定按钮与选中态 |
| `--mq-font-size`      | `14px`    | 操作与选项字号   |

弹层遮罩、层级与动画变量沿用 `MqPopup`（`--mq-mask`、`--mq-z-popup`、`--mq-duration`）。
