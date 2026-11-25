<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqActionSheet `mq-action-sheet`

底部动作列表，复用弹出层。`select` 为 `{ item, index }`；支持 `cancel`、`close-on-click-action`、加载中选项

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-action-sheet>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-action-sheet />
```

## API

### Props

| 名称                 | 类型                  | 必填 | 说明                       |
| -------------------- | --------------------- | ---- | -------------------------- |
| `modelValue`         | `boolean`             | 否   | —                          |
| `actions`            | `MqActionSheetItem[]` | 否   | —                          |
| `title`              | `string`              | 否   | —                          |
| `cancelText`         | `string`              | 否   | 传空字符串则不显示取消。   |
| `closeOnClickAction` | `boolean`             | 否   | 选中操作项后是否自动关闭。 |
| `maskClosable`       | `boolean`             | 否   | —                          |
| `duration`           | `number`              | 否   | —                          |
| `zIndex`             | `number`              | 否   | —                          |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `select` | `[payload: { item: MqActionSheetItem` | — |
| `cancel` | `[]` | — |
| `close` | `[]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-action-sheet/` 为准。

### 导出类型

`MqActionSheetItem`、`MqActionSheetProps`、`MqActionSheetEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
