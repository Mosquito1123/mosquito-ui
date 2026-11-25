# 常见问题

## 包发布到 npm 了吗？

尚未发布时，用 pnpm workspace 或在业务 `package.json` 里指向本仓库的 `packages/ui`：

```json
{ "dependencies": { "@mosquito/ui": "file:../../packages/ui" } }
```

仓库内的检查命令是 `pnpm install`、`pnpm typecheck`、`pnpm test`。

## easycom 解析不到组件怎么办？

`pages.json` 的 `easycom.custom` 映射要指向 `.vue`，不是同目录的 `.uvue` 占位。若工具链不解析包 `exports`，把路径改成 `node_modules/@mosquito/ui/src/components/mq-button/MqButton.vue` 这类物理路径，其余组件替换文件名即可。也可以在页面里手动 `import { MqButton } from '@mosquito/ui'`。完整映射见仓库根 README。

## 为什么映射不能指向 `.uvue`？

每个组件旁的 `.uvue` 只是为 uni-app x 预留的占位文件，只有注释和空壳根节点。uni-app x 在同目录同时存在 `.vue` 和 `.uvue` 时会优先编译 `.uvue`，占位会盖住可用实现。补完 x 端实现或移走占位之前，保持 easycom 指向 `.vue`。

## 为什么样式只在 `App.vue` 引一次？

`uni.scss` 会被 uni-app 注入到每个 scss 文件。主题写进 `uni.scss` 会重复注入；写在 `App.vue` 的 `<style lang="scss">` 里只进一次。组件自身样式跟在 SFC 里，随 easycom 按需加载。

## showToast 没有显示怎么办？

页面里放一个 `<mq-toast />` 作为宿主。调用时若宿主还没挂上，实现会等到这一轮渲染结束再决定：有宿主就走组件状态；否则在运行环境存在 `uni` 时改走 `uni.showToast`（`icon: 'none'`）。同一页面只挂一个宿主。

```vue
<mq-button @click="showToast('已保存')">保存</mq-button>
<mq-toast />
```

`showToast` 返回只关闭当前那一条的函数；`hideToast()` 关闭当前提示。默认 2000ms，`duration: 0` 表示不自动关闭（原生兜底时用 10 分钟托住，`hideToast()` 仍可关掉）。空白文案会被忽略。

## 通知条和 toast 有什么区别？

`showNotify({ type, message, position, closable })` 显示页面顶部或底部的通知条，默认 3000ms，需要页面挂 `<mq-notify />`；`showToast` 是一条短提示。两者都只更新响应式状态，不为每次提示创建组件树。

## 如何换肤 / 暗色模式？

变量在 `styles/variables.scss`。默认亮色，`prefers-color-scheme: dark` 切暗色，也可给祖先节点加 `mq-theme-dark`，或用 `mq-config-provider` 的 `theme` / `themeVars` 做局部覆盖。细节见 [主题](/guide/theming)。

## 为什么没有图标字体？

约定是「不引入图标字体文件」。`mq-icon` 把内置名称映射到 unicode 字形，未知名回退为名称首字符；导航栏箭头用 `‹`，标签栏和宫格用 `mark` 文字，勾选/开关标记用伪元素，评分用文字星号。示例工程里也按这个边界演示。

## `mq-icon`、`mq-qr-code`、`mq-swiper` 怎么用？

这几个标签已有对应组件：`mq-icon` 传 `name` / `size` / `color`；`mq-qr-code` 传 `text` / `size` / `level`；`mq-swiper` 传 `list` 并用 `v-model` 绑定当前下标。逐项 API 见左侧组件分组，示例工程 `pages/basic` 和 `pages/advanced` 也有可运行演示。二维码、条码仍由组件自己绘制，不依赖图标字体。

## 表单校验要接 Zod 吗？

不需要。`mq-form` 用轻量 `schema`：`schema.validate(model)` 返回 `{ path, message }[]`，`schema.isRequired(path)` 决定星号。通过 `ref` 调用 `validate()` / `reset()`。错误展示由 `errorType`（`message` / `toast` / `none`）控制。

## 在哪里看逐组件 API？

左侧「组件」分组下的每篇文档按「何时使用 / 用法示例 / API（props / events / slots / methods）/ 主题变量」组织，内容以组件源码和 `types.ts` 为准。可运行的示例在仓库 `examples/uni-app-demo/`。
