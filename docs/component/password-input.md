<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqPasswordInput `mq-password-input`

密码 / 验证码格子

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-password-input>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-password-input />
```

## API

### Props

| 名称         | 类型               | 必填 | 说明 |
| ------------ | ------------------ | ---- | ---- |
| `modelValue` | `string`           | 否   | —    |
| `mask`       | `boolean`          | 否   | —    |
| `info`       | `string`           | 否   | —    |
| `errorInfo`  | `string`           | 否   | —    |
| `gutter`     | `number \| string` | 否   | —    |
| `length`     | `number`           | 否   | —    |
| `focused`    | `boolean`          | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-password-input/` 为准。

### 导出类型

`MqPasswordInputProps`、`MqPasswordInputEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
