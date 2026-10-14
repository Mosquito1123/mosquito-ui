console.log(`@mosquito/uni-app-demo 是页面骨架，本仓库没有安装 @dcloudio 工具链。

用 HBuilderX：
  1. 在仓库根目录执行 pnpm install
  2. 用 HBuilderX 打开 examples/uni-app-demo
  3. 运行到浏览器或小程序

用命令行脚手架：
  1. npx degit dcloudio/uni-preset-vue#vite-ts my-app
  2. 把本目录的 pages/、pages.json、manifest.json、App.vue、main.ts、index.html 覆盖进新项目
  3. 在新项目安装 @mosquito/ui（workspace 或 file: 指向 packages/ui）
  4. 按 pages.json 里的 easycom.custom 核对组件路径
  5. npm run dev:h5

vite.config.ts 里留了 @dcloudio/vite-plugin-uni 的接入位置。
`)
