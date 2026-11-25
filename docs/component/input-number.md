<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqInputNumber `mq-input-number`

加减计数，文字按钮，不使用图标字体

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-input-number>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-input-number />
```

## API

### Props

| 名称           | 类型                        | 必填 | 说明                       |
| -------------- | --------------------------- | ---- | -------------------------- |
| `modelValue`   | `number`                    | 否   | —                          |
| `min`          | `number`                    | 否   | —                          |
| `max`          | `number`                    | 否   | —                          |
| `step`         | `number`                    | 否   | —                          |
| `precision`    | `number`                    | 否   | 小数位数。非法或负数按 0。 |
| `stepStrictly` | `boolean`                   | 否   | —                          |
| `disabled`     | `boolean`                   | 否   | —                          |
| `disableInput` | `boolean`                   | 否   | —                          |
| `disableMinus` | `boolean`                   | 否   | —                          |
| `disablePlus`  | `boolean`                   | 否   | —                          |
| `beforeChange` | `MqInputNumberBeforeChange` | 否   | —                          |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: number }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-input-number/` 为准。

### 导出类型

`MqInputNumberBeforeChange`、`MqInputNumberProps`、`MqInputNumberEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
