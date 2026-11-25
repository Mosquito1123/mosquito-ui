<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTextarea `mq-textarea`

多行输入，清空、字数、`auto-height`。`maxlength` 小于 0 时不限制

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-textarea>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-textarea />
```

## API

### Props

| 名称            | 类型               | 必填 | 说明                                               |
| --------------- | ------------------ | ---- | -------------------------------------------------- |
| `modelValue`    | `string \| number` | 否   | —                                                  |
| `placeholder`   | `string`           | 否   | —                                                  |
| `maxlength`     | `number`           | 否   | 小于 0 表示不限制。会原样传给原生 textarea 的 -1。 |
| `disabled`      | `boolean`          | 否   | —                                                  |
| `readonly`      | `boolean`          | 否   | —                                                  |
| `clearable`     | `boolean`          | 否   | —                                                  |
| `showWordLimit` | `boolean`          | 否   | —                                                  |
| `error`         | `boolean`          | 否   | —                                                  |
| `compact`       | `boolean`          | 否   | 去掉边框和内边距，方便放进单元格。                 |
| `autoHeight`    | `boolean`          | 否   | 随内容增高。交给原生 textarea 的 auto-height。     |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `input` | `[payload: MqTextareaPayload]` | — |
| `focus` | `[payload: MqTextareaPayload]` | — |
| `blur` | `[payload: MqTextareaPayload]` | — |
| `clear` | `[]` | — |
| `confirm` | `[payload: MqTextareaPayload]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-textarea/` 为准。

### 导出类型

`MqTextareaProps`、`MqTextareaPayload`、`MqTextareaEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
