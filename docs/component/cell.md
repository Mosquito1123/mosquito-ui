<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCell `mq-cell`

`title` / `value` / `label` / `is-link` / `clickable` / `disabled` / `required`。右侧可放插槽

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-cell>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-cell />
```

## API

### Props

| 名称          | 类型                       | 必填 | 说明                                                              |
| ------------- | -------------------------- | ---- | ----------------------------------------------------------------- |
| `title`       | `string`                   | 否   | —                                                                 |
| `value`       | `string \| number \| null` | 否   | 右侧说明。数字 `0` 会显示；`null`、`undefined` 和空字符串不显示。 |
| `label`       | `string`                   | 否   | 标题下方的一行说明。                                              |
| `placeholder` | `string`                   | 否   | `value` 为空时显示的占位。                                        |
| `isLink`      | `boolean`                  | 否   | 显示箭头，并把根节点暴露成按钮。                                  |
| `clickable`   | `boolean`                  | 否   | 没有箭头也显示按压态，并把根节点暴露成按钮。                      |
| `disabled`    | `boolean`                  | 否   | 不发出 `click`，也不显示按压态。                                  |
| `required`    | `boolean`                  | 否   | 标题前显示必填星号。                                              |
| `border`      | `boolean`                  | 否   | 底部分割线。                                                      |
| `ellipsis`    | `boolean`                  | 否   | 右侧说明过长时省略。                                              |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `click` | `[event: Event]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-cell/` 为准。

### 导出类型

`MqCellProps`、`MqCellEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
