import { test as base, expect } from '@playwright/test'

/**
 * 所有 E2E 用例共用：收集浏览器运行期错误，用例结束后统一断言。
 *
 * 唯一放行项：VitePress 默认主题会请求 /favicon.ico，而本仓库 docs/public 没有该图标，
 * Chrome 会打印一条 404 console.error。它不影响文档渲染，按资源 URL 精确过滤；
 * 其他 console.error / pageerror 仍然会让用例失败。
 */
function isHarmlessVitePressWarning(message: {
  type(): string
  text(): string
  location(): { url: string }
}) {
  return (
    message.type() === 'error' &&
    message.text().includes('404') &&
    message.location().url.endsWith('/favicon.ico')
  )
}

export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(`[pageerror] ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error' && !isHarmlessVitePressWarning(message)) {
          errors.push(`[console.error] ${message.text()} (${message.location().url})`)
        }
      })

      await use()

      if (errors.length > 0) {
        await testInfo.attach('browser-diagnostics', {
          body: JSON.stringify({ errors }, null, 2),
          contentType: 'application/json',
        })
      }
      expect(errors, '页面不应出现 console.error 或未捕获异常').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
