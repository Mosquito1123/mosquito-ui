<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqInputNumber `mq-input-number`

加减计数，文字按钮，不使用图标字体；支持 `focus` / `blur`、`without-input`、`allow-null`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-input-number>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-input-number />
```

## API

### Props

| 名称              | 类型                        | 必填 | 说明                                                      |
| ----------------- | --------------------------- | ---- | --------------------------------------------------------- |
| `modelValue`      | `number \| ''`              | 否   | 绑定值；`allowNull` 为 true 时允许空字符串。              |
| `min`             | `number`                    | 否   | —                                                         |
| `max`             | `number`                    | 否   | —                                                         |
| `step`            | `number`                    | 否   | —                                                         |
| `precision`       | `number`                    | 否   | 小数位数。非法或负数按 0。                                |
| `stepStrictly`    | `boolean`                   | 否   | —                                                         |
| `disabled`        | `boolean`                   | 否   | —                                                         |
| `disableInput`    | `boolean`                   | 否   | —                                                         |
| `disableMinus`    | `boolean`                   | 否   | —                                                         |
| `disablePlus`     | `boolean`                   | 否   | —                                                         |
| `beforeChange`    | `MqInputNumberBeforeChange` | 否   | —                                                         |
| `withoutInput`    | `boolean`                   | 否   | 隐藏输入框，只保留加减按钮。                              |
| `allowNull`       | `boolean`                   | 否   | 允许空值：输入框清空时提交空字符串而不是回退到数字。      |
| `immediateChange` | `boolean`                   | 否   | 为 false 时输入过程不提交，只在失焦或点击加减按钮时提交。 |
| `inputWidth`      | `string \| number`          | 否   | 输入框宽度，数字按 px 处理。                              |
| `placeholder`     | `string`                    | 否   | —                                                         |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: number \| string }]` | — |
| `focus` | `[payload: { value: number \| string }]` | — |
| `blur` | `[payload: { value: number \| string }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-input-number/` 为准。

### 导出类型

`MqInputNumberBeforeChange`、`MqInputNumberProps`、`MqInputNumberEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
