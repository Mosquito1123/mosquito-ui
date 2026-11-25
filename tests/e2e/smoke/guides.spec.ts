import { test, expect } from '../fixtures/test'

const guides = [
  { path: '/guide/getting-started', title: '开始使用', body: 'uni-app' },
  { path: '/guide/theming', title: '主题', body: '--mq-color-primary' },
  { path: '/guide/faq', title: '常见问题', body: 'easycom' },
] as const

for (const guide of guides) {
  test(`指南页 ${guide.path} 可打开且有正文`, async ({ page }) => {
    await page.goto(guide.path)
    // preview 对直接输入的无后缀路径不做跳转；站内链接则带 .html，两种都接受。
    await expect(page).toHaveURL(new RegExp(`${guide.path}(?:\\.html)?$`))

    const doc = page.locator('.vp-doc')
    await expect(doc.locator('h1')).toContainText(guide.title)
    await expect(doc.locator('p').first()).not.toBeEmpty()
    await expect(doc).toContainText(guide.body)
  })
}
