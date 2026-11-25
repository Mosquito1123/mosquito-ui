<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqDropMenuItem `mq-drop-menu-item`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-drop-menu-item>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-drop-menu-item />
```

## API

### Props

| 名称           | 类型                         | 必填 | 说明                                     |
| -------------- | ---------------------------- | ---- | ---------------------------------------- |
| `modelValue`   | `string \| number`           | 否   | —                                        |
| `disabled`     | `boolean`                    | 否   | —                                        |
| `options`      | `MqDropMenuItemOption[]`     | 否   | —                                        |
| `title`        | `string`                     | 否   | 设置后优先展示标题文案，不再展示选中项。 |
| `placeholder`  | `string`                     | 否   | —                                        |
| `valueKey`     | `string`                     | 否   | —                                        |
| `labelKey`     | `string`                     | 否   | —                                        |
| `tipKey`       | `string`                     | 否   | —                                        |
| `popupHeight`  | `string`                     | 否   | 下拉面板最大高度，默认 `60vh`。          |
| `beforeToggle` | `MqDropMenuItemBeforeToggle` | 否   | —                                        |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-drop-menu-item/` 为准。

### 导出类型

`MqDropMenuItemOption`、`MqDropMenuItemBeforeToggle`、`MqDropMenuItemProps`、`MqDropMenuItemChangePayload`、`MqDropMenuItemEmits`、`MqDropMenuItemExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
