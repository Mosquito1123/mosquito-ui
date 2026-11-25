<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSticky `mq-sticky`

CSS 吸顶

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-sticky>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-sticky />
```

## API

### Props

| 名称        | 类型     | 必填 | 说明 |
| ----------- | -------- | ---- | ---- |
| `offsetTop` | `number` | 否   | —    |
| `zIndex`    | `number` | 否   | —    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-sticky/` 为准。

### 导出类型

`MqStickyProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
