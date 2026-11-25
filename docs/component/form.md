<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqForm `mq-form`

表单与校验（轻量 `schema`，不内置 Zod）

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-form>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-form />
```

## API

### Props

| 名称               | 类型                      | 必填 | 说明 |
| ------------------ | ------------------------- | ---- | ---- |
| `model`            | `Record<string, unknown>` | 否   | —    |
| `schema`           | `MqFormSchema`            | 否   | —    |
| `errorType`        | `MqFormErrorType`         | 否   | —    |
| `disabled`         | `boolean`                 | 否   | —    |
| `border`           | `boolean`                 | 否   | —    |
| `center`           | `boolean`                 | 否   | —    |
| `titleWidth`       | `string \| number`        | 否   | —    |
| `layout`           | `MqFormLayout`            | 否   | —    |
| `valueAlign`       | `MqFormValueAlign`        | 否   | —    |
| `asteriskPosition` | `MqFormAsteriskPosition`  | 否   | —    |
| `hideAsterisk`     | `boolean`                 | 否   | —    |
| `resetOnChange`    | `boolean`                 | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-form/` 为准。

### 导出类型

`MqFormSchemaIssue`、`MqFormSchema`、`MqFormErrorType`、`MqFormLayout`、`MqFormValueAlign`、`MqFormAsteriskPosition`、`MqFormProps`、`MqFormValidateResult`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
