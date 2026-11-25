# MqSwiper 轮播

基于平台 `swiper` 的轮播组件，支持纵向、自绘指示点、前后露出间距与自定义插槽。与 `mq-banner` 相比，这里更贴近 wot-ui swiper 的用法，列表元素可以是字符串或 `{ url, title }`。

## 何时使用

- 需要横向或纵向的图片轮播，且要自己控制当前下标。
- 需要指示器、前后留白（一屏多张）或用插槽自定义每一帧的内容。

## 示例

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)
const list = [{ url: '/a.png', title: '第一张' }, { url: '/b.png', title: '第二张' }, '/c.png']
</script>

<template>
  <mq-swiper
    v-model="current"
    :list="list"
    height="180px"
    autoplay
    :interval="3000"
    circular
    indicator
    indicator-color="rgba(255, 255, 255, 0.5)"
    indicator-active-color="#0f3d32"
    :previous-margin="12"
    :next-margin="12"
    @click="({ index }) => console.log(index)"
  />
</template>
```

字符串元素会规范化为 `{ url: 字符串, title: '' }`。需要自定义内容时，用默认插槽并读取 `item`、`index`：

```vue
<mq-swiper :list="list">
  <template #default="{ item, index }">
    <view>{{ index }} - {{ item.url }}</view>
  </template>
</mq-swiper>
```

## API

### Props

| 参数                     | 类型                         | 默认值                       | 说明                         |
| ------------------------ | ---------------------------- | ---------------------------- | ---------------------------- |
| `list`                   | `(string \| MqSwiperItem)[]` | `[]`                         | 图片地址或 `{ url, title }`  |
| `v-model`                | `number`                     | `0`                          | 当前下标，越界会夹到合法范围 |
| `autoplay`               | `boolean`                    | `false`                      | 是否自动播放                 |
| `interval`               | `number`                     | `3000`                       | 自动播放间隔（ms）           |
| `duration`               | `number`                     | `300`                        | 切换动画时长（ms）           |
| `circular`               | `boolean`                    | `false`                      | 是否首尾衔接                 |
| `vertical`               | `boolean`                    | `false`                      | 是否纵向轮播                 |
| `indicator`              | `boolean`                    | `true`                       | 是否显示自绘指示点           |
| `indicator-color`        | `string`                     | `'rgba(255, 255, 255, 0.5)'` | 普通指示点颜色               |
| `indicator-active-color` | `string`                     | `'#ffffff'`                  | 当前指示点颜色               |
| `height`                 | `number \| string`           | `160`                        | 高度，数字按 px 处理         |
| `previous-margin`        | `number \| string`           | `undefined`                  | 左侧露出宽度，数字按 px 处理 |
| `next-margin`            | `number \| string`           | `undefined`                  | 右侧露出宽度，数字按 px 处理 |

### Events

| 事件                | 参数              | 说明                                      |
| ------------------- | ----------------- | ----------------------------------------- |
| `update:modelValue` | `number`          | 当前下标变化                              |
| `change`            | `{ index, item }` | 切换完成，`item` 是 `list` 中的原始元素   |
| `click`             | `{ index, item }` | 点击某一帧，`item` 是 `list` 中的原始元素 |
| `transition`        | `{ dx, dy }`      | 平台 `swiper` 的过渡事件                  |

### Methods

| 方法              | 说明                                               |
| ----------------- | -------------------------------------------------- |
| `switchTo(index)` | 切换到指定下标，越界会被夹住；同一位置不重复发事件 |

### Slots

| 插槽      | 参数              | 说明                                           |
| --------- | ----------------- | ---------------------------------------------- |
| `default` | `{ item, index }` | 自定义每一帧内容，提供后不再渲染默认图片与标题 |

## 主题变量

| 变量                  | 默认值    | 用途               |
| --------------------- | --------- | ------------------ |
| `--mq-fill`           | `#f3efe7` | 容器背景           |
| `--mq-text-secondary` | `#6f675e` | 未使用的预留文字色 |

指示点颜色由 `indicator-color` / `indicator-active-color` props 控制，不读取 CSS 变量。
