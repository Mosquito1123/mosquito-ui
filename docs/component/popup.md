<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqPopup `mq-popup`

`v-model` 受控显隐，五方位 `position`，`modal` / `closable`，`click-modal` 与过渡阶段事件

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-popup>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-popup />
```

## API

### Props

| 名称           | 类型              | 必填 | 说明                                             |
| -------------- | ----------------- | ---- | ------------------------------------------------ |
| `modelValue`   | `boolean`         | 否   | 受控显隐，配合 `v-model`。                       |
| `position`     | `MqPopupPosition` | 否   | —                                                |
| `modal`        | `boolean`         | 否   | 是否渲染遮罩。为 `false` 时不渲染遮罩节点。      |
| `closable`     | `boolean`         | 否   | 是否在面板内显示文字关闭按钮。                   |
| `maskClosable` | `boolean`         | 否   | 点击遮罩是否关闭。为 `false` 时 Esc 同样不关闭。 |
| `duration`     | `number`          | 否   | 过渡时长，毫秒。非法或负数时按 200。             |
| `zIndex`       | `number`          | 否   | 覆盖根节点 `z-index`，默认走 `--mq-z-popup`。    |
| `title`        | `string`          | 否   | 对话框的无障碍名称，不额外渲染节点。             |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `open` | `[]` | `modelValue` 变为 `true` 时发出。 |
| `close` | `[]` | `modelValue` 从打开变为关闭时发出，包含遮罩、Esc 和外部改值。 |
| `enter` | `[]` | 进场动画各阶段。 |
| `leave` | `[]` | 离场动画各阶段。 |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-popup/` 为准。

### 导出类型

`MqPopupPosition`、`MqPopupProps`、`MqPopupEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
