<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqDialog `mq-dialog`

受控对话框，复用弹出层。可 `before-confirm`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-dialog>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-dialog />
```

## API

### Props

| 名称            | 类型                    | 必填 | 说明                                    |
| --------------- | ----------------------- | ---- | --------------------------------------- |
| `modelValue`    | `boolean`               | 否   | —                                       |
| `title`         | `string`                | 否   | —                                       |
| `message`       | `string`                | 否   | —                                       |
| `showCancel`    | `boolean`               | 否   | 为 false 时只显示确认。                 |
| `confirmText`   | `string`                | 否   | —                                       |
| `cancelText`    | `string`                | 否   | —                                       |
| `beforeConfirm` | `MqDialogBeforeConfirm` | 否   | 确认前拦截。返回 false 或抛错时不关闭。 |
| `maskClosable`  | `boolean`               | 否   | —                                       |
| `duration`      | `number`                | 否   | —                                       |
| `zIndex`        | `number`                | 否   | —                                       |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `confirm` | `[]` | — |
| `cancel` | `[]` | — |
| `close` | `[]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-dialog/` 为准。

### 导出类型

`MqDialogBeforeConfirm`、`MqDialogProps`、`MqDialogEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
