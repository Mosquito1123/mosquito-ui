/**
 * 根据组件目录和 composables 重新生成 packages/ui/src/index.ts。
 * 新增组件/类型后运行：pnpm sync:exports
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const srcDir = join(root, 'packages/ui/src')
const componentsDir = join(srcDir, 'components')

const componentLines = []
const typeLines = []

for (const dir of readdirSync(componentsDir).sort()) {
  if (!dir.startsWith('mq-')) {
    continue
  }
  const files = readdirSync(join(componentsDir, dir))
  const vue = files.find((file) => /^Mq[A-Z].*\.vue$/.test(file))
  if (!vue) {
    continue
  }
  const name = vue.replace(/\.vue$/, '')
  componentLines.push(`export { default as ${name} } from './components/${dir}/${vue}'`)

  if (files.includes('types.ts')) {
    const content = readFileSync(join(componentsDir, dir, 'types.ts'), 'utf8')
    const names = [...content.matchAll(/export\s+(?:interface|type|enum)\s+([A-Z]\w*)/g)]
      .map((match) => match[1])
      .filter((value, index, all) => all.indexOf(value) === index)
      .sort()
    if (names.length) {
      typeLines.push(`export type { ${names.join(', ')} } from './components/${dir}/types'`)
    }
  }
}

const utilLines = [
  "export { hideToast, showToast, toastState } from './utils/toast'",
  "export { hideNotify, showNotify, notifyState } from './utils/notify'",
  "export { closeSwipeActions } from './utils/swipe'",
  "export { closeOutside, registerOutsideCloser } from './utils/queue'",
]

const utilTypeLines = [
  "export type { MqDatetimeColumnType, MqDatetimeType } from './utils/datetime'",
  "export type { MqCascaderOption } from './utils/cascader'",
  "export type { MqSelectOption, MqSelectValue } from './utils/select'",
  "export type { MqTreeNode, MqTreeRow } from './utils/tree'",
  "export type { MqWaterfallCell, MqWaterfallHeight } from './utils/waterfall'",
  "export type { MqRollingChar } from './utils/rolling-number'",
  "export type { MqOptionValue } from './utils/model'",
  "export { attachToastHost } from './utils/toast'",
]

const previewLines = [
  "export { showImagePreview, hideImagePreview, imagePreviewState } from './utils/image-preview'",
  "export { showVideoPreview, hideVideoPreview, videoPreviewState } from './utils/video-preview'",
]

const content = [
  '// 组件由 scripts/sync-exports.mjs 生成，请勿手动编辑。',
  '// 组件',
  ...componentLines,
  '',
  '// 类型',
  ...typeLines,
  '',
  '// 工具函数',
  ...utilLines,
  ...utilTypeLines,
  '',
  '// 媒体预览',
  ...previewLines,
  '',
  '// 组合式函数',
  "export * from './composables'",
  '',
].join('\n')

writeFileSync(join(srcDir, 'index.ts'), content)
console.log(`已生成 index.ts：${componentLines.length} 个组件，${typeLines.length} 组类型导出。`)
