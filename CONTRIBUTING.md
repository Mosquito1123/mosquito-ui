# 贡献指南

## 组件约定

- 目录：`packages/ui/src/components/mq-<name>/`
- 每个组件包含：`Mq<Name>.vue`、`Mq<Name>.uvue`（uni-app x 占位）、`types.ts`、`index.scss`
- `<script setup lang="ts">` 中用 `defineOptions({ name: 'mq-<name>' })`
- props 用 `withDefaults(defineProps<...>())`，事件用 `defineEmits<...>()`
- 根节点尽量只有一个，DOM 少节点；不引入图标字体，用文字/符号/伪元素
- 颜色、圆角、字号一律走 `--mq-*` CSS 变量，并给出回退值
- 交互禁用态不发出事件；弹出层关闭后卸载
- 所有新增组件必须同时提供 `.uvue` 占位（只有注释和空壳根节点）

## 测试约定

- 工具：Vitest + jsdom + @vue/test-utils
- 工具函数测试：`packages/ui/test/<name>.test.ts`（沿用 `import { test } from 'vitest'`）
- 组件测试：`tests/components/<name>.test.ts`，从 `@/components/mq-<name>/Mq<Name>.vue` 导入
- `tests/setup.ts` 已提供最小的 `uni` 兼容层，可用 `vi.spyOn(uni, 'xxx')` 覆盖
- 覆盖目标：整体 60%+，新增组件 80%+

## 文档约定

- 逐组件文档：`docs/component/<name>.md`，标题格式 `# Mq<Name> <中文名>`
- 内容按「何时使用 / 用法示例 / API（props / events / slots / methods）/ 主题变量」组织
- API 必须与 `types.ts` 和源码一致，不可臆造

## 示例约定

- 示例工程：`examples/uni-app-demo/`
- 演示页面按分类组织，在 `pages.json` 中登记
- 示例只演示真实存在的 API

## 命令

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm coverage
```

## 提交

使用 Conventional Commits（`feat:`、`fix:`、`docs:`、`test:`、`chore:` 等），提交前 husky 会跑 lint-staged 和 commitlint。
