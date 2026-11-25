<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqTimelineItem `mq-timeline-item`

面向 uni-app（Vue 3）的轻量组件。

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-timeline-item>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-timeline-item />
```

## API

### Props

| 名称        | 类型      | 必填 | 说明                                                   |
| ----------- | --------- | ---- | ------------------------------------------------------ |
| `title`     | `string`  | 否   | —                                                      |
| `time`      | `string`  | 否   | —                                                      |
| `active`    | `boolean` | 否   | 高亮当前节点。                                         |
| `color`     | `string`  | 否   | 节点颜色，默认主题主色。                               |
| `lineColor` | `string`  | 否   | 连接线颜色。                                           |
| `hideLine`  | `boolean` | 否   | 隐藏该节点下方的连接线（最后一项一般由样式自动隐藏）。 |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-timeline-item/` 为准。

### 导出类型

`MqTimelineItemProps`、`MqTimelineItemEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
