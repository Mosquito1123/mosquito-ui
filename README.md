# @mosquito/ui

蚊式 UI。面向 **uni-app（Vue 3）** 的轻量组件库，运行时少节点、少计算；目录和文档按 **uni-app x** 预留，当前不把 `.uvue` 当成正式实现。

这不是 [wot-ui](https://github.com/wot-ui/wot-ui) 或 [cool-unix](https://gitee.com/cool-team-official/cool-unix) 的分支。组件前缀是 `mq-`，主题令牌和 DOM 结构都是重新设计的。

## 定位

- 先服务 uni-app 运行时：单根节点、CSS 变量、弹出层关闭后卸载。
- 组件按 easycom 分目录：`src/components/mq-*/`。
- 每个组件一份可用的 `ComponentName.vue`，旁边放 `ComponentName.uvue` 占位，方便以后补 uni-app x。
- 命令式反馈走 `showToast` / `hideToast`，不把 toast 套进另一套弹层组件。

## 安装

仓库是 pnpm workspace。库包名是 `@mosquito/ui`。

```bash
pnpm install
pnpm typecheck
pnpm test
```

`main` 的拉取请求会跑 GitHub Actions：`pnpm typecheck` 和 `pnpm test`。建议把检查项 **typecheck and test** 设成分支保护里的必过项。

业务项目里：

```bash
pnpm add @mosquito/ui
```

包尚未发布到 npm 时，可先用 workspace，或在业务 `package.json` 里指向本仓库的 `packages/ui`。

在 `App.vue` 引入一次主题变量（不要写进 `uni.scss`，否则每个 scss 都会再注入一份）：

```scss
@import '@mosquito/ui/styles/index.scss';
```

`pages.json` 按需 easycom（文件名是帕斯卡形式，所以用自定义映射）。映射要指向 `.vue`，不要指向同目录的 `.uvue` 占位：

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
      "^mq-tabbar-item$": "@mosquito/ui/components/mq-tabbar-item/MqTabbarItem.vue"
    }
  }
}
```

若工具链不解析 `exports`，把路径改成 `node_modules/@mosquito/ui/src/components/...`。也可以手动导入：

```vue
<script setup lang="ts">
import { MqButton, showToast } from '@mosquito/ui'
</script>
```

## 组件

| 组件 | 能力 |
| --- | --- |
| `mq-button` | `type` / `variant` / `size` / `round` / `block` / `disabled` / `loading`。禁用和加载中不发出 `click` |
| `mq-cell` | `title` / `value` / `label` / `is-link` / `clickable` / `disabled` / `required`。右侧可放插槽 |
| `mq-cell-group` | 分组标题、分割线和圆角卡片 |
| `mq-switch` | `v-model`，可换开关值、颜色和尺寸。`before-change` 返回 `false` 时不切换 |
| `mq-checkbox` / `mq-checkbox-group` | 可单独绑定，也可按组多选，支持 `min` / `max` |
| `mq-radio` / `mq-radio-group` | 组内单选，`type="button"` 变成按钮，`allow-uncheck` 可取消 |
| `mq-input` | `v-model`、清空、字数、密码显隐、`compact` 放进单元格 |
| `mq-tag` | 类型、镂空、浅色、圆角、可关闭 |
| `mq-badge` | 数字、上限、红点。`0` 默认不显示 |
| `mq-divider` | 文本位置、虚线、垂直 |
| `mq-progress` | `percentage` 限制在 0–100，可用 `status` 换色 |
| `mq-textarea` | 多行输入，清空、字数、`auto-height`。`maxlength` 小于 0 时不限制 |
| `mq-slider` | 单值滑块，`min` / `max` / `step`。`change` 为 `{ value }` |
| `mq-rate` | 文字星号评分，可半星、可再点清空 |
| `mq-notice-bar` | 通告。`info` 走主色，可关闭，需要时才滚动 |
| `mq-empty` | 空状态。标记用伪元素，图片和底部用插槽 |
| `mq-steps` / `mq-step` | 按顺序编号。`active` 之前为完成，当前为进行中 |
| `mq-collapse` / `mq-collapse-item` | 多选或手风琴。`before-expand` 返回 `false` 时不展开 |
| `mq-action-sheet` | 底部动作列表，复用弹出层。`select` 为 `{ item, index }` |
| `mq-search` | 原生输入加文字按钮，不套输入框和按钮组件 |
| `mq-dialog` | 受控对话框，复用弹出层。可 `before-confirm` |
| `mq-input-number` | 加减计数，文字按钮，不使用图标字体 |
| `mq-notify` | `showNotify` / `hideNotify`，页面挂 `<mq-notify />` |
| `mq-navbar` | 顶栏。左侧箭头用文字 `‹` |
| `mq-tabs` / `mq-tab` | 标签页。`v-model` 可为索引或 `name` |
| `mq-tabbar` / `mq-tabbar-item` | 底栏。用 `mark` 文字标记，可用 `icon` 插槽 |
| `mq-segmented` | 分段器 |
| `mq-countdown` | 倒计时。暴露 `start` / `pause` / `reset` |
| `mq-skeleton` | 骨架占位。`loading` 为 false 时显示插槽 |
| `mq-gap` | 间隔槽，可开底部安全区 |
| `mq-popup` | `v-model` 受控显隐，`position` 为 `bottom` 或 `center`，发出 `open` / `close` |
| `mq-toast` | `showToast` / `hideToast`；页面放一个 `<mq-toast />` 作为宿主 |
| `mq-loading` | 单节点旋转指示，可选 `size`、`color`、`label` |
| `mq-safe-bottom` | 底部安全区留白，`bg` 同时写进行内背景和 `--mq-safe-bg`，默认透明 |

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
    <mq-safe-bottom bg="#fffcf7">
      <mq-button block @click="visible = false">关闭</mq-button>
    </mq-safe-bottom>
  </mq-popup>
  <mq-toast />
</template>
```

`showToast` 返回一个只关闭这一条的函数。`duration` 默认 2000，传 `0` 则不自动关闭；空白文案会被忽略。调用时如果宿主还没挂上，会等到这一轮渲染结束再决定：有 `<mq-toast />` 就走组件，否则在运行环境里存在 `uni` 时改走 `uni.showToast`（`icon: 'none'`）。没有宿主且 `duration` 为 `0` 时，原生提示用 10 分钟托住，`hideToast()` 仍可关掉。属性表和 `pages.json` 全文见 [packages/ui/README.md](packages/ui/README.md)。

## 性能原则

少层级、列表虚拟化、列表里不套深组件、条件编译、easycom 按需引入。细节见 [docs/PERFORMANCE.md](docs/PERFORMANCE.md)。

## uni-app x 路线

`.vue` 与 `.uvue` 双文件、蒸汽模式 flatten、`list-view`、UTS 只用于原生插件。见 [docs/UNIAPPX.md](docs/UNIAPPX.md)。

**现在不要用这套源码打 uni-app x 包。** 每个组件旁的 `.uvue` 只是占位，不是实现。uni-app x 在同目录同时存在 `.vue` 和 `.uvue` 时会优先编译 `.uvue`，占位会盖住可用的 `.vue`。补完 x 端实现，或先移走占位文件之前，保持 easycom 指向 `.vue`，只在 uni-app（Vue 3）里用。

## 示例

[examples/uni-app-demo](examples/uni-app-demo) 是一份可拷进 HBuilderX 或 `create-uni` / `uni-preset-vue` 的薄页面，不含完整 `@dcloudio` 依赖。运行方式写在该目录的 README。

```bash
pnpm --filter @mosquito/uni-app-demo dev
```

## UTS 截屏插件

原生截屏不塞进 UI 包。需要 App 端截屏 / 截长图时，使用独立包 [`packages/uts-screenshot`](packages/uts-screenshot)，复制为工程内 `uni_modules/mosquito-screenshot`。说明见该目录 README 与 [docs/UNIAPPX.md](docs/UNIAPPX.md)。

## 目录

```
mosquito-ui/
  packages/ui/               @mosquito/ui
  packages/uts-screenshot/   UTS 截屏 / 截长图（uni_modules 形态）
  examples/uni-app-demo
  docs/PERFORMANCE.md
  docs/UNIAPPX.md
```

## 致谢

交互与属性形态参考了 [wot-ui](https://github.com/wot-ui/wot-ui)（MIT）：按钮、单元格、表单、标记、反馈、导航和布局中的常用组件，以及 `v-model` 弹出层、命令式 toast / notify。本仓库没有复制它的源码树，也不使用 `wot` / `wd-` 命名，不带图标字体。导航栏和标签栏用文字箭头或 `mark`，对话框和动作面板复用已有弹出层。这一版仍不做日历、选择器、上传和图标字体。

目录与性能结构参考了 [cool-unix](https://gitee.com/cool-team-official/cool-unix)（[GitHub](https://github.com/cool-team-official/cool-unix)，MIT）：`components/名称/名称` 的 easycom 习惯、`theme.json` 的明暗令牌拆分、安全区组件、`useUi().showToast` 这种命令式入口，以及 uni-app x 的 `list-view`。本仓库没有引入其 Tailwind、PassThrough 或 `cl-` 组件实现；主题做成 CSS 变量，安全区用 `env(safe-area-inset-bottom)`，toast 不再套一层 popup。

## 许可

[MIT](LICENSE)。Copyright (c) 2026 Mosquito1123 / 无住。
