# 主题变量

`--mq-*` 主题令牌的唯一数据源是 `packages/ui/src/styles/theme-tokens.json`。SCSS 与 TS 产物由 `pnpm build:theme-vars` 生成，脚本可重复运行且输出一致，生成文件不要手动编辑。运行时 CSS 变量仍由 `variables.scss` 定义。

## 令牌表

共 21 个令牌；圆角、字号、时长、层级和安全区底色在明暗模式下同值。

| 名称                      | 亮色                     | 暗色                  | 用途           |
| ------------------------- | ------------------------ | --------------------- | -------------- |
| `--mq-color-primary`      | `#0f3d32`                | `#8fd0b4`             | 主色           |
| `--mq-color-primary-text` | `#f7f4ee`                | `#10211b`             | 主色上的文字   |
| `--mq-color-success`      | `#2f7d4a`                | `#8fd0a4`             | 成功色         |
| `--mq-color-success-text` | `#f4fbf6`                | `#102117`             | 成功色上的文字 |
| `--mq-color-warning`      | `#b86e00`                | `#f0c27a`             | 警告色         |
| `--mq-color-warning-text` | `#fff8ee`                | `#2a1c08`             | 警告色上的文字 |
| `--mq-color-danger`       | `#b42318`                | `#f0a8a2`             | 危险色         |
| `--mq-color-danger-text`  | `#fff6f5`                | `#2a100e`             | 危险色上的文字 |
| `--mq-text`               | `#1c1915`                | `#f6f3ee`             | 正文文字       |
| `--mq-text-secondary`     | `#6f675e`                | `#c2b8aa`             | 次要文字       |
| `--mq-bg`                 | `#fffcf7`                | `#161411`             | 页面背景       |
| `--mq-bg-muted`           | `#f6f1e8`                | `#241f1a`             | 弱化背景       |
| `--mq-bg-active`          | `#ebe4d8`                | `#2e2822`             | 按压态背景     |
| `--mq-border`             | `#e6e2da`                | `#3a332c`             | 边框颜色       |
| `--mq-mask`               | `rgba(22, 18, 12, 0.45)` | `rgba(0, 0, 0, 0.55)` | 遮罩颜色       |
| `--mq-radius`             | `8px`                    | `8px`                 | 统一圆角       |
| `--mq-font-size`          | `14px`                   | `14px`                | 基础字号       |
| `--mq-duration`           | `200ms`                  | `200ms`               | 过渡时长       |
| `--mq-z-popup`            | `1000`                   | `1000`                | 弹出层层级     |
| `--mq-z-toast`            | `1100`                   | `1100`                | 轻提示层级     |
| `--mq-safe-bg`            | `transparent`            | `transparent`         | 安全区底色     |

## 生成产物

`theme-vars.scss`

- `$mq-theme-vars`、`$mq-theme-vars-dark`：亮/暗令牌的 SCSS map，键是不带 `--mq-` 前缀的令牌名。
- `@mixin mq-theme-vars-light`、`@mixin mq-theme-vars-dark`：CSS 变量片段，可在子树内声明全部令牌。

```scss
@import '@mosquito/ui/styles/theme-vars.scss';

.local-theme {
  @include mq-theme-vars-light;

  &[data-mq-theme='dark'] {
    @include mq-theme-vars-dark;
  }
}
```

`theme-vars.ts`

- `mqThemeVars`：以驼峰命名的常量，值为 `var(--mq-*, 亮色回退值)`。
- `MqThemeVarName`：全部令牌名的字面量联合类型。

```ts
import { mqThemeVars, type MqThemeVarName } from '@mosquito/ui/styles/theme-vars'

const name: MqThemeVarName = 'colorPrimary'
const style = { color: mqThemeVars[name] }
```

## 暗色切换

系统深色偏好会自动应用暗色值；也可给祖先节点加 `mq-theme-dark` 类或 `data-mq-theme="dark"` 属性：

```html
<view class="mq-theme-dark">...</view>

<view data-mq-theme="dark">...</view>
```

两种写法共用 `variables.scss` 中的同一组声明，值以本页令牌表为准。局部定制可用 `mq-config-provider` 的 `theme` / `themeVars`，见 [主题](./theming.md)。

## 新增令牌

1. 在 `theme-tokens.json` 增加条目，填写 `light`、`dark`、`description`。
2. 在 `variables.scss` 的亮色与暗色块中补上对应的 `--mq-<name>` 声明（暗色与亮色同值可只写亮色块）。
3. 运行 `pnpm build:theme-vars` 重新生成产物，并更新上表。
4. 运行 `pnpm test` 验证令牌数量、变量与 JSON 一致。
