# MqRichText 富文本

用递归节点数组渲染富文本，不使用 `v-html`，不解析 HTML 字符串。

## 何时使用

- 后端返回结构化富文本节点，需要安全地渲染到页面。
- 需要控制文本可选中行为，并在点击时拿到对应节点。

## 示例

```vue
<script setup lang="ts">
import MqRichText from '@mosquito/ui/components/mq-rich-text/MqRichText.vue'

const nodes = [
  { type: 'h2', text: '标题' },
  {
    type: 'p',
    children: [
      { type: 'text', text: '正文，' },
      { type: 'a', attrs: { href: 'https://example.com' }, children: '链接' },
    ],
  },
  { type: 'img', attrs: { src: '/cover.png' } },
]

function onClick(payload: { node: unknown; event: Event }) {
  console.log(payload.node)
}
</script>

<template>
  <MqRichText :nodes="nodes" selectable @click="onClick" />
</template>
```

`nodes` 也可以是纯字符串，此时渲染为单个文本节点。

## API

### Props

| 名称         | 类型                         | 默认值  | 说明                     |
| ------------ | ---------------------------- | ------- | ------------------------ |
| `nodes`      | `string \| MqRichTextNode[]` | `[]`    | 文本内容或递归节点数组。 |
| `userSelect` | `boolean`                    | `false` | 允许用户选中文本。       |
| `selectable` | `boolean`                    | `false` | 语义同 `user-select`。   |

`MqRichTextNode` 结构：

| 字段       | 类型                                                       | 说明                                                                                                                        |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `type`     | `MqRichTextTag \| string`                                  | `text`、`p`、`div`、`span`、`a`、`img`、`br`、`strong`、`em`、`b`、`i`、`h1`～`h6`、`ul`、`ol`、`li`。未知值回退为 `span`。 |
| `node`     | `MqRichTextTag \| string`                                  | `type` 的别名。                                                                                                             |
| `text`     | `string`                                                   | 文本内容。                                                                                                                  |
| `attrs`    | `Record<string, string \| number \| boolean \| undefined>` | 渲染元素上的属性（如 `src`、`href`、`class`）。                                                                             |
| `children` | `MqRichTextNode[] \| string`                               | 子节点；字符串转成文本节点。                                                                                                |

### Events

| 名称    | 参数                                                | 说明                                                                  |
| ------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `click` | `(payload: { node: MqRichTextNode; event: Event })` | 点击节点时触发，`stopPropagation` 避免父子节点重复触发；`br` 不触发。 |

### Methods

无。

### Slots

无。

## 主题变量

| 变量                 | 默认值    | 说明       |
| -------------------- | --------- | ---------- |
| `--mq-text`          | `#1c1915` | 正文颜色。 |
| `--mq-font-size`     | `14px`    | 正文字号。 |
| `--mq-color-primary` | `#0f3d32` | 链接颜色。 |
