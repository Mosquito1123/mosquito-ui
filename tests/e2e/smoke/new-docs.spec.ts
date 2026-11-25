import { test, expect } from '../fixtures/test'

/** 抽样本轮新增的组件 / 组合式函数文档：标题、正文、API 段落都要渲染出来。 */
const newDocs = [
  { path: '/component/icon', title: 'MqIcon', body: 'unicode', api: true },
  { path: '/component/qr-code', title: 'MqQrCode', body: 'canvas', api: true },
  { path: '/component/use-toast', title: 'useToast', body: 'showToast', api: true },
] as const

for (const docInfo of newDocs) {
  test(`${docInfo.path} 文档渲染正常`, async ({ page }) => {
    await page.goto(docInfo.path)
    // preview 对直接输入的无后缀路径不做跳转；站内链接则带 .html，两种都接受。
    await expect(page).toHaveURL(new RegExp(`${docInfo.path}(?:\\.html)?$`))

    const doc = page.locator('.vp-doc')
    await expect(doc.locator('h1')).toContainText(docInfo.title)
    await expect(doc.locator('p').first()).not.toBeEmpty()
    await expect(doc).toContainText(docInfo.body)
    if (docInfo.api) {
      await expect(doc.locator('h2').filter({ hasText: 'API' })).toBeVisible()
    }
  })
}
