<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSwipeAction `mq-swipe-action`

左右滑动操作，`closeSwipeActions()` 可统一收起

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-swipe-action>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-swipe-action />
```

## API

### Props

| 名称          | 类型                       | 必填 | 说明                                        |
| ------------- | -------------------------- | ---- | ------------------------------------------- |
| `modelValue`  | `MqSwipeActionStatus`      | 否   | —                                           |
| `disabled`    | `boolean`                  | 否   | —                                           |
| `beforeClose` | `MqSwipeActionBeforeClose` | 否   | —                                           |
| `leftWidth`   | `number`                   | 否   | 左侧操作区宽度。未传时按内容估算，默认 76。 |
| `rightWidth`  | `number`                   | 否   | 右侧操作区宽度。未传时按内容估算，默认 76。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-swipe-action/` 为准。

### 导出类型

`MqSwipeActionStatus`、`MqSwipeActionReason`、`MqSwipeActionPosition`、`MqSwipeActionBeforeClose`、`MqSwipeActionProps`、`MqSwipeActionEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
