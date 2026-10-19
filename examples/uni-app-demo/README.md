# uni-app 示例

这是一份 Vue 3 页面骨架，用来在 HBuilderX 或官方 `create-uni` / `uni-preset-vue` 里挂上 `@mosquito/ui`。仓库故意不安装整套 `@dcloudio`，避免把脚手架体积带进组件库。

## HBuilderX

1. 在仓库根目录执行 `pnpm install`，让 `@mosquito/ui` 链接到本示例。
2. 用 HBuilderX 打开 `examples/uni-app-demo`。
3. 运行到浏览器。首页覆盖按钮（含镂空、文字、禁用、加载中）、单元格、开关、输入、复选、单选、标签、徽标、分割线、进度、多行输入、滑块、评分、通告、空状态、步骤、折叠、搜索、动作面板、三种弹出层、可停住的 toast，以及可切换的安全区背景。
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

## 本目录的脚本

`pnpm --filter @mosquito/uni-app-demo dev` 只打印上面的接入步骤，不会拉起一个残缺的 Vite 服务。
