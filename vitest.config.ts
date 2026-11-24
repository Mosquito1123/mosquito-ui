import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

/** uni-app 的原生组件在 jsdom 中不是 Vue 组件，交给编译器当自定义元素处理，避免测试噪声。 */
const uniElements = new Set([
  'view',
  'text',
  'image',
  'swiper',
  'swiper-item',
  'scroll-view',
  'canvas',
  'picker',
  'picker-view',
  'picker-view-column',
  'video',
  'camera',
  'slider',
  'switch',
  'checkbox',
  'checkbox-group',
  'radio',
  'radio-group',
  'form',
  'label',
  'navigator',
  'rich-text',
  'web-view',
  'cover-view',
  'cover-image',
  'movable-area',
  'movable-view',
  'match-media',
  'page-container',
  'share-element',
  'keyboard-accessory',
  'ad',
  'official-account',
  'open-data',
  'progress',
  'icon',
  'loading',
  'toast',
  'mask',
])

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => uniElements.has(tag),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages/ui/src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['packages/ui/test/**/*.test.ts', 'tests/**/*.test.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['packages/ui/src/**/*.{ts,vue}'],
      exclude: ['**/*.uvue', '**/types.ts', '**/*.d.ts', '**/index.scss', '**/styles/**', '**/index.ts'],
      all: false,
      thresholds:
        process.env.COMPONENT_TEST === 'true'
          ? undefined
          : { statements: 60, branches: 55, functions: 60, lines: 60 },
    },
  },
})
