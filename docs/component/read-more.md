<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqReadMore `mq-read-more`

长文本折叠 / 展开，支持插槽与渐变遮罩

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-read-more>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-read-more />
```

## API

### Props

| 名称           | 类型      | 必填 | 说明                                                   |
| -------------- | --------- | ---- | ------------------------------------------------------ |
| `text`         | `string`  | 否   | 直接传文本时使用；也可以用默认插槽。                   |
| `maxHeight`    | `number`  | 否   | 收起后的最大高度（px），默认 120。                     |
| `expandText`   | `string`  | 否   | —                                                      |
| `collapseText` | `string`  | 否   | —                                                      |
| `disabled`     | `boolean` | 否   | —                                                      |
| `toggleable`   | `boolean` | 否   | 是否始终显示展开按钮；不传时按文本长度或插槽自动判断。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-read-more/` 为准。

### 导出类型

`MqReadMoreProps`、`MqReadMoreEmits`、`MqReadMoreExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
