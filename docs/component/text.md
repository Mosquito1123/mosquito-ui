<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqText `mq-text`

文本：主题色、行数、`price` / `phone` / `name` 模式

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-text>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-text />
```

## API

### Props

| 名称         | 类型               | 必填 | 说明 |
| ------------ | ------------------ | ---- | ---- |
| `text`       | `string \| number` | 否   | —    |
| `type`       | `MqTextType`       | 否   | —    |
| `mode`       | `MqTextMode`       | 否   | —    |
| `color`      | `string`           | 否   | —    |
| `size`       | `string \| number` | 否   | —    |
| `bold`       | `boolean`          | 否   | —    |
| `lines`      | `number`           | 否   | —    |
| `decoration` | `MqTextDecoration` | 否   | —    |
| `prefix`     | `string`           | 否   | —    |
| `suffix`     | `string`           | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-text/` 为准。

### 导出类型

`MqTextType`、`MqTextMode`、`MqTextDecoration`、`MqTextProps`、`MqTextEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
