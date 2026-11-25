# MqStatusTip 缺省提示

兜底占位展示：搜索无结果、网络异常、暂无内容等。内置形态用文字符号和 CSS 画出，不引入图标字体，也不依赖外链图片。

## 何时使用

- 列表、搜索、收藏等场景没有数据时占位。
- 需要把操作按钮放在提示文案下方。
- 需要展示自定义图片，而不想引入 wot-ui 的外链资源。

## 用法示例

```vue
<mq-status-tip image="search" tip="当前搜索无结果" />
<mq-status-tip image="content" tip="暂无内容">
  <template #bottom>
    <mq-button size="small" @click="reload">重新加载</mq-button>
  </template>
</mq-status-tip>
<mq-status-tip image="/assets/panda.png" image-mode="widthFix" tip="自定义图片" />
```

## API

### Props

| 名称        | 类型                                                                                            | 默认值        | 说明                                                |
| ----------- | ----------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------- |
| `image`     | `'search' \| 'network' \| 'content' \| 'collect' \| 'comment' \| 'halo' \| 'message' \| string` | `'network'`   | 内置类型用文字符号；其他字符串按自定义图片 URL 处理 |
| `imageSize` | `string \| number \| { width?, height? }`                                                       | —             | 数字按 px，字符串按 CSS 尺寸                        |
| `tip`       | `string`                                                                                        | `''`          | 提示文案                                            |
| `imageMode` | `string`                                                                                        | `'aspectFit'` | 自定义图片的 `mode`                                 |
| `urlPrefix` | `string`                                                                                        | `''`          | 自定义图片 URL 前缀                                 |

### Events

无。

### Slots

| 名称      | 说明                                    |
| --------- | --------------------------------------- |
| `image`   | 自定义图片内容，优先级高于 `image` prop |
| `bottom`  | 提示下方的操作区                        |
| `default` | 同 `bottom`                             |

### Methods

无。

## 主题变量

颜色、圆角与字号走 `--mq-text-secondary`、`--mq-radius`、`--mq-font-size` 等 `--mq-*` 变量，清单见[主题令牌](/guide/theme-vars)。
