<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSignature `mq-signature`

Canvas 签名板，支持撤回、清空和导出图片

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-signature>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-signature />
```

## API

### Props

| 名称              | 类型               | 必填 | 说明 |
| ----------------- | ------------------ | ---- | ---- |
| `penColor`        | `string`           | 否   | —    |
| `lineWidth`       | `number`           | 否   | —    |
| `confirmText`     | `string`           | 否   | —    |
| `clearText`       | `string`           | 否   | —    |
| `undoText`        | `string`           | 否   | —    |
| `disabled`        | `boolean`          | 否   | —    |
| `height`          | `number \| string` | 否   | —    |
| `width`           | `number \| string` | 否   | —    |
| `backgroundColor` | `string`           | 否   | —    |
| `fileType`        | `'png' \| 'jpg'`   | 否   | —    |
| `quality`         | `number`           | 否   | —    |
| `exportScale`     | `number`           | 否   | —    |
| `enableHistory`   | `boolean`          | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-signature/` 为准。

### 导出类型

`MqSignatureResult`、`MqSignatureProps`、`MqSignatureEmits`、`MqSignatureExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
