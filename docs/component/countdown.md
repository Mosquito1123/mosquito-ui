<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCountdown `mq-countdown`

倒计时。暴露 `start` / `pause` / `reset`

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-countdown>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-countdown />
```

## API

### Props

| 名称          | 类型      | 必填 | 说明                 |
| ------------- | --------- | ---- | -------------------- |
| `time`        | `number`  | 否   | 倒计时总时长，毫秒。 |
| `format`      | `string`  | 否   | —                    |
| `autoStart`   | `boolean` | 否   | —                    |
| `millisecond` | `boolean` | 否   | —                    |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[current: MqTimeData]` | — |
| `finish` | `[]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-countdown/` 为准。

### 导出类型

`MqCountdownProps`、`MqCountdownEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
