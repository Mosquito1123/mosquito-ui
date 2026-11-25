<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqRollingNumber `mq-rolling-number`

数字滚动，逐位数字列滚动并可保留小数与千分位

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-rolling-number>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-rolling-number />
```

## API

### Props

| 名称        | 类型               | 必填 | 说明                                 |
| ----------- | ------------------ | ---- | ------------------------------------ |
| `value`     | `number \| string` | 否   | —                                    |
| `decimals`  | `number`           | 否   | 小数位，0~6。                        |
| `separator` | `string`           | 否   | 千分位分隔符，传空字符串关闭。       |
| `prefix`    | `string`           | 否   | —                                    |
| `suffix`    | `string`           | 否   | —                                    |
| `height`    | `number`           | 否   | 单个数字的高度（px），同时决定字号。 |
| `duration`  | `number`           | 否   | 滚动动画时长（ms）。                 |
| `color`     | `string`           | 否   | 数字颜色。                           |
| `autoplay`  | `boolean`          | 否   | 首次挂载时从 0 滚到目标值。          |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-rolling-number/` 为准。

### 导出类型

`MqRollingNumberProps`、`MqRollingNumberEmits`、`MqRollingNumberExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
