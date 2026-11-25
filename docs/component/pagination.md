<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqPagination `mq-pagination`

分页，`v-model` 当前页；`total-page`、`hide-if-one-page`，插槽含 `total` / `page-size`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-pagination>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-pagination />
```

## API

### Props

| 名称            | 类型      | 必填 | 说明                                                 |
| --------------- | --------- | ---- | ---------------------------------------------------- |
| `modelValue`    | `number`  | 否   | —                                                    |
| `total`         | `number`  | 否   | —                                                    |
| `pageSize`      | `number`  | 否   | —                                                    |
| `totalPage`     | `number`  | 否   | 手动指定总页数；提供后不再按 total / pageSize 计算。 |
| `showMessage`   | `boolean` | 否   | —                                                    |
| `hideIfOnePage` | `boolean` | 否   | 总页数不超过 1 时不渲染根节点。                      |
| `prevText`      | `string`  | 否   | —                                                    |
| `nextText`      | `string`  | 否   | —                                                    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-pagination/` 为准。

### 导出类型

`MqPaginationProps`、`MqPaginationEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
