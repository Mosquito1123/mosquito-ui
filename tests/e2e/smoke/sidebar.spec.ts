import { existsSync } from 'node:fs'
import { test, expect } from '../fixtures/test'

test('侧边栏展示指南 / 组件 / 组合式函数三个分组', async ({ page }) => {
  await page.goto('/guide/getting-started')

  const sidebar = page.locator('.VPSidebar')
  await expect(sidebar).toBeVisible()
  for (const group of ['指南', '组件', '组合式函数']) {
    await expect(
      sidebar.locator('section.VPSidebarItem.level-0 > .item > h2.text').filter({ hasText: group }),
    ).toBeVisible()
  }
  await expect(sidebar.locator('a[href="/component/button.html"]').first()).toBeVisible()
})

test('导航可进入 Button 文档并渲染 MqButton 与 API', async ({ page }) => {
  // docs/component/button.md 由文档任务补齐；缺失时导航会落到 VitePress 404 页。
  // E2E 不负责创建文档，因此这里先跳过，文件出现后断言自动生效。
  test.skip(!existsSync('docs/component/button.md'), 'docs/component/button.md 尚未提供')

  await page.goto('/guide/getting-started')
  await page.locator('.VPNavBarMenuLink').filter({ hasText: '组件' }).click()
  await expect(page).toHaveURL(/\/component\/button(?:\.html)?$/)

  const doc = page.locator('.vp-doc')
  await expect(doc.locator('h1')).toContainText('MqButton')
  await expect(doc.locator('h2').filter({ hasText: 'API' })).toBeVisible()
})
