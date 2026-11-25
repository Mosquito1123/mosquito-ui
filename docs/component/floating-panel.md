<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqFloatingPanel `mq-floating-panel`

可拖动吸附的底部浮动面板

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-floating-panel>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-floating-panel />
```

## API

### Props

| 名称               | 类型       | 必填 | 说明                                               |
| ------------------ | ---------- | ---- | -------------------------------------------------- |
| `height`           | `number`   | 否   | 当前面板高度，配合 `v-model:height`。              |
| `anchors`          | `number[]` | 否   | 可停靠的锚点高度（px）。默认 `[100, 屏高 * 0.6]`。 |
| `duration`         | `number`   | 否   | 吸附动画时长，`0` 表示关闭动画。                   |
| `contentDraggable` | `boolean`  | 否   | 允许在内容区拖动面板。                             |
| `safeArea`         | `boolean`  | 否   | —                                                  |
| `showScrollbar`    | `boolean`  | 否   | —                                                  |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-floating-panel/` 为准。

### 导出类型

`MqFloatingPanelProps`、`MqFloatingPanelEmits`、`MqFloatingPanelExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
