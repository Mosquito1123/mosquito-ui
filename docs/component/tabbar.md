<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTabbar `mq-tabbar`

底栏。用 `mark` 文字标记，可用 `icon` 插槽

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-tabbar>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-tabbar />
```

## API

### Props

| 名称                  | 类型                   | 必填 | 说明 |
| --------------------- | ---------------------- | ---- | ---- |
| `modelValue`          | `string \| number`     | 否   | —    |
| `fixed`               | `boolean`              | 否   | —    |
| `bordered`            | `boolean`              | 否   | —    |
| `safeAreaInsetBottom` | `boolean`              | 否   | —    |
| `placeholder`         | `boolean`              | 否   | —    |
| `activeColor`         | `string`               | 否   | —    |
| `inactiveColor`       | `string`               | 否   | —    |
| `beforeChange`        | `MqTabbarBeforeChange` | 否   | —    |
| `zIndex`              | `number`               | 否   | —    |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: string \| number }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-tabbar/` 为准。

### 导出类型

`MqTabbarBeforeChange`、`MqTabbarProps`、`MqTabbarEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
