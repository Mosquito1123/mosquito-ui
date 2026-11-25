<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqNumberKeyboard `mq-number-keyboard`

数字键盘

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-number-keyboard>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-number-keyboard />
```

## API

### Props

| 名称             | 类型                   | 必填 | 说明 |
| ---------------- | ---------------------- | ---- | ---- |
| `modelValue`     | `string`               | 否   | —    |
| `visible`        | `boolean`              | 否   | —    |
| `mode`           | `MqNumberKeyboardMode` | 否   | —    |
| `extraKey`       | `string`               | 否   | —    |
| `closeText`      | `string`               | 否   | —    |
| `maxlength`      | `number`               | 否   | —    |
| `randomKeyOrder` | `boolean`              | 否   | —    |
| `title`          | `string`               | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-number-keyboard/` 为准。

### 导出类型

`MqNumberKeyboardMode`、`MqNumberKeyboardProps`、`MqNumberKeyboardEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
