<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqBacktop `mq-backtop`

回到顶部，默认文字 `↑`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-backtop>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-backtop />
```

## API

### Props

| 名称        | 类型             | 必填 | 说明 |
| ----------- | ---------------- | ---- | ---- |
| `scrollTop` | `number`         | 否   | —    |
| `text`      | `string`         | 否   | —    |
| `top`       | `number`         | 否   | —    |
| `duration`  | `number`         | 否   | —    |
| `zIndex`    | `number`         | 否   | —    |
| `shape`     | `MqBacktopShape` | 否   | —    |
| `bottom`    | `number`         | 否   | —    |
| `right`     | `number`         | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-backtop/` 为准。

### 导出类型

`MqBacktopShape`、`MqBacktopProps`、`MqBacktopEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
