/**
 * 根据 packages/ui/src/components 的实际目录重新生成 README 里的 easycom 映射。
 * 新增组件后运行：pnpm sync:easycom
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const componentsDir = join(root, 'packages/ui/src/components')
const custom = {}

for (const dir of readdirSync(componentsDir).sort()) {
  if (!dir.startsWith('mq-')) {
    continue
  }
  const files = readdirSync(join(componentsDir, dir))
  const vue = files.find((file) => /^Mq[A-Z].*\.(vue)$/.test(file))
  if (!vue) {
    continue
  }
  custom[`^${dir}$`] = `@mosquito/ui/components/${dir}/${vue}`
}

const START = '<!-- easycom:start -->'
const END = '<!-- easycom:end -->'

for (const rel of ['README.md', 'packages/ui/README.md']) {
  const file = join(root, rel)
  const text = readFileSync(file, 'utf8')
  const start = text.indexOf(START)
  const end = text.indexOf(END)
  if (start < 0 || end < 0 || end < start) {
    throw new Error(`${rel} 缺少 easycom 标记`)
  }
  const block = text.slice(start + START.length, end)
  const match = block.match(/```json\s*([\s\S]*?)```/)
  if (!match) {
    throw new Error(`${rel} 的 easycom 标记里没有 json 代码块`)
  }
  const data = JSON.parse(match[1])
  data.easycom = { autoscan: true, custom }
  const next = `\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`
  writeFileSync(file, text.slice(0, start + START.length) + next + text.slice(end))
}

console.log(`已同步 ${Object.keys(custom).length} 个组件的 easycom 映射到两个 README。`)
