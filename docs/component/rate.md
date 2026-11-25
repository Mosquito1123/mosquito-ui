<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqRate `mq-rate`

文字星号评分，可半星、可再点清空

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-rate>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-rate />
```

## API

### Props

| 名称          | 类型               | 必填 | 说明                            |
| ------------- | ------------------ | ---- | ------------------------------- |
| `modelValue`  | `number`           | 否   | —                               |
| `num`         | `number`           | 否   | 星星个数。非法或小于 1 时按 5。 |
| `readonly`    | `boolean`          | 否   | —                               |
| `disabled`    | `boolean`          | 否   | —                               |
| `size`        | `string \| number` | 否   | 字号，像素。                    |
| `space`       | `string \| number` | 否   | 星星间距，像素。                |
| `color`       | `string`           | 否   | 未点亮的颜色。                  |
| `activeColor` | `string`           | 否   | —                               |
| `allowHalf`   | `boolean`          | 否   | —                               |
| `clearable`   | `boolean`          | 否   | 再点一次当前值时回到 0。        |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `change` | `[payload: { value: number }]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-rate/` 为准。

### 导出类型

`MqRateProps`、`MqRateEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
