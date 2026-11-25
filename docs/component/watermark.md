<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqWatermark `mq-watermark`

文字水印

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-watermark>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-watermark />
```

## API

### Props

| 名称         | 类型                | 必填 | 说明 |
| ------------ | ------------------- | ---- | ---- |
| `content`    | `string`            | 否   | —    |
| `width`      | `number`            | 否   | —    |
| `height`     | `number`            | 否   | —    |
| `fullScreen` | `boolean`           | 否   | —    |
| `color`      | `string`            | 否   | —    |
| `size`       | `number`            | 否   | —    |
| `rotate`     | `number`            | 否   | —    |
| `zIndex`     | `number`            | 否   | —    |
| `opacity`    | `number`            | 否   | —    |
| `layout`     | `MqWatermarkLayout` | 否   | —    |
| `gutterX`    | `number`            | 否   | —    |
| `gutterY`    | `number`            | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-watermark/` 为准。

### 导出类型

`MqWatermarkLayout`、`MqWatermarkProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
