# MqRootPortal 根节点传送

把内容传送到页面根节点（默认 `body`）；在不支持 `document` 或无匹配目标的小程序环境中原位渲染。

## 何时使用

- 需要让浮层、遮罩脱离父级 `overflow` / `transform` 的影响。
- 希望同一组件在 H5 与小程序端都能安全运行，无需关心 `body` 是否存在。

## 示例

```vue
<script setup lang="ts">
import MqRootPortal from '@mosquito/ui/components/mq-root-portal/MqRootPortal.vue'
</script>

<template>
  <MqRootPortal>
    <view class="floating-panel">浮层内容</view>
  </MqRootPortal>

  <MqRootPortal to="#app-root" :disabled="false">
    <view>传送到自定义容器</view>
  </MqRootPortal>
</template>
```

## API

### Props

| 名称       | 类型      | 默认值   | 说明                                                                       |
| ---------- | --------- | -------- | -------------------------------------------------------------------------- |
| `to`       | `string`  | `'body'` | 传送目标选择器；空字符串按 `body` 处理。目标不存在或选择器非法时原位渲染。 |
| `disabled` | `boolean` | `false`  | 为 `true` 时关闭传送，原位渲染。                                           |

### Events

无。

### Methods

无。

### Slots

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 需要传送的内容。 |

## 主题变量

| 变量 | 默认值 | 说明                                                           |
| ---- | ------ | -------------------------------------------------------------- |
| 无   | —      | 原位渲染的根节点使用 `display: contents`，不引入额外主题变量。 |

> 目标可用性通过 `document.querySelector()` 判断，异常会被捕获，不会抛出。
