<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqInput `mq-input`

`v-model`、清空、字数、密码显隐、`compact` 放进单元格

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-input>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-input />
```

## API

### Props

| 名称            | 类型                 | 必填 | 说明                                   |
| --------------- | -------------------- | ---- | -------------------------------------- |
| `modelValue`    | `string \| number`   | 否   | —                                      |
| `type`          | `MqInputType`        | 否   | —                                      |
| `placeholder`   | `string`             | 否   | —                                      |
| `maxlength`     | `number`             | 否   | —                                      |
| `disabled`      | `boolean`            | 否   | —                                      |
| `readonly`      | `boolean`            | 否   | —                                      |
| `clearable`     | `boolean`            | 否   | —                                      |
| `showPassword`  | `boolean`            | 否   | 在密码和明文之间切换，不使用图标字体。 |
| `showWordLimit` | `boolean`            | 否   | 和 `maxlength` 一起用时显示字数。      |
| `error`         | `boolean`            | 否   | —                                      |
| `alignRight`    | `boolean`            | 否   | —                                      |
| `compact`       | `boolean`            | 否   | 去掉边框和内边距，方便放进单元格。     |
| `confirmType`   | `MqInputConfirmType` | 否   | —                                      |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `input` | `[payload: MqInputPayload]` | — |
| `focus` | `[payload: MqInputPayload]` | — |
| `blur` | `[payload: MqInputPayload]` | — |
| `clear` | `[]` | — |
| `confirm` | `[payload: MqInputPayload]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-input/` 为准。

### 导出类型

`MqInputType`、`MqInputConfirmType`、`MqInputProps`、`MqInputPayload`、`MqInputEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
