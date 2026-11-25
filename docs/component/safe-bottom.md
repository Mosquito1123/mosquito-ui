<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSafeBottom `mq-safe-bottom`

底部安全区留白，`bg` 同时写进行内背景和 `--mq-safe-bg`，默认透明

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-safe-bottom>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-safe-bottom />
```

## API

### Props

| 名称 | 类型     | 必填 | 说明                                                                                                                                                                                       |
| ---- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bg` | `string` | 否   | 背景色。默认 `transparent`。 同时写到行内 `background-color` 和 CSS 变量 `--mq-safe-bg`， 安全区留白和插槽内容用同一块底色。 空字符串视为透明。可传 `#fffcf7`、`rgb()`、`var(--mq-bg)`。 / |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-safe-bottom/` 为准。

### 导出类型

`MqSafeBottomProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
