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
      "^mq-progress$": "@mosquito/ui/components/mq-progress/MqProgress.vue",
      "^mq-textarea$": "@mosquito/ui/components/mq-textarea/MqTextarea.vue",
      "^mq-slider$": "@mosquito/ui/components/mq-slider/MqSlider.vue",
      "^mq-rate$": "@mosquito/ui/components/mq-rate/MqRate.vue",
      "^mq-notice-bar$": "@mosquito/ui/components/mq-notice-bar/MqNoticeBar.vue",
      "^mq-empty$": "@mosquito/ui/components/mq-empty/MqEmpty.vue",
      "^mq-steps$": "@mosquito/ui/components/mq-steps/MqSteps.vue",
      "^mq-step$": "@mosquito/ui/components/mq-step/MqStep.vue",
      "^mq-collapse$": "@mosquito/ui/components/mq-collapse/MqCollapse.vue",
      "^mq-collapse-item$": "@mosquito/ui/components/mq-collapse-item/MqCollapseItem.vue",
      "^mq-action-sheet$": "@mosquito/ui/components/mq-action-sheet/MqActionSheet.vue",
      "^mq-search$": "@mosquito/ui/components/mq-search/MqSearch.vue",
      "^mq-dialog$": "@mosquito/ui/components/mq-dialog/MqDialog.vue",
      "^mq-input-number$": "@mosquito/ui/components/mq-input-number/MqInputNumber.vue",
      "^mq-notify$": "@mosquito/ui/components/mq-notify/MqNotify.vue",
      "^mq-gap$": "@mosquito/ui/components/mq-gap/MqGap.vue",
      "^mq-skeleton$": "@mosquito/ui/components/mq-skeleton/MqSkeleton.vue",
      "^mq-countdown$": "@mosquito/ui/components/mq-countdown/MqCountdown.vue",
      "^mq-segmented$": "@mosquito/ui/components/mq-segmented/MqSegmented.vue",
      "^mq-navbar$": "@mosquito/ui/components/mq-navbar/MqNavbar.vue",
      "^mq-tabs$": "@mosquito/ui/components/mq-tabs/MqTabs.vue",
      "^mq-tab$": "@mosquito/ui/components/mq-tab/MqTab.vue",
      "^mq-tabbar$": "@mosquito/ui/components/mq-tabbar/MqTabbar.vue",
      "^mq-tabbar-item$": "@mosquito/ui/components/mq-tabbar-item/MqTabbarItem.vue",
      "^mq-overlay$": "@mosquito/ui/components/mq-overlay/MqOverlay.vue",
      "^mq-card$": "@mosquito/ui/components/mq-card/MqCard.vue",
      "^mq-row$": "@mosquito/ui/components/mq-row/MqRow.vue",
      "^mq-col$": "@mosquito/ui/components/mq-col/MqCol.vue",
      "^mq-grid$": "@mosquito/ui/components/mq-grid/MqGrid.vue",
      "^mq-grid-item$": "@mosquito/ui/components/mq-grid-item/MqGridItem.vue",
      "^mq-loadmore$": "@mosquito/ui/components/mq-loadmore/MqLoadmore.vue",
      "^mq-sticky$": "@mosquito/ui/components/mq-sticky/MqSticky.vue",
      "^mq-fab$": "@mosquito/ui/components/mq-fab/MqFab.vue",
      "^mq-pagination$": "@mosquito/ui/components/mq-pagination/MqPagination.vue",
      "^mq-transition$": "@mosquito/ui/components/mq-transition/MqTransition.vue",
      "^mq-backtop$": "@mosquito/ui/components/mq-backtop/MqBacktop.vue",
      "^mq-text$": "@mosquito/ui/components/mq-text/MqText.vue"
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
import { MqButton, showNotify, showToast } from '@mosquito/ui'
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
| `mq-textarea` | `v-model` `maxlength` `clearable` `show-word-limit` `auto-height` `error` `compact` | `input` `focus` `blur` `clear` `confirm` |
| `mq-slider` | `v-model` `min` `max` `step` `disabled` `show-extreme-value` `active-color` | `change` `dragstart` `dragmove` `dragend`，参数都是 `{ value }` |
| `mq-rate` | `v-model` `num` `allow-half` `clearable` `readonly` `disabled` `size` `space` | `change`，参数 `{ value }` |
| `mq-notice-bar` | `text` `type` `closable` `scrollable` `wrapable` `color` `background`。前缀用 `prefix` 插槽 | `click` `close` |
| `mq-empty` | `tip`。`image` 插槽替换标记，默认插槽放在底部 | 无 |
| `mq-steps` | `active` `vertical` `dot` `align-center` | 无 |
| `mq-step` | `title` `description` `status` | 无。序号按渲染顺序 |
| `mq-collapse` | `v-model` `accordion` `disabled` | `change`，参数 `{ value }` |
| `mq-collapse-item` | `name` `title` `disabled` `before-expand` | 无。点标题切换 |
| `mq-action-sheet` | `v-model` `actions` `title` `cancel-text` `mask-closable` | `select` 参数 `{ item, index }`，`close` |
| `mq-search` | `v-model` `placeholder` `clearable` `action-text` `maxlength` | `input` `search` `clear` |
| `mq-dialog` | `v-model` `title` `message` `show-cancel` `confirm-text` `cancel-text` `before-confirm` `mask-closable` | `confirm` `cancel` `close` |
| `mq-input-number` | `v-model` `min` `max` `step` `precision` `step-strictly` `disabled` `before-change` | `change`，参数 `{ value }` |
| `mq-notify` | 无。用 `showNotify` / `hideNotify` | 页面放一个 `<mq-notify />` |
| `mq-navbar` | `title` `left-text` `right-text` `left-arrow` `fixed` `placeholder` `safe-area-inset-top` | `click-left` `click-right` |
| `mq-tabs` | `v-model` `color` `inactive-color` | `change` `click` `disabled`，参数 `{ index, name }` |
| `mq-tab` | `title` `name` `disabled` | 无 |
| `mq-tabbar` | `v-model` `fixed` `bordered` `safe-area-inset-bottom` `placeholder` `before-change` | `change`，参数 `{ value }` |
| `mq-tabbar-item` | `title` `name` `mark` `value` `is-dot` `max`。`icon` 插槽可自定义标记 | 无 |
| `mq-segmented` | `v-model` `options` `disabled` `theme` | `change`，参数 `{ value }` |
| `mq-countdown` | `time` `format` `auto-start` `millisecond` | `change` `finish`。方法 `start` `pause` `reset` |
| `mq-skeleton` | `theme` `loading` `animation` `rows` | 无 |
| `mq-gap` | `height` `bg` `safe-area-bottom` | 无 |
| `mq-overlay` | `show` `duration` `z-index` | `click` |
| `mq-card` | `title` `type`。插槽 `title` `footer` | 无 |
| `mq-row` / `mq-col` | `gutter` `justify` `align`；`span` `offset`（24 栅格） | 无 |
| `mq-grid` / `mq-grid-item` | `column` `border` `gutter` `square` `clickable`；项用 `mark`/`text` | 项 `click` |
| `mq-loadmore` | `state` `loading-text` `finished-text` `error-text` | `reload` |
| `mq-sticky` | `offset-top` `z-index`（CSS sticky） | 无 |
| `mq-fab` | `v-model:active` `type` `position` `direction` `expandable` | `click` `change` |
| `mq-pagination` | `v-model` `total` `page-size` `show-message` | `change`，参数 `{ value }` |
| `mq-transition` | `show` `name` `duration` | `after-enter` `after-leave` |
| `mq-backtop` | `scroll-top` `top` `text` `shape` `bottom` `right` | `click` |
| `mq-text` | `text` `type` `mode` `size` `bold` `lines` `decoration` | `click` |
| `mq-popup` | `v-model` `position` `mask-closable` `duration` `z-index` `title` | `update:modelValue` `open` `close` |
| `mq-toast` | 无。用 `showToast` / `hideToast` | 页面放一个 `<mq-toast />` 当宿主 |
| `mq-loading` | `size` `color` `label` | 无。根节点就是指示器 |
| `mq-safe-bottom` | `bg` | 无。见下方背景说明 |

`mq-button` 的 `type`：`default` | `primary` | `success` | `warning` | `danger`。`variant`：`base` | `plain` | `text`。`size`：`mini` | `small` | `medium` | `large`。

这些属性对齐的是 wot-ui 的用法，不是它的实现。没有图标字体，也没有 `wd-` 前缀。复选和单选的标记画在根节点上；输入框的清空和密码切换用文字，不嵌按钮组件。评分用文字星号，空状态用伪元素，导航栏左侧箭头用 `‹`，标签栏和宫格用 `mark` 文字，悬浮按钮用 `+` / `×`，回到顶部用 `↑`。对话框、动作面板复用已有弹出层。滑块只做单值，折叠不做「查看更多」，骨架屏先支持主题和行数。栅格是 24 列；吸顶走 CSS `position: sticky`。通告的 `info` 用主色和弱底，因为主题里没有单独的信息色。

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

`mq-switch` 的 `before-change` 可以返回 `false` 或一个最终为 `false` 的 Promise，用来拦住切换。`mq-checkbox-group` 的 `max` 为 `0` 时不限制个数；已经选到 `min` 时不能再取消。`mq-input` 和 `mq-textarea`、`mq-search` 的 `maxlength` 小于 `0` 时传给原生控件 `-1`，表示不限制。`mq-input` 的 `type` 透传 `text`、`number`、`digit`、`idcard`、`tel`、`safe-password`、`nickname`。

`mq-slider` 把值吸到 `step` 上，并夹在 `min` 和 `max` 之间。拖动过程发出 `dragmove`，松开发出 `change`；只有发生过拖动才发出 `dragend`。`mq-rate` 在拿不到点击横坐标时按整星计算。`clearable` 时再点当前值会回到 `0`。`mq-collapse` 的 `accordion` 为 `false` 时 `v-model` 是名字数组，为 `true` 时是当前名字，全部收起是空字符串。`before-expand` 的参数是即将变成的展开状态。`mq-action-sheet` 受控方式和弹出层一样：选中或取消只把 `v-model` 设为 `false`。取消文案传空字符串可以藏掉取消行。底部会带一块安全区。

`mq-dialog` 默认点遮罩不关。`before-confirm` 返回 `false` 时不关闭。`mq-notify` 默认 `danger`，时长 `3000`，传 `0` 不自动关；空白文案会被忽略。`mq-countdown` 的 `format` 支持 `DD` `HH` `mm` `ss` `S` `SS` `SSS`。`mq-segmented` 的 `options` 可以是字符串、数字，或 `{ value, label?, disabled? }`。

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

## showToast / hideToast / showNotify / hideNotify

```ts
import { hideNotify, hideToast, showNotify, showToast } from '@mosquito/ui'

showToast('已保存')
showToast({ message: '停在这里', duration: 0 })
hideToast()

showNotify({ type: 'primary', message: '订单已更新', closable: true })
hideNotify()

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
