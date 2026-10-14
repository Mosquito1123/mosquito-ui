# uni-app x 路线

当前发布形态是 uni-app Vue 3 的 `.vue` 源码。uni-app x 只预留文件和写法，避免以后为了换扩展名去改 DOM。

**占位 `.uvue` 不能参与 uni-app x 构建。** 同目录两种文件都在时，x 端编译 `.uvue` 而不是 `.vue`。现在的 `.uvue` 只有一条占位注释和一个空壳根节点，打出来的包不是这套组件。补完实现或暂时移走占位文件之前，不要用本仓库做 x 端生产包，easycom 也不要指到 `.uvue`。

## 双文件

每个组件目录：

```
mq-button/
  MqButton.vue    现行实现
  MqButton.uvue   uni-app x 占位
  types.ts
  index.scss
```

easycom 习惯是 `components/组件名/组件名.vue`。标签保持 `mq-button`，实现文件用 `MqButton.vue`，在 `pages.json` 里用自定义映射接上。这样和「组件文件使用组件名」的要求对齐，又不必把模板写成全小写文件名。

同目录里 `.vue` 与 `.uvue` 同时存在时：

- uni-app 编译 `.vue`
- uni-app x 编译 `.uvue`

占位文件里只有注释「uni-app x 占位」和一个空壳根节点。x 端会因此走到占位，而不是 `.vue`。在补上真正的 uvue 实现、或暂时移走占位文件之前，不要用这套源码打 uni-app x 生产包。

以后补实现时，让 `.uvue` 的 props 与 `types.ts` 一致，样式继续用同一份 `index.scss` 里的类名和 `--mq-*` 变量。

## 蒸汽模式 flatten

uni-app x / Vue 蒸汽模式（Vapor）会把组件边界展平，中间包装节点不再替你挡一层。组件要在展平之后仍然正确：

- 只有一个根，不依赖多根片段。
- 不读 `$parent`、不按固定层级用选择器找子节点。
- 少用内部子组件。按钮、单元格、加载、安全区都不要再包一层「文本组件」或「图标组件」。
- 状态类名挂在根上（`mq-button--primary`、`is-open`），展平后类名还在那个节点上。
- 主题走 CSS 变量。展平不会弄丢一条 JS 里逐层传递的主题对象，因为本来就没有那条链。

PassThrough 可以把属性打进内部节点，但会鼓励组件长出更多内部零件。v0.1 不做这套 API，定制用根上的类和 `--mq-*`。

## list-view

长列表在 uni-app x 使用原生 `list-view` 与 `list-item`，由原生侧回收节点。约定：

- 行组件保持现在的 `mq-cell` 这种深度，不在行内创建 `mq-popup` 或 `mq-toast`。
- 列表的滚动、吸顶、分页加载留在页面，不做成库里的重型列表组件。
- 行上的点击只 `emit`，跳转和弹层由页面处理。

库里不预置 `mq-list-view`。等 x 端页面需要时，直接用原生组件，避免再包一层把原生回收吃掉。

## UTS 只用于原生插件

组件逻辑停在 TypeScript 与 Vue 模板里。不把样式、显隐、toast 队列写成 UTS。

UTS 留给必须进原生的插件（例如某端 `env(safe-area-inset-*)` 不可用时的安全区插件）。UI 包本身不携带这类插件。安全区默认仍然是 CSS。

## 从现有开源项目吸收的结构

这些是方向，不是移植过来的代码：

- 组件分目录、easycom 可扫描，和 uni-app x 的 `组件名.uvue` 习惯对齐。
- 明暗主题拆开存放，运行时落到 CSS 变量，而不是运行时读一份大 JSON 再写进每个组件。
- 安全区做成独立薄组件，并允许背景色覆盖（`bg`，默认透明）。
- 反馈 API 保持命令式函数，宿主组件可选。
- 列表性能依赖 `list-view`，而不是在 JS 里自己算每一行的包裹层。
