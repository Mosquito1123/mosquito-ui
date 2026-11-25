<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqSlideVerify `mq-slide-verify`

滑动验证，阈值可调，支持受控和重置

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-slide-verify>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-slide-verify />
```

## API

### Props

| 名称          | 类型      | 必填 | 说明                      |
| ------------- | --------- | ---- | ------------------------- |
| `modelValue`  | `boolean` | 否   | 是否已通过验证。          |
| `text`        | `string`  | 否   | —                         |
| `successText` | `string`  | 否   | —                         |
| `disabled`    | `boolean` | 否   | —                         |
| `threshold`   | `number`  | 否   | 通过阈值，0~1，默认 0.9。 |
| `height`      | `number`  | 否   | 轨道高度，也是滑块直径。  |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-slide-verify/` 为准。

### 导出类型

`MqSlideVerifyProps`、`MqSlideVerifyChangePayload`、`MqSlideVerifyEmits`、`MqSlideVerifyExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
