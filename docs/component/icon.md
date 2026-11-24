# MqIcon 图标

不依赖图标字体，用内置 unicode 字形表渲染图标；也支持自定义插槽内容。

## 何时使用

- 需要在按钮、单元格、提示等位置放一个小图标。
- 希望用极少的节点和零字体资源完成常见图标展示。

## 示例

```vue
<script setup lang="ts">
import MqIcon from '@mosquito/ui/components/mq-icon/MqIcon.vue'
</script>

<template>
  <MqIcon name="add" :size="20" />
  <MqIcon name="arrow-right" color="#0f3d32" bold />
  <MqIcon name="star">
    <text>自定义</text>
  </MqIcon>
</template>
```

`name` 的类型为导出的 `MqIconName` 联合类型（也接受任意字符串，未知名称回退为 `name` 的首字符，空名渲染为空）。

## API

### Props

| 名称    | 类型                   | 默认值  | 说明                                                                                                                                                                                                                                                                                                   |
| ------- | ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`  | `MqIconName \| string` | `''`    | 图标名。内置：`add`、`close`、`arrow-left`、`arrow-right`、`arrow-down`、`arrow-up`、`check`、`search`、`star`、`heart`、`refresh`、`more`、`info`、`success`、`warning`、`error`、`camera`、`image`、`location`、`phone`、`shop`、`user`、`delete`、`edit`、`chat`、`clock`、`gift`。未知名取首字符。 |
| `size`  | `string \| number`     | `16`    | 字号，数字按 px，字符串原样使用。                                                                                                                                                                                                                                                                      |
| `color` | `string`               | `''`    | 图标颜色，空值继承主题色。                                                                                                                                                                                                                                                                             |
| `bold`  | `boolean`              | `false` | 字形加粗。                                                                                                                                                                                                                                                                                             |
| `block` | `boolean`              | `false` | 块级显示并撑满父级宽度。                                                                                                                                                                                                                                                                               |

### Events

| 名称    | 参数             | 说明             |
| ------- | ---------------- | ---------------- |
| `click` | `(event: Event)` | 点击图标时触发。 |

### Methods

无。

### Slots

| 名称      | 说明                                             |
| --------- | ------------------------------------------------ |
| `default` | 自定义图标内容。存在时优先于 `name` 对应的字形。 |

## 主题变量

| 变量              | 默认值                    | 说明                                   |
| ----------------- | ------------------------- | -------------------------------------- |
| `--mq-icon-color` | `var(--mq-text, #1c1915)` | 默认图标颜色，可被 `color` prop 覆盖。 |
| `--mq-text`       | `#1c1915`                 | 兜底文字色。                           |
