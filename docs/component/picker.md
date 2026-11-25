<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqPicker `mq-picker`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-picker>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-picker />
```

## API

### Props

| 名称               | 类型                                                                                      | 必填 | 说明                                                 |
| ------------------ | ----------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------- |
| `modelValue`       | `MqPickerValue[]`                                                                         | 否   | 选中值数组。                                         |
| `visible`          | `boolean`                                                                                 | 否   | 弹出层显隐，配合 `v-model:visible`。                 |
| `columns`          | `MqPickerColumns`                                                                         | 否   | 一维数组为单列，二维数组为多列；`cascade` 时传入树。 |
| `cascade`          | `boolean`                                                                                 | 否   | —                                                    |
| `title`            | `string`                                                                                  | 否   | —                                                    |
| `cancelText`       | `string`                                                                                  | 否   | —                                                    |
| `confirmText`      | `string`                                                                                  | 否   | —                                                    |
| `valueKey`         | `string`                                                                                  | 否   | —                                                    |
| `labelKey`         | `string`                                                                                  | 否   | —                                                    |
| `childrenKey`      | `string`                                                                                  | 否   | —                                                    |
| `itemHeight`       | `number`                                                                                  | 否   | —                                                    |
| `visibleItemCount` | `number`                                                                                  | 否   | —                                                    |
| `beforeConfirm`    | `(value: MqPickerValue[], payload: MqPickerChangePayload) => boolean \| Promise<boolean>` | 否   | 确认前校验。返回 `false` 时留在面板里。              |
| `maskClosable`     | `boolean`                                                                                 | 否   | —                                                    |
| `zIndex`           | `number`                                                                                  | 否   | —                                                    |
| `duration`         | `number`                                                                                  | 否   | —                                                    |
| `safeArea`         | `boolean`                                                                                 | 否   | 面板底部是否留安全区。                               |
| `immediateChange`  | `boolean`                                                                                 | 否   | —                                                    |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `confirm` | `[payload: MqPickerConfirmPayload]` | — |
| `cancel` | `[]` | — |
| `open` | `[]` | — |
| `close` | `[]` | — |
| `change` | `[payload: MqPickerChangePayload]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-picker/` 为准。

### 导出类型

`MqPickerConfirmPayload`、`MqPickerProps`、`MqPickerEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
