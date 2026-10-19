# 性能约定

`@mosquito/ui` 把运行时成本放在组件形态上，而不是放在事后的包裹层里。下面这些约定对现有组件生效，以后新增组件也按同一条线写。

## 少层级

- 一个组件只保留一个根节点。按钮就是一枚 `button`，不再外套 `view`。
- 加载指示用根节点自己的边框旋转，不另插图标组件。
- 弹出层是「遮罩根节点 + 一块面板」。点击面板用 `@click.stop`，不为遮罩再单独开一层。
- Toast 直接渲染一块提示，不内嵌 popup、图标库或文本组件。
- 单元格默认是标题、可选的值、可选的箭头。`label` 或必填星号才多包一层。不用图标字体。勾选、单选和开关的标记用根节点的伪元素，不另做图标组件。
- 动作面板和对话框复用已有弹出层，不另写一套遮罩和计时。评分、通告和空状态用文字或伪元素。搜索是一层容器里的原生输入和文字按钮，不再套输入框和按钮组件。
- 通知条只更新一块响应式状态，和 toast 一样不新建实例树。标签栏用文字 `mark`，导航栏箭头用字符，都不引入图标字体。

## 列表虚拟化

长列表的滚动和回收交给页面，不交给单元格。

- uni-app 端用你已经选定的虚拟列表方案，行里只放扁平展示。
- uni-app x 端用原生 `list-view` / `list-item`。库不内置第二套列表容器，避免和原生回收打架。
- 行高尽量稳定。不在滚动中测量安全区，也不在每一行创建 toast / popup 实例。

## 避免在列表里深封装

`mq-cell` 只负责一行展示和点击。不要在 cell 内部再挂弹出层、加载宿主或命令式 UI。反馈放到页面级：全页一个 `<mq-toast />`，弹出层也挂在页面上。

深封装会让蒸汽模式 flatten 之后仍然留下一串多余节点，虚拟列表每行都会付这份成本。

## 条件编译

平台差异用 `#ifdef` / `#ifndef` 在编译期拆开，不要在每次渲染里堆 `if (platform)`。当前组件还没有平台分支；真的需要时再加，并且保持模板只有一条主路径。

`.uvue` 现在是占位文件。不要为了「兼容 x」在 `.vue` 里复制一套运行时判断。

## 按需 easycom

目录名是 `mq-*`，和标签一致。`pages.json` 的 `easycom.custom` 把标签指到对应的 `ComponentName.vue`。没用到的组件不应出现在页面依赖里。

主题只在 `App.vue` 引入一次 `@mosquito/ui/styles/index.scss`。组件样式跟在各自的 SFC 里，不把整库 CSS 打进 `uni.scss`（uni-app 会把 `uni.scss` 注入每个 scss 文件）。

从包入口 `import { MqButton } from '@mosquito/ui'` 适合少量手动引用。页面多的时候优先 easycom，避免一个 barrel 把全部组件都拽进来。

## 主题用 CSS 变量

颜色、圆角、时长、层级都走 `--mq-*`。组件上不为换肤做 JS 计算，也不提供会迫使子节点重渲染的主题上下文。

明暗两套变量写在 `styles/variables.scss`：默认亮色，`prefers-color-scheme: dark` 切换，也可以在祖先节点加 `mq-theme-dark`。这是从独立主题表拆出的做法，运行时只改自定义属性。

样式动画只用 `transform` 和 `opacity`。弹出层关闭并等过渡结束后卸载，避免 `display` 隐藏的节点继续留在树上。

## 安全区

`mq-safe-bottom` 用 `constant(safe-area-inset-bottom)` 和 `env(safe-area-inset-bottom)` 垫高。`bg` 默认 `transparent`，同时写进行内 `background-color` 和 `--mq-safe-bg`，留白和插槽是同一块底色。不在渲染路径上调用测量 API。页面需要贴底栏时，把栏放进这个组件的默认插槽，而不是给每一行加安全区。

H5 要生效，视口需要 `viewport-fit=cover`。示例 `index.html` 已带上。

## 命令式反馈

`showToast` / `hideToast` 只更新一块响应式状态。调用时若宿主还没挂上，会等到这一轮渲染结束：`<mq-toast />` 出现就继续用这块状态，否则才调用一次 `uni.showToast`。不要为一次提示创建组件树。同一页面只挂一个 `<mq-toast />`。
