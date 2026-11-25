# MqColPicker 多列选择器

多列联动选择，常用于省市区等无限级数据。选中某一列后由 `column-change` 提供下一列数据，支持同步或异步加载。

## 何时使用

- 省市区、分类层级等需要逐列展开的数据。
- 下一列依赖上一列选中值，且可能需要异步请求。
- 需要在确定前做校验，或在加载失败时直接取消。

## 用法示例

```vue
<mq-col-picker v-model="region" label="地区" :columns="columns" :column-change="onColumnChange" />
```

```ts
const columns = [[{ value: 'zj', label: '浙江' }]]

function onColumnChange({ selectedItem, resolve, finish }) {
  const children = areaData[String(selectedItem.value)]
  if (children?.length) {
    resolve(children)
  } else {
    finish() // 没有下一列，直接提交
  }
}
```

## API

### Props

| 名称                      | 类型                                                                 | 默认值     | 说明                                                      |
| ------------------------- | -------------------------------------------------------------------- | ---------- | --------------------------------------------------------- |
| `modelValue`              | `Array<string \| number>`                                            | `[]`       | 每列选中值                                                |
| `columns`                 | `MqColPickerOption[][]`                                              | `[]`       | 二维数组，每项是一列的选项                                |
| `columnChange`            | `(payload: MqColPickerColumnChangePayload) => void \| Promise<void>` | —          | 选中列时回调，用 `resolve` 补下一列、`finish(false)` 取消 |
| `label`                   | `string`                                                             | `''`       | 左侧标题                                                  |
| `title`                   | `string`                                                             | `''`       | 弹出层标题                                                |
| `placeholder`             | `string`                                                             | `请选择`   | 未选择时的占位文案                                        |
| `disabled` / `readonly`   | `boolean`                                                            | `false`    | 禁用 / 只读，均不提交选择                                 |
| `displayFormat`           | `(items: MqColPickerOption[]) => string`                             | —          | 自定义回显文案                                            |
| `size`                    | `'normal' \| 'large'`                                                | `'normal'` | 选择器字号                                                |
| `labelWidth`              | `string`                                                             | `''`       | 左侧标题宽度                                              |
| `error` / `required`      | `boolean`                                                            | `false`    | 错误态 / 必填标记                                         |
| `alignRight` / `ellipsis` | `boolean`                                                            | `false`    | 值靠右 / 选项文字超出省略                                 |
| `beforeConfirm`           | `(value, items) => boolean \| Promise<boolean>`                      | —          | 确认前校验，返回 `false` 时留在面板                       |
| `maskClosable`            | `boolean`                                                            | `true`     | 点击遮罩是否关闭                                          |
| `zIndex`                  | `number`                                                             | —          | 弹出层级                                                  |
| `autoComplete`            | `boolean`                                                            | `false`    | `columns` 为空时用首列值自动触发 `columnChange`           |

### Events

| 名称                | 参数                             | 说明                   |
| ------------------- | -------------------------------- | ---------------------- |
| `update:modelValue` | `value: Array<string \| number>` | 提交时更新             |
| `confirm`           | `{ value, selectedItems }`       | 选中最后一列或点击确定 |
| `close`             | —                                | 面板关闭               |

### Slots

无。

### Methods

| 名称             | 说明            |
| ---------------- | --------------- |
| `open` / `close` | 打开 / 关闭面板 |

## 主题变量

单元格与面板颜色走 `--mq-bg`、`--mq-border`、`--mq-text`、`--mq-color-primary`、`--mq-color-danger`，清单见[主题令牌](/guide/theme-vars)。
