import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const root = process.cwd()
const stylesDir = resolve(root, 'packages/ui/src/styles')
const paths = {
  tokens: resolve(stylesDir, 'theme-tokens.json'),
  variables: resolve(stylesDir, 'variables.scss'),
  scss: resolve(stylesDir, 'theme-vars.scss'),
  ts: resolve(stylesDir, 'theme-vars.ts'),
  script: resolve(root, 'scripts/build-theme-vars.mjs'),
}

interface ThemeToken {
  light: string
  dark: string
  description: string
}

const tokens = JSON.parse(readFileSync(paths.tokens, 'utf8')) as Record<string, ThemeToken>
const variables = readFileSync(paths.variables, 'utf8')
const scss = readFileSync(paths.scss, 'utf8')
const ts = readFileSync(paths.ts, 'utf8')

const names = Object.keys(tokens)
const cssNames = names.map((name) => `--mq-${name}`)
const toCamel = (name: string) => name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())

function declarations(block: string): Map<string, string> {
  return new Map(
    [...block.matchAll(/(--mq-[a-z0-9-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  )
}

function blockAfter(pattern: RegExp): string {
  return variables.match(pattern)?.[1] ?? ''
}

// variables.scss 的三处声明块：亮色、系统深色偏好、显式暗色选择器。
const lightDecls = declarations(blockAfter(/page,\s*:root,\s*\.mq-theme-light\s*\{([\s\S]*?)\}/))
const mediaDarkDecls = declarations(
  blockAfter(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?\{([\s\S]*?)\}/),
)
const attrDarkDecls = declarations(blockAfter(/\.mq-theme-dark[^{]*\{([\s\S]*?)\}/))

describe('主题令牌生成流水线', () => {
  test('令牌数量与 variables.scss 中的 --mq-* 名称一致', () => {
    const inScss = new Set([...variables.matchAll(/--mq-[a-z0-9-]+/g)].map((match) => match[0]))
    expect(names.length).toBe(21)
    expect(names.length).toBe(inScss.size)
    expect(new Set(cssNames)).toEqual(inScss)
  })

  test('暗色选择器同时支持 class 与 data 属性', () => {
    expect(variables).toMatch(/\.mq-theme-dark,\s*\[data-mq-theme='dark'\]\s*\{/)
    expect(attrDarkDecls.size).toBe(mediaDarkDecls.size)
    expect(attrDarkDecls.size).toBeGreaterThan(0)
  })

  test('生成文件存在且包含全部变量与默认值', () => {
    for (const [name, token] of Object.entries(tokens)) {
      expect(scss, name).toContain(`'${name}': ${token.light},`)
      expect(scss, name).toContain(`'${name}': ${token.dark},`)
      expect(scss, name).toContain(`--mq-${name}: ${token.light};`)
      expect(scss, name).toContain(`--mq-${name}: ${token.dark};`)
      expect(ts, name).toContain(`${toCamel(name)}: 'var(--mq-${name}, ${token.light})',`)
    }
  })

  test('variables.scss 的亮色/暗色值与 JSON 一致', () => {
    for (const [cssName, value] of lightDecls) {
      const name = cssName.slice('--mq-'.length)
      expect(value, cssName).toBe(tokens[name]?.light)
    }
    for (const decls of [mediaDarkDecls, attrDarkDecls]) {
      for (const [cssName, value] of decls) {
        const name = cssName.slice('--mq-'.length)
        expect(value, cssName).toBe(tokens[name]?.dark)
      }
    }
    // 没有暗色覆盖的令牌在两个模式下同值。
    for (const [name, token] of Object.entries(tokens)) {
      if (!attrDarkDecls.has(`--mq-${name}`)) {
        expect(token.dark, name).toBe(token.light)
      }
    }
  })

  test('TS 类型包含所有键', () => {
    expect(ts).toContain('export const mqThemeVars')
    expect(ts).toContain('} as const')
    expect(ts).toMatch(/export type MqThemeVarName\s*=/)
    for (const name of names) {
      expect(ts, name).toContain(`'${toCamel(name)}'`)
    }
  })

  test('生成脚本可重复运行且输出不变', () => {
    const before = [readFileSync(paths.scss), readFileSync(paths.ts)]
    execFileSync(process.execPath, [paths.script], { cwd: root, stdio: 'ignore' })
    const after = [readFileSync(paths.scss), readFileSync(paths.ts)]
    expect(after).toEqual(before)
  })
})
