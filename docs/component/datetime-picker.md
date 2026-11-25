<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqDatetimePicker `mq-datetime-picker`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-datetime-picker>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-datetime-picker />
```

## API

### Props

| 名称               | 类型                            | 必填 | 说明                                                  |
| ------------------ | ------------------------------- | ---- | ----------------------------------------------------- |
| `modelValue`       | `string \| number`              | 否   | `time` 类型用 `HH:mm(:ss)` 字符串，其余类型用时间戳。 |
| `visible`          | `boolean`                       | 否   | —                                                     |
| `type`             | `MqDatetimeType`                | 否   | —                                                     |
| `title`            | `string`                        | 否   | —                                                     |
| `cancelText`       | `string`                        | 否   | —                                                     |
| `confirmText`      | `string`                        | 否   | —                                                     |
| `maskClosable`     | `boolean`                       | 否   | —                                                     |
| `safeArea`         | `boolean`                       | 否   | —                                                     |
| `itemHeight`       | `number`                        | 否   | —                                                     |
| `visibleItemCount` | `number`                        | 否   | —                                                     |
| `minDate`          | `number`                        | 否   | —                                                     |
| `maxDate`          | `number`                        | 否   | —                                                     |
| `minHour`          | `number`                        | 否   | —                                                     |
| `maxHour`          | `number`                        | 否   | —                                                     |
| `minMinute`        | `number`                        | 否   | —                                                     |
| `maxMinute`        | `number`                        | 否   | —                                                     |
| `useSecond`        | `boolean`                       | 否   | —                                                     |
| `minSecond`        | `number`                        | 否   | —                                                     |
| `maxSecond`        | `number`                        | 否   | —                                                     |
| `formatter`        | `MqDatetimeFormatter`           | 否   | —                                                     |
| `beforeConfirm`    | `MqDatetimePickerBeforeConfirm` | 否   | —                                                     |
| `zIndex`           | `number`                        | 否   | —                                                     |
| `duration`         | `number`                        | 否   | —                                                     |
| `immediateChange`  | `boolean`                       | 否   | —                                                     |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-datetime-picker/` 为准。

### 导出类型

`MqDatetimePickerBeforeConfirm`、`MqDatetimePickerProps`、`MqDatetimeConfirmPayload`、`MqDatetimePickerEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
