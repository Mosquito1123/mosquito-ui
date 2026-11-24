---
layout: home

hero:
  name: mosquito-ui
  text: 轻量 uni-app 组件库
  tagline: 前缀 mq-，单根节点、CSS 变量、少节点少计算
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/getting-started
    - theme: alt
      text: 安装
      link: /guide/installation
    - theme: alt
      text: 浏览组件
      link: /component/button

features:
  - title: uni-app 优先
    details: 先服务 uni-app（Vue 3）运行时。目录和文档按 uni-app x 预留，但 .uvue 目前只是占位。
  - title: 主题走 CSS 变量
    details: 颜色、圆角、字号、层级统一使用 --mq-* 令牌，亮色 / 暗色在 styles/variables.scss 里拆分。
  - title: 按需引入
    details: easycom 指向组件目录下的 .vue 文件，命令式反馈用 showToast / showNotify，不额外创建实例树。
---

## 定位

`@mosquito/ui` 面向 **uni-app（Vue 3）**：组件前缀 `mq-`，尽量单根节点，弹出层关闭后卸载，不引入图标字体，标记和箭头用文字或符号。它不是其他组件库的分支，主题令牌和 DOM 结构都重新设计过。

## 安装

```bash
pnpm add @mosquito/ui
```

在 `App.vue` 里引入一次主题变量：

```scss
@import '@mosquito/ui/styles/index.scss';
```

完整步骤见 [安装](/guide/installation) 和 [开始使用](/guide/getting-started)。

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@mosquito/ui'

const visible = ref(false)
</script>

<template>
  <mq-cell title="说明" value="打开" is-link @click="visible = true" />
  <mq-button type="primary" block @click="showToast('已保存')">保存</mq-button>
  <mq-popup v-model="visible" position="bottom">
    <mq-button block @click="visible = false">关闭</mq-button>
  </mq-popup>
  <mq-toast />
</template>
```

## 组件数量

当前有 **111 个组件**，按基础、表单、反馈、展示、导航和其他六类组织；完整列表见左侧组件分组。组合式用法见 [组合式函数](/guide/composables)。
