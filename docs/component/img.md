<!-- 由 scripts/build-component-docs.mjs 生成 -->

# MqImg `mq-img`

图片：宽高比、圆角、懒加载、加载中与失败插槽

## 何时使用

在 uni-app（Vue 3）模板中直接使用 `<mq-img>`，按需传入下方 API 中的属性。样式走 `--mq-*` CSS 变量，easycom 映射请指向同目录的 `.vue` 文件。

## 示例

```vue
<mq-img />
```

## API

### Props

| 名称          | 类型               | 必填 | 说明                                          |
| ------------- | ------------------ | ---- | --------------------------------------------- |
| `src`         | `string`           | 否   | 图片地址。为空或加载失败时进入占位态。        |
| `width`       | `string \| number` | 否   | 宽。数字按 px，字符串原样使用。默认 `100%`。  |
| `height`      | `string \| number` | 否   | 高。数字按 px，字符串原样使用。默认 `180px`。 |
| `mode`        | `string`           | 否   | 同 uni-app `image` 的 `mode`。                |
| `radius`      | `string \| number` | 否   | 圆角。数字按 px，字符串原样使用。             |
| `round`       | `boolean`          | 否   | 胶囊圆角。                                    |
| `lazyLoad`    | `boolean`          | 否   | —                                             |
| `showLoading` | `boolean`          | 否   | 加载中是否显示遮罩。                          |
| `alt`         | `string`           | 否   | 加载失败时的文字。                            |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- | --- |
| `click` | `[event: Event]` | — |
| `load` | `[event: Event]` | — |
| `error` | `[event: Event]` | — |

### 插槽与方法

插槽和暴露方法以组件源码 `packages/ui/src/components/mq-img/` 为准。

### 导出类型

`MqImgProps`、`MqImgEmits`。

## 主题变量

颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。
