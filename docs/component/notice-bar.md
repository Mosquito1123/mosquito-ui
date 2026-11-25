<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqNoticeBar `mq-notice-bar`

通告。`info` 走主色，可关闭，需要时才滚动

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-notice-bar>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-notice-bar />
```

## API

### Props

| 名称         | 类型              | 必填 | 说明                                            |
| ------------ | ----------------- | ---- | ----------------------------------------------- |
| `text`       | `string`          | 否   | —                                               |
| `type`       | `MqNoticeBarType` | 否   | `info` 使用主色和弱底，主题里没有单独的信息色。 |
| `closable`   | `boolean`         | 否   | —                                               |
| `scrollable` | `boolean`         | 否   | 为 true 且未换行时，用 CSS 跑马灯滚动。         |
| `wrapable`   | `boolean`         | 否   | —                                               |
| `color`      | `string`          | 否   | —                                               |
| `background` | `string`          | 否   | —                                               |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `click` | `[]` | — |
| `close` | `[]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-notice-bar/` 为准。

### 导出类型

`MqNoticeBarType`、`MqNoticeBarProps`、`MqNoticeBarEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
