<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTree `mq-tree`

树形选择，支持多选级联、展开集合与全部展开 / 收起

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-tree>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-tree />
```

## API

### Props

| 名称               | 类型                      | 必填 | 说明                                  |
| ------------------ | ------------------------- | ---- | ------------------------------------- |
| `data`             | `MqTreeNode[]`            | 否   | —                                     |
| `modelValue`       | `MqTreeModelValue`        | 否   | 勾选模式用数组，普通模式用单个值。    |
| `checkable`        | `boolean`                 | 否   | —                                     |
| `defaultExpandAll` | `boolean`                 | 否   | —                                     |
| `expanded`         | `Array<string \| number>` | 否   | 受控展开值，配合 `v-model:expanded`。 |
| `indent`           | `number`                  | 否   | 每级缩进（px）。                      |
| `emptyText`        | `string`                  | 否   | —                                     |
| `disabled`         | `boolean`                 | 否   | —                                     |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-tree/` 为准。

### 导出类型

`MqTreeModelValue`、`MqTreeProps`、`MqTreeNodeClickPayload`、`MqTreeCheckPayload`、`MqTreeExpandPayload`、`MqTreeEmits`、`MqTreeExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
