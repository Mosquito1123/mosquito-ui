<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCheckbox `mq-checkbox`

可单独绑定，也可按组多选，支持 `min` / `max`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-checkbox>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-checkbox />
```

## API

### Props

| 名称             | 类型                | 必填 | 说明                                    |
| ---------------- | ------------------- | ---- | --------------------------------------- |
| `modelValue`     | `MqOptionValue`     | 否   | 单独使用时的绑定值。在组里改用 `name`。 |
| `name`           | `MqOptionValue`     | 否   | 组内的选项值。                          |
| `type`           | `MqCheckboxType`    | 否   | —                                       |
| `disabled`       | `boolean`           | 否   | —                                       |
| `readonly`       | `boolean`           | 否   | —                                       |
| `trueValue`      | `MqOptionValue`     | 否   | —                                       |
| `falseValue`     | `MqOptionValue`     | 否   | —                                       |
| `placement`      | `'left' \| 'right'` | 否   | —                                       |
| `checkedColor`   | `string`            | 否   | —                                       |
| `uncheckedColor` | `string`            | 否   | —                                       |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: MqOptionValue }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-checkbox/` 为准。

### 导出类型

`MqCheckboxType`、`MqCheckboxProps`、`MqCheckboxEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
