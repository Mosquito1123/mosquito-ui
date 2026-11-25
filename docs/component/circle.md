<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCircle `mq-circle`

环形进度（SVG）

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-circle>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-circle />
```

## API

### Props

| 名称            | 类型              | 必填 | 说明                                  |
| --------------- | ----------------- | ---- | ------------------------------------- |
| `modelValue`    | `number`          | 否   | —                                     |
| `size`          | `number`          | 否   | —                                     |
| `color`         | `MqCircleColor`   | 否   | —                                     |
| `layerColor`    | `string`          | 否   | —                                     |
| `fill`          | `string`          | 否   | —                                     |
| `speed`         | `number`          | 否   | 动画速度，单位 rate/s。0 表示不动画。 |
| `text`          | `string`          | 否   | —                                     |
| `strokeWidth`   | `number`          | 否   | —                                     |
| `strokeLinecap` | `MqCircleLinecap` | 否   | —                                     |
| `clockwise`     | `boolean`         | 否   | —                                     |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-circle/` 为准。

### 导出类型

`MqCircleColor`、`MqCircleLinecap`、`MqCircleProps`、`MqCircleEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
