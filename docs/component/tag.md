<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTag `mq-tag`

类型、镂空、浅色、圆角、可关闭；`dynamic` 输入，`click` / `confirm` 事件

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-tag>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-tag />
```

## API

### Props

| 名称       | 类型           | 必填 | 说明                                       |
| ---------- | -------------- | ---- | ------------------------------------------ |
| `type`     | `MqTagType`    | 否   | —                                          |
| `variant`  | `MqTagVariant` | 否   | —                                          |
| `size`     | `MqTagSize`    | 否   | —                                          |
| `round`    | `boolean`      | 否   | —                                          |
| `closable` | `boolean`      | 否   | —                                          |
| `disabled` | `boolean`      | 否   | 禁用时不发出 click，输入框也不可编辑。     |
| `dynamic`  | `boolean`      | 否   | 渲染为可输入标签，回车确认时发出 confirm。 |
| `color`    | `string`       | 否   | 文字颜色。                                 |
| `bgColor`  | `string`       | 否   | 实心时作背景，镂空时作边框。               |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `close` | `[event: Event]` | — |
| `click` | `[event: MouseEvent]` | — |
| `confirm` | `[payload: { value: string }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-tag/` 为准。

### 导出类型

`MqTagType`、`MqTagVariant`、`MqTagSize`、`MqTagProps`、`MqTagEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
