import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

/**
 * 全站中文，沿用 VitePress 默认主题。
 * 页脚文案由 config.mts 的 themeConfig.footer 提供。
 */
export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'zh-CN'
    }
  },
} satisfies Theme
