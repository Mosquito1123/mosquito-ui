# uni-app 示例

这是一份 Vue 3 页面骨架，用来在 HBuilderX 或官方 `create-uni` / `uni-preset-vue` 里挂上 `@mosquito/ui`。仓库故意不安装整套 `@dcloudio`，避免把脚手架体积带进组件库。

## HBuilderX

1. 在仓库根目录执行 `pnpm install`，让 `@mosquito/ui` 链接到本示例。
2. 用 HBuilderX 打开 `examples/uni-app-demo`。
3. 运行到浏览器。首页是分类入口，点进各分类页看具体演示；页面列表见下方「演示页面」。
4. H5 安全区依赖 `index.html` 里的 `viewport-fit=cover`。

若 easycom 解析不到包导出，把 `pages.json` 里的组件路径改成：

```text
node_modules/@mosquito/ui/src/components/mq-button/MqButton.vue
```

其余组件同样把 `MqButton.vue` 换成对应文件名。页面本身已经 `import` 了组件，easycom 失败时手动导入仍然可用。

## create-uni / uni-preset-vue

```bash
npx degit dcloudio/uni-preset-vue#vite-ts my-app
```

把本目录这些文件拷进新项目：

- `pages/`
- `pages.json`（合并 `easycom`）
- `manifest.json`
- `App.vue`
- `main.ts`
- `index.html`
- `uni.scss`（保持为空注释，主题不要写进这里）

然后：

```bash
pnpm add @mosquito/ui vue
```

本地未发布时：

```json
{
  "dependencies": {
    "@mosquito/ui": "file:../../packages/ui"
  }
}
```

`vite.config.ts` 使用官方插件后再启动：

```ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
})
```

## 演示页面

首页 `pages/index/index` 用 `uni.navigateTo` 列出所有分类入口；每页只演示真实存在的组件 API。

| 路径                      | 标题       | 内容                                                                                                                                                                                        |
| ------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index/index`       | 蚊式组件   | 分类入口导航                                                                                                                                                                                |
| `pages/basic/index`       | 基础组件   | button、cell / cell-group、tag、badge、avatar / avatar-group、img、text、icon，以及文字符号标记的补充用法                                                                                   |
| `pages/form/index`        | 表单组件   | input、textarea、switch、checkbox / group、radio / group、slider、rate、input-number、search、picker、calendar、datetime-picker、cascader、select、drop-menu、upload、form / form-item 校验 |
| `pages/feedback/index`    | 反馈组件   | showToast / hideToast、showNotify / hideNotify、loading、dialog、action-sheet，以及居中 / 底部 / 不可遮罩关闭三种 popup                                                                     |
| `pages/display/index`     | 展示组件   | card、progress、steps / step、collapse / item、table、tree、timeline / item、waterfall                                                                                                      |
| `pages/nav/index`         | 导航组件   | navbar、tabs / tab、tabbar / item、index-bar / anchor、sidebar / item、sticky、backtop                                                                                                      |
| `pages/advanced/index`    | 进阶组件   | banner、swiper、image-preview、qr-code、bar-code、signature、slide-verify                                                                                                                   |
| `pages/composables/index` | 组合式函数 | useToast、useNotify、useDialog、useCountDown、useUpload、useConfigProvider（均从 `@mosquito/ui/composables` 导入）                                                                          |

说明：组合式函数从 `@mosquito/ui/composables` 导入，组件仍从 `@mosquito/ui` 导入。新增组件（icon / swiper / image-preview / qr-code / bar-code 等）也按 `Mq<PascalName>` 从包入口导入；若工具链尚未从入口导出，可改用 `@mosquito/ui/components/mq-<name>/Mq<Name>.vue` 的深路径。

## 本目录的脚本

`pnpm --filter @mosquito/uni-app-demo dev` 只打印上面的接入步骤，不会拉起一个残缺的 Vite 服务。
