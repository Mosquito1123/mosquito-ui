<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqFab `mq-fab`

悬浮按钮，文字 `+` / `×` 触发

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-fab>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-fab />
```

## API

### Props

| 名称           | 类型             | 必填 | 说明                       |
| -------------- | ---------------- | ---- | -------------------------- |
| `active`       | `boolean`        | 否   | —                          |
| `type`         | `MqFabType`      | 否   | —                          |
| `position`     | `MqFabPosition`  | 否   | —                          |
| `direction`    | `MqFabDirection` | 否   | —                          |
| `disabled`     | `boolean`        | 否   | —                          |
| `expandable`   | `boolean`        | 否   | —                          |
| `inactiveMark` | `string`         | 否   | 收起时的文字标记，默认 +。 |
| `activeMark`   | `string`         | 否   | 展开时的文字标记，默认 ×。 |
| `zIndex`       | `number`         | 否   | —                          |
| `gap`          | `number`         | 否   | —                          |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-fab/` 为准。

### 导出类型

`MqFabType`、`MqFabPosition`、`MqFabDirection`、`MqFabProps`、`MqFabEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
