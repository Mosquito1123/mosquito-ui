<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqCalendar `mq-calendar`

日历：单选、区间、多选，支持最小/最大日期

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-calendar>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-calendar />
```

## API

### Props

| 名称             | 类型                        | 必填 | 说明                                                        |
| ---------------- | --------------------------- | ---- | ----------------------------------------------------------- |
| `modelValue`     | `string \| string[]`        | 否   | 单选为日期字符串，区间和多选为日期数组。格式 `YYYY-MM-DD`。 |
| `mode`           | `MqCalendarMode`            | 否   | —                                                           |
| `minDate`        | `string`                    | 否   | 可选最小日期。                                              |
| `maxDate`        | `string`                    | 否   | 可选最大日期。                                              |
| `firstDayOfWeek` | `0 \| 1`                    | 否   | 一周从周日还是周一开始。                                    |
| `showConfirm`    | `boolean`                   | 否   | 是否显示底部确定按钮。                                      |
| `showClear`      | `boolean`                   | 否   | —                                                           |
| `confirmText`    | `string`                    | 否   | —                                                           |
| `clearText`      | `string`                    | 否   | —                                                           |
| `disabledDate`   | `(date: string) => boolean` | 否   | 额外禁用某些日期。                                          |
| `month`          | `string`                    | 否   | 初始展示月份，`YYYY-MM` 或 `YYYY-MM-DD`。                   |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: MqCalendarValuePayload]` | — |
| `confirm` | `[payload: MqCalendarValuePayload]` | — |
| `monthChange` | `[payload: { year: number` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-calendar/` 为准。

### 导出类型

`MqCalendarValuePayload`、`MqCalendarProps`、`MqCalendarEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
