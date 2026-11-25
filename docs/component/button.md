<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqButton `mq-button`

`type` / `variant` / `size` / `round` / `block` / `disabled` / `loading`。禁用和加载中不发出 `click`；`variant` 支持 `dashed` / `soft` / `subtle`，`hairline` 细分边框

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-button>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-button />
```

## API

### Props

| 名称       | 类型              | 必填 | 说明                                                                                  |
| ---------- | ----------------- | ---- | ------------------------------------------------------------------------------------- |
| `type`     | `MqButtonType`    | 否   | `default` \| `primary` \| `success` \| `warning` \| `danger`                          |
| `variant`  | `MqButtonVariant` | 否   | `base` 实心，`plain` 镂空，`text` 无边框，`dashed` 虚线，`soft` 浅底，`subtle` 弱化。 |
| `size`     | `MqButtonSize`    | 否   | `mini` \| `small` \| `medium` \| `large`                                              |
| `round`    | `boolean`         | 否   | 胶囊圆角。                                                                            |
| `block`    | `boolean`         | 否   | 撑满父级宽度。                                                                        |
| `disabled` | `boolean`         | 否   | 不可点，不发出 `click`。                                                              |
| `loading`  | `boolean`         | 否   | 进行中。不发出 `click`，并带 `aria-busy`。不额外加节点。                              |
| `hairline` | `boolean`         | 否   | 叠加一条 1px 细描边，适合无边框变体。                                                 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `click` | `[event: Event]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-button/` 为准。

### 导出类型

`MqButtonType`、`MqButtonVariant`、`MqButtonSize`、`MqButtonProps`、`MqButtonEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
