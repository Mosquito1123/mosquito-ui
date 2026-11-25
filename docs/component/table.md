<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTable `mq-table`

数据表格：列配置、斑马纹、边框、单元格插槽

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-table>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-table />
```

## API

### Props

| 名称        | 类型                             | 必填 | 说明                            |
| ----------- | -------------------------------- | ---- | ------------------------------- |
| `data`      | `Array<Record<string, unknown>>` | 否   | —                               |
| `columns`   | `MqTableColumn[]`                | 否   | —                               |
| `border`    | `boolean`                        | 否   | —                               |
| `stripe`    | `boolean`                        | 否   | —                               |
| `size`      | `MqTableSize`                    | 否   | —                               |
| `rowKey`    | `string`                         | 否   | 行主键字段，不写时用下标。      |
| `emptyText` | `string`                         | 否   | —                               |
| `loading`   | `boolean`                        | 否   | —                               |
| `align`     | `MqTableAlign`                   | 否   | 列没有写 `align` 时的默认对齐。 |
| `headerBg`  | `string`                         | 否   | —                               |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `rowClick` | `[row: Record<string, unknown>, index: number]` | — |
| `cellClick` | `[row: Record<string, unknown>, column: MqTableColumn, index: number]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-table/` 为准。

### 导出类型

`MqTableAlign`、`MqTableSize`、`MqTableColumn`、`MqTableProps`、`MqTableEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
