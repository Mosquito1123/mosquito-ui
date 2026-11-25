/**
 * 读取 theme-tokens.json，生成 theme-vars.scss 与 theme-vars.ts。
 * 令牌唯一数据源：packages/ui/src/styles/theme-tokens.json
 * 新增/修改令牌后运行：pnpm build:theme-vars
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stylesDir = join(root, 'packages/ui/src/styles')
const tokensPath = join(stylesDir, 'theme-tokens.json')

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'))
const entries = Object.entries(tokens)

if (!entries.length) {
  throw new Error('theme-tokens.json 中没有令牌。')
}

/** color-primary -> colorPrimary；z-popup -> zPopup */
function toCamel(name) {
  return name.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

const seen = new Set()
for (const [name, token] of entries) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    throw new Error(`非法令牌名：${name}`)
  }
  for (const field of ['light', 'dark', 'description']) {
    if (typeof token?.[field] !== 'string' || !token[field]) {
      throw new Error(`令牌 ${name} 缺少字符串字段 ${field}。`)
    }
  }
  const camelName = toCamel(name)
  if (seen.has(camelName)) {
    throw new Error(`令牌 ${name} 的 TS 键 ${camelName} 与其他令牌冲突。`)
  }
  seen.add(camelName)
}

const scssLines = [
  '// 由 scripts/build-theme-vars.mjs 从 theme-tokens.json 生成，请勿手动编辑。',
  '// 令牌唯一数据源：packages/ui/src/styles/theme-tokens.json',
  '// 运行时 CSS 变量仍由 variables.scss 定义，本文件只提供构建期 map 与组件可用的片段。',
  '',
  '// 亮色令牌 map。',
  '$mq-theme-vars: (',
  ...entries.map(([name, token]) => `  '${name}': ${token.light},`),
  ');',
  '',
  '// 暗色令牌 map；明暗同值的令牌（尺寸/层级等）两项一致。',
  '$mq-theme-vars-dark: (',
  ...entries.map(([name, token]) => `  '${name}': ${token.dark},`),
  ');',
  '',
  '// CSS 变量片段：在容器上 @include 即可声明全部 --mq-* 变量（亮色）。',
  '@mixin mq-theme-vars-light {',
  ...entries.map(([name, token]) => `  --mq-${name}: ${token.light};`),
  '}',
  '',
  "// CSS 变量片段：暗色值，配合 .mq-theme-dark / [data-mq-theme='dark'] 使用。",
  '@mixin mq-theme-vars-dark {',
  ...entries.map(([name, token]) => `  --mq-${name}: ${token.dark};`),
  '}',
  '',
]

const tsLines = [
  '// 由 scripts/build-theme-vars.mjs 从 theme-tokens.json 生成，请勿手动编辑。',
  '// 令牌唯一数据源：packages/ui/src/styles/theme-tokens.json',
  '',
  'export const mqThemeVars = {',
  ...entries.map(([name, token]) => `  ${toCamel(name)}: 'var(--mq-${name}, ${token.light})',`),
  '} as const',
  '',
  'export type MqThemeVarName =',
  ...entries.map(([name]) => `  | '${toCamel(name)}'`),
  '',
]

writeFileSync(join(stylesDir, 'theme-vars.scss'), scssLines.join('\n'))
writeFileSync(join(stylesDir, 'theme-vars.ts'), tsLines.join('\n'))
console.log(`已生成 theme-vars.scss / theme-vars.ts：${entries.length} 个令牌。`)
