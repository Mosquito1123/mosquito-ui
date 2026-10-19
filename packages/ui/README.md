# @mosquito/ui

面向 uni-app Vue 3 的轻量组件。运行时少节点，主题走 `--mq-*`。用法和 uni-app x 路线的完整说明在仓库根目录 [README](../../README.md)。

```bash
pnpm add @mosquito/ui
```

在 `App.vue` 引入一次主题变量。不要写进 `uni.scss`，否则每个 scss 都会再注入一份。

```scss
@import '@mosquito/ui/styles/index.scss';
```

## pages.json / easycom

组件文件是帕斯卡形式，所以用自定义映射，并且**指向 `.vue`**：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^mq-button$": "@mosquito/ui/components/mq-button/MqButton.vue",
      "^mq-cell$": "@mosquito/ui/components/mq-cell/MqCell.vue",
      "^mq-popup$": "@mosquito/ui/components/mq-popup/MqPopup.vue",
      "^mq-toast$": "@mosquito/ui/components/mq-toast/MqToast.vue",
      "^mq-loading$": "@mosquito/ui/components/mq-loading/MqLoading.vue",
      "^mq-safe-bottom$": "@mosquito/ui/components/mq-safe-bottom/MqSafeBottom.vue",
      "^mq-cell-group$": "@mosquito/ui/components/mq-cell-group/MqCellGroup.vue",
      "^mq-switch$": "@mosquito/ui/components/mq-switch/MqSwitch.vue",
      "^mq-checkbox$": "@mosquito/ui/components/mq-checkbox/MqCheckbox.vue",
      "^mq-checkbox-group$": "@mosquito/ui/components/mq-checkbox-group/MqCheckboxGroup.vue",
      "^mq-radio$": "@mosquito/ui/components/mq-radio/MqRadio.vue",
      "^mq-radio-group$": "@mosquito/ui/components/mq-radio-group/MqRadioGroup.vue",
      "^mq-input$": "@mosquito/ui/components/mq-input/MqInput.vue",
      "^mq-tag$": "@mosquito/ui/components/mq-tag/MqTag.vue",
      "^mq-badge$": "@mosquito/ui/components/mq-badge/MqBadge.vue",
      "^mq-divider$": "@mosquito/ui/components/mq-divider/MqDivider.vue",
      "^mq-progress$": "@mosquito/ui/components/mq-progress/MqProgress.vue"
    }
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ]
}
```

若工具链不解析 `exports`，把路径改成 `node_modules/@mosquito/ui/src/components/mq-button/MqButton.vue`，其余组件同样换成对应文件名。

也可以手动导入：

```vue
<script setup lang="ts">
import { MqButton, showToast } from '@mosquito/ui'
</script>
```

`class` 和 `style` 会落到组件唯一的根节点上。

## 不要用占位 `.uvue` 打 uni-app x 包

每个组件目录同时有可用的 `.vue` 和同名 `.uvue` 占位。uni-app x 在同一目录里会优先编译 `.uvue`，占位文件会盖住 `.vue`。

占位只有注释和一个空壳根节点，不是实现。补完 x 端实现，或暂时移走这些 `.uvue` 之前，不要用这套源码做 uni-app x 构建。easycom 也不要指到 `.uvue`。

## 组件

| 组件 | 属性 | 事件 |
| --- | --- | --- |
| `mq-button` | `type` `variant` `size` `round` `block` `disabled` `loading` | `click`。禁用或加载中不发出 |
| `mq-cell` | `title` `value` `label` `placeholder` `is-link` `clickable` `disabled` `required` `border` `ellipsis` | `click`。禁用不发出。`value` 为 `0` 会显示 |
| `mq-cell-group` | `title` `value` `border` `insert` | 无 |
| `mq-switch` | `v-model` `active-value` `inactive-value` `active-color` `inactive-color` `size` `shape` `loading` `disabled` `before-change` | `change`，参数 `{ value }` |
| `mq-checkbox` | 单独用 `v-model`；组内用 `name`。`type` 为 `circle` / `square` / `button` | 单独使用时 `change` |
| `mq-checkbox-group` | `v-model` 数组，`min` `max` `direction` `disabled` | `change`，参数 `{ value }` |
| `mq-radio` | `value`，样式可从组继承 | 无。点选交给组 |
| `mq-radio-group` | `v-model` `type` `direction` `allow-uncheck` `disabled` | `change`，参数 `{ value }` |
| `mq-input` | `v-model` `type` `clearable` `show-password` `maxlength` `show-word-limit` `error` `compact` | `input` `focus` `blur` `clear` `confirm` |
| `mq-tag` | `type` `variant` `size` `round` `closable` `color` `bg-color` | `close` |
| `mq-badge` | `value` `max` `is-dot` `show-zero` `hidden` `type` | 无 |
| `mq-divider` | `content-position` `dashed` `vertical` `hairline` `color` | 无 |
| `mq-progress` | `percentage` `hide-text` `color` `status` | 无 |
| `mq-popup` | `v-model` `position` `mask-closable` `duration` `z-index` `title` | `update:modelValue` `open` `close` |
| `mq-toast` | 无。用 `showToast` / `hideToast` | 页面放一个 `<mq-toast />` 当宿主 |
| `mq-loading` | `size` `color` `label` | 无。根节点就是指示器 |
| `mq-safe-bottom` | `bg` | 无。见下方背景说明 |

`mq-button` 的 `type`：`default` | `primary` | `success` | `warning` | `danger`。`variant`：`base` | `plain` | `text`。`size`：`mini` | `small` | `medium` | `large`。

这些属性对齐的是 wot-ui 的用法，不是它的实现。没有图标字体，也没有 `wd-` 前缀。复选和单选的标记画在根节点上；输入框的清空和密码切换用文字，不嵌按钮组件。

```vue
<mq-cell-group title="配送" insert border>
  <mq-cell title="称呼" required>
    <mq-input v-model="name" compact placeholder="怎么称呼" clearable />
  </mq-cell>
  <mq-cell title="通知">
    <mq-switch v-model="on" />
  </mq-cell>
</mq-cell-group>

<mq-checkbox-group v-model="fruits" direction="horizontal" :max="2">
  <mq-checkbox name="apple">苹果</mq-checkbox>
  <mq-checkbox name="pear">梨</mq-checkbox>
</mq-checkbox-group>

<mq-radio-group v-model="ship" type="button" direction="horizontal">
  <mq-radio value="air">空运</mq-radio>
  <mq-radio value="land">陆运</mq-radio>
</mq-radio-group>
```

`mq-switch` 的 `before-change` 可以返回 `false` 或一个最终为 `false` 的 Promise，用来拦住切换。`mq-checkbox-group` 的 `max` 为 `0` 时不限制个数；已经选到 `min` 时不能再取消。`mq-input` 的 `type` 透传 `text`、`number`、`digit`、`idcard`、`tel`、`safe-password`、`nickname`。

`mq-popup` 的 `position`：`bottom` | `center`。它是受控的：遮罩和 Esc 只发出 `update:modelValue(false)`，父级把值改回 `false` 后才会收起并发出 `close`。`mask-closable` 为 `false` 时，遮罩和 Esc 都不关。`open` / `close` 跟 `modelValue` 的变化走，不重复发。过渡结束后卸载。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from '@mosquito/ui'

const visible = ref(false)
</script>

<template>
  <mq-cell title="说明" value="打开" is-link @click="visible = true" />
  <mq-button type="primary" block :loading="false" @click="showToast('已保存')">保存</mq-button>
  <mq-popup v-model="visible" position="bottom" title="底部说明">
    <mq-safe-bottom bg="#fffcf7">
      <mq-button block @click="visible = false">关闭</mq-button>
    </mq-safe-bottom>
  </mq-popup>
  <mq-toast />
</template>
```

## showToast / hideToast

```ts
import { hideToast, showToast } from '@mosquito/ui'

showToast('已保存')
showToast({ message: '停在这里', duration: 0 })
hideToast()

const close = showToast('这一条')
close()
```

- 页面上有 `<mq-toast />` 时，只更新这一块状态，不新建实例。一个页面挂一个宿主。
- 调用时还没有宿主（例如写在 `setup` / `onLoad` 里）会先记下文案，等这一轮渲染结束。宿主若在这轮挂上，就走组件；仍然没有，并且运行环境里有 `uni`，再调用 `uni.showToast`（`icon: 'none'`）。
- `duration` 默认 `2000` 毫秒。`0` 表示不自动关闭。非法或负数按 `2000`。空白文案直接忽略，不会清掉当前提示。
- 返回函数只关闭对应的那一次。中间又调用了 `showToast` 时，旧的返回函数不会关掉新提示。
- 没有宿主且 `duration` 为 `0` 时，原生接口没有真正的永久显示，这里用 10 分钟托住，`hideToast()` 仍会关掉它。
- 只做文字。宿主里长文案会换行；`uni.showToast` 对过长标题会按平台截断。
- `toastState` 可读取当前文案和显隐。改提示用 `showToast` / `hideToast`。

## mq-safe-bottom

单层 `view`，`padding-bottom` 为 `constant(safe-area-inset-bottom)` / `env(safe-area-inset-bottom)`。

`bg` 默认 `transparent`。传入的颜色会同时写进行内 `background-color` 和 `--mq-safe-bg`，留白和插槽用同一块底色。空字符串按透明处理。可以写 `#fffcf7`、`rgb()` 或 `var(--mq-bg)`。

```vue
<mq-safe-bottom bg="#fffcf7">
  <mq-button block>贴底操作</mq-button>
</mq-safe-bottom>

<mq-safe-bottom bg="var(--mq-bg)" />
```

H5 要让 `env(safe-area-inset-bottom)` 非 0，视口需要 `viewport-fit=cover`。小程序和 App 由系统安全区决定；没有安全区时留白为 0，背景仍铺在组件自己的内容上。

## 脚本

```bash
pnpm --filter @mosquito/ui typecheck
pnpm --filter @mosquito/ui test
```
