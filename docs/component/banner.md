<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqBanner `mq-banner`

轮播图，支持自动播放、指示点和标题叠加

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-banner>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-banner />
```

## API

### Props

| 名称                   | 类型               | 必填 | 说明                       |
| ---------------------- | ------------------ | ---- | -------------------------- |
| `data`                 | `MqBannerItem[]`   | 否   | —                          |
| `modelValue`           | `number`           | 否   | 当前下标，配合 `v-model`。 |
| `height`               | `number \| string` | 否   | 高度，数字按 px 处理。     |
| `autoplay`             | `boolean`          | 否   | —                          |
| `interval`             | `number`           | 否   | 自动切换间隔（ms）。       |
| `duration`             | `number`           | 否   | 切换动画时长（ms）。       |
| `circular`             | `boolean`          | 否   | —                          |
| `indicator`            | `boolean`          | 否   | —                          |
| `indicatorColor`       | `string`           | 否   | —                          |
| `activeIndicatorColor` | `string`           | 否   | —                          |
| `radius`               | `number \| string` | 否   | 圆角，数字按 px 处理。     |
| `showTitle`            | `boolean`          | 否   | 是否在图片上叠加标题。     |

### Events

该组件没有声明事件。

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-banner/` 为准。

### 导出类型

`MqBannerItem`、`MqBannerProps`、`MqBannerChangePayload`、`MqBannerEmits`、`MqBannerExpose`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
