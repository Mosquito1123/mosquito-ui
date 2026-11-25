<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqLoading `mq-loading`

单节点指示，可选 `size`、`color`、`label`；`type` 支持 `circular` / `spinner` / `dots` / `wave`，`text` 与默认插槽

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-loading>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-loading />
```

## API

### Props

| 名称        | 类型                 | 必填 | 说明                                        |
| ----------- | -------------------- | ---- | ------------------------------------------- |
| `size`      | `string \| number`   | 否   | 直径。数字按 px。小于等于 0 或非法时用 20。 |
| `color`     | `string`             | 否   | 顶部描边颜色，写到 `border-top-color`。     |
| `label`     | `string`             | 否   | 无障碍名称。默认「加载中」。                |
| `type`      | `MqLoadingType`      | 否   | 指示器样式。                                |
| `text`      | `string`             | 否   | 指示器旁的文字；默认插槽优先。              |
| `direction` | `MqLoadingDirection` | 否   | 文字与指示器的排列方向。                    |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-loading/` 为准。

### 导出类型

`MqLoadingType`、`MqLoadingDirection`、`MqLoadingProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
