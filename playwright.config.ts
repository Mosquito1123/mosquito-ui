import { defineConfig } from '@playwright/test'

/**
 * 文档站 E2E 冒烟测试。
 *
 * 本机不缓存 Playwright 自带的 Chromium，直接复用系统 Google Chrome：
 * channel: 'chrome' 会走 /Applications/Google Chrome.app，不触发浏览器下载。
 *
 * webServer 只负责启动 VitePress preview（读取 docs/.vitepress/dist）。
 * 首次运行 / CI 需先执行 `pnpm docs:build` 生成最新产物。
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  outputDir: 'test-results/e2e',
  reporter: process.env.CI
    ? ([['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] as const)
    : ([['list']] as const),
  use: {
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    actionTimeout: 8_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // 显式命名项目，保证 `playwright test --project=chromium` 可用。
  projects: [{ name: 'chromium', use: { channel: 'chrome' } }],
  webServer: {
    command: 'pnpm docs:preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
