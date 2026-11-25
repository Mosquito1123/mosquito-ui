# MqCalendarView 内联日历

可滚动的内联日历面板，日期、区间和日期时间共用一个组件。与弹窗形态的 `mq-calendar` 不同，本组件直接占页面空间，常作为筛选面板或表单里的日期区域。

## 何时使用

- 页面里需要常驻日历，而不是点击后弹出。
- 需要区间选择、最大可选天数或禁止同日起止。
- 需要在面板重新显示后把选中月份滚回视野。

## 用法示例

```vue
<mq-calendar-view v-model="date" type="date" :panel-height="320" />

<mq-calendar-view
  v-model="range"
  type="daterange"
  :max-range="7"
  :allow-same-day="false"
  :disabled-date="(date) => date.endsWith('-01')"
/>

<mq-calendar-view v-model="dateTime" type="datetime" default-time="09:30:00" />
```

## API

### Props

| 名称                  | 类型                                                     | 默认值       | 说明                                                                             |
| --------------------- | -------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `modelValue`          | `string \| string[] \| null`                             | `''`         | 单值为 `YYYY-MM-DD`，区间为长度 2 的数组；带时间的类型接受 `YYYY-MM-DD HH:mm:ss` |
| `month`               | `string`                                                 | `''`         | 初始展示月份，未传时取选中日期或今天                                             |
| `type`                | `'date' \| 'daterange' \| 'datetime' \| 'datetimerange'` | `'date'`     | 选择类型                                                                         |
| `minDate` / `maxDate` | `string`                                                 | `''`         | 可选范围                                                                         |
| `disabledDate`        | `(date: string) => boolean`                              | —            | 返回 `true` 时该日不可选                                                         |
| `maxRange`            | `number`                                                 | —            | 区间最多可选天数（含首尾）                                                       |
| `allowSameDay`        | `boolean`                                                | `false`      | 是否允许起止为同一天                                                             |
| `showPanelTitle`      | `boolean`                                                | `true`       | 是否展示月份标题                                                                 |
| `defaultTime`         | `string \| string[]`                                     | `'00:00:00'` | 带时间类型使用的日内时刻；区间可用数组分别指定起止                               |
| `panelHeight`         | `number`                                                 | —            | 滚动面板最大高度，像素                                                           |
| `firstDayOfWeek`      | `0 \| 1`                                                 | `0`          | 周日或周一作为一周起点                                                           |

### Events

| 名称                | 参数                        | 说明                         |
| ------------------- | --------------------------- | ---------------------------- |
| `update:modelValue` | `value: string \| string[]` | 选中值变化，区间始终返回数组 |
| `change`            | `{ value }`                 | 同上，带 `value` 字段        |

### Slots

无。

### Methods

| 名称             | 说明                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `scrollIntoView` | 面板从隐藏切换到展示后调用，把选中月份滚回视野；无布局信息时安全跳过 |

## 主题变量

选中态用 `--mq-color-primary`，文字与背景用 `--mq-text`、`--mq-text-secondary`、`--mq-bg`，清单见[主题令牌](/guide/theme-vars)。
