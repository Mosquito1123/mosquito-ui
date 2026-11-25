<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqPickerView `mq-picker-view`

滚轮选择器与底部弹出选择器，支持多列和级联

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-picker-view>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-picker-view />
```

## API

### Props

| 名称               | 类型              | 必填 | 说明                                                       |
| ------------------ | ----------------- | ---- | ---------------------------------------------------------- |
| `modelValue`       | `MqPickerValue[]` | 否   | 选中值。单列为长度为 1 的数组，多列按列顺序。              |
| `columns`          | `MqPickerColumns` | 否   | 一维数组为单列，二维数组为多列；`cascade` 时传入树形数组。 |
| `cascade`          | `boolean`         | 否   | 级联模式，`columns` 传入带 `children` 的树。               |
| `itemHeight`       | `number`          | 否   | 每项高度，像素。                                           |
| `visibleItemCount` | `number`          | 否   | 一屏可见项数。                                             |
| `valueKey`         | `string`          | 否   | —                                                          |
| `labelKey`         | `string`          | 否   | —                                                          |
| `childrenKey`      | `string`          | 否   | —                                                          |
| `immediateChange`  | `boolean`         | 否   | 手指松开就触发 `change`，不等滚动动画结束。                |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: MqPickerChangePayload]` | — |
| `pickstart` | `[]` | — |
| `pickend` | `[]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-picker-view/` 为准。

### 导出类型

`MqPickerChangePayload`、`MqPickerViewProps`、`MqPickerViewEmits`、`MqPickerViewExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
