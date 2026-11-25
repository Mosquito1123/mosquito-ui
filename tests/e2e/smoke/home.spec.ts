import { test, expect } from '../fixtures/test'

test('首页展示站点标题、简介与导航链接', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/mosquito-ui/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    '面向 uni-app（Vue 3）的轻量组件库，前缀 mq-。',
  )

  const hero = page.locator('.VPHero')
  await expect(hero).toBeVisible()
  await expect(hero.locator('h1 .name')).toHaveText('mosquito-ui')
  await expect(hero.locator('h1 .text')).toHaveText('轻量 uni-app 组件库')
  await expect(hero.locator('.tagline')).toContainText('前缀 mq-')
  await expect(hero.locator('.VPButton').filter({ hasText: '浏览组件' })).toHaveAttribute(
    'href',
    '/component/button.html',
  )

  const navLinks = page.locator('.VPNavBarMenuLink')
  await expect(navLinks.filter({ hasText: '指南' })).toBeVisible()
  await expect(navLinks.filter({ hasText: '安装' })).toBeVisible()
  await expect(navLinks.filter({ hasText: '组件' })).toBeVisible()
  await expect(navLinks.filter({ hasText: 'GitHub' })).toBeVisible()
})
