<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqBadge `mq-badge`

数字、上限、红点。`0` 默认不显示

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-badge>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-badge />
```

## API

### Props

| 名称       | 类型                       | 必填 | 说明                              |
| ---------- | -------------------------- | ---- | --------------------------------- |
| `value`    | `string \| number \| null` | 否   | —                                 |
| `max`      | `number`                   | 否   | 超过后显示 `max+`。只对数字生效。 |
| `isDot`    | `boolean`                  | 否   | 不显示数字，只显示一个点。        |
| `showZero` | `boolean`                  | 否   | `value` 为 0 时仍然显示。         |
| `hidden`   | `boolean`                  | 否   | —                                 |
| `type`     | `MqBadgeType`              | 否   | —                                 |
| `bgColor`  | `string`                   | 否   | —                                 |
| `shape`    | `MqBadgeShape`             | 否   | —                                 |
| `border`   | `boolean`                  | 否   | 给徽标加一圈页面底色。            |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-badge/` 为准。

### 导出类型

`MqBadgeType`、`MqBadgeShape`、`MqBadgeProps`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
