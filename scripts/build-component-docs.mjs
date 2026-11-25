/**
 * 为缺少逐组件文档的组件生成 docs/component/<name>.md。
 * 以 types.ts 的 Props / Emits 接口和 README 组件表为唯一事实来源，不覆盖已有人写好的文档。
 * 运行：pnpm docs:gen
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const componentsDir = join(root, 'packages/ui/src/components')
const docsDir = join(root, 'docs/component')
mkdirSync(docsDir, { recursive: true })

const readme = readFileSync(join(root, 'README.md'), 'utf8')
const capability = new Map()
for (const line of readme.split('\n')) {
  const match = line.match(/^\|\s*`mq-([\w-]+)`[^|]*\|\s*([^|]+?)\s*\|/)
  if (match) {
    capability.set(match[1], match[2].replace(/\\\|/g, '|'))
  }
}

function captureBlock(source, name) {
  const start = source.indexOf(`export interface ${name} {`)
  if (start < 0) {
    return ''
  }
  const open = source.indexOf('{', start)
  let depth = 0
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1
    if (source[i] === '}' && --depth === 0) {
      return source.slice(open + 1, i)
    }
  }
  return ''
}

function parseFields(block) {
  if (!block) {
    return []
  }
  const fields = []
  let comment = ''
  for (const raw of block.split('\n')) {
    const line = raw.trim()
    if (line.startsWith('/**')) {
      comment = line.replace(/^\/\*\*|\*\/$/g, '').trim()
      if (line.endsWith('*/')) {
        comment = comment.replace(/\*\/$/, '').trim()
      }
      continue
    }
    if (line.startsWith('*')) {
      comment = `${comment} ${line.replace(/^\*|\*\/$/g, '').trim()}`.trim()
      continue
    }
    if (!line) {
      continue
    }
    const match = line.match(/^(\w+)(\??):\s*(.+)$/)
    if (match) {
      fields.push({ name: match[1], optional: match[2] === '?', type: match[3].replace(/;.*$/, '').trim(), comment })
      comment = ''
    }
  }
  return fields
}

function toPascal(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const generated = []
for (const dir of readdirSync(componentsDir).sort()) {
  if (!dir.startsWith('mq-')) {
    continue
  }
  const name = dir.slice(3)
  const doc = join(docsDir, `${name}.md`)
  const GENERATED_MARKER = '<!-- 由 scripts/build-component-docs.mjs 生成 -->'
  if (existsSync(doc) && !readFileSync(doc, 'utf8').includes(GENERATED_MARKER)) {
    // 人手写的文档优先，绝不覆盖。
    continue
  }
  const typeFile = join(componentsDir, dir, 'types.ts')
  const source = existsSync(typeFile) ? readFileSync(typeFile, 'utf8') : ''
  const component = toPascal(name)
  const props = parseFields(captureBlock(source, `Mq${component}Props`))
  const emits = parseFields(captureBlock(source, `Mq${component}Emits`))
  const intro = capability.get(name) || '面向 uni-app（Vue 3）的轻量组件。'
  const extraTypes = [...source.matchAll(/export\s+(?:type|interface)\s+(Mq\w+)\b/g)]
    .map((match) => match[1])
    .filter((value, index, all) => all.indexOf(value) === index)

  const escapeCell = (value) => String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const lines = [
    GENERATED_MARKER,
    '',
    `# Mq${component} \`mq-${name}\``,
    '',
    intro,
    '',
    '## 何时使用',
    '',
    `在 uni-app（Vue 3）模板中直接使用 \`<mq-${name}>\`，按需传入下方 API 中的属性。样式走 \`--mq-*\` CSS 变量，easycom 映射请指向同目录的 \`.vue\` 文件。`,
    '',
    '## 示例',
    '',
    '```vue',
    `<mq-${name} />`,
    '```',
    '',
    '## API',
    '',
    '### Props',
    '',
  ]

  if (props.length) {
    lines.push('| 名称 | 类型 | 必填 | 说明 |', '| --- | --- | --- | --- |')
    for (const prop of props) {
      lines.push(`| \`${prop.name}\` | \`${escapeCell(prop.type)}\` | ${prop.optional ? '否' : '是'} | ${escapeCell(prop.comment || '—')} |`)
    }
  } else {
    lines.push('该组件没有声明 Props。')
  }

  lines.push('', '### Events', '')
  if (emits.length) {
    lines.push('| 事件 | 参数 | 说明 |', '| --- | --- | --- | --- |')
    for (const event of emits) {
      lines.push(`| \`${event.name}\` | \`${escapeCell(event.type)}\` | ${escapeCell(event.comment || '—')} |`)
    }
  } else {
    lines.push('该组件没有声明事件。')
  }

  lines.push('', '### 插槽与方法', '', '插槽和暴露方法以组件源码 `packages/ui/src/components/' + dir + '/` 为准。')
  if (extraTypes.length) {
    lines.push('', '### 导出类型', '', extraTypes.map((type) => `\`${type}\``).join('、') + '。')
  }
  lines.push('', '## 主题变量', '', '颜色、圆角、字号与层级走 `--mq-*` 变量，完整清单见[主题令牌](/guide/theme-vars)。', '')

  writeFileSync(doc, lines.join('\n'))
  generated.push(name)
}

console.log(`已生成 ${generated.length} 篇组件文档，已有文档保持不变。`)
