<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSelect `mq-select`

底部弹层选择器，支持单选 / 多选与本地搜索

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-select>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-select />
```

## API

### Props

| 名称           | 类型               | 必填 | 说明             |
| -------------- | ------------------ | ---- | ---------------- |
| `modelValue`   | `MqSelectValue`    | 否   | —                |
| `visible`      | `boolean`          | 否   | —                |
| `options`      | `MqSelectOption[]` | 否   | —                |
| `multiple`     | `boolean`          | 否   | —                |
| `title`        | `string`           | 否   | —                |
| `placeholder`  | `string`           | 否   | 搜索框占位文案。 |
| `searchable`   | `boolean`          | 否   | —                |
| `cancelText`   | `string`           | 否   | —                |
| `confirmText`  | `string`           | 否   | —                |
| `maskClosable` | `boolean`          | 否   | —                |
| `zIndex`       | `number`           | 否   | —                |
| `duration`     | `number`           | 否   | —                |
| `safeArea`     | `boolean`          | 否   | —                |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-select/` 为准。

### 导出类型

`MqSelectProps`、`MqSelectPayload`、`MqSelectEmits`、`MqSelectExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
