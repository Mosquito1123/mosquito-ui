<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCheckboxGroup `mq-checkbox-group`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-checkbox-group>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-checkbox-group />
```

## API

### Props

| 名称             | 类型                         | 必填 | 说明                         |
| ---------------- | ---------------------------- | ---- | ---------------------------- |
| `modelValue`     | `MqOptionValue[]`            | 否   | —                            |
| `type`           | `MqCheckboxType`             | 否   | —                            |
| `disabled`       | `boolean`                    | 否   | —                            |
| `readonly`       | `boolean`                    | 否   | —                            |
| `min`            | `number`                     | 否   | 至少保留几个。               |
| `max`            | `number`                     | 否   | 最多选几个。`0` 表示不限制。 |
| `placement`      | `'left' \| 'right'`          | 否   | —                            |
| `direction`      | `'horizontal' \| 'vertical'` | 否   | —                            |
| `checkedColor`   | `string`                     | 否   | —                            |
| `uncheckedColor` | `string`                     | 否   | —                            |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: MqOptionValue[] }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-checkbox-group/` 为准。

### 导出类型

`MqCheckboxGroupProps`、`MqCheckboxGroupEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
