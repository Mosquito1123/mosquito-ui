import { afterEach, describe, expect, test, vi } from 'vitest'
import { useConfigProvider } from '@/composables/use-config-provider'

const g = globalThis as any

afterEach(() => {
  useConfigProvider().reset()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('useConfigProvider', () => {
  test('模块级状态在多次调用之间共享', () => {
    const a = useConfigProvider()
    const b = useConfigProvider()
    expect(a.theme.value).toBe('light')
    a.setTheme('dark')
    expect(b.theme.value).toBe('dark')
    a.setTheme('light')
  })

  test('cssVars 自动补 -- 前缀，themeVars 保留原始键', () => {
    const api = useConfigProvider()
    api.setThemeVar('color-primary', '#0f3d32')
    api.setThemeVar('--brand', 'red')
    expect(api.themeVars.value['color-primary']).toBe('#0f3d32')
    expect(api.cssVars.value).toEqual({ '--color-primary': '#0f3d32', '--brand': 'red' })
    api.setThemeVars({ radius: '4px', '--brand': 'blue' })
    expect(api.themeVars.value).toEqual({
      'color-primary': '#0f3d32',
      '--brand': 'blue',
      radius: '4px',
    })
    expect(api.cssVars.value['--radius']).toBe('4px')
  })

  test('空键被忽略，reset 恢复默认主题并清空变量', () => {
    const api = useConfigProvider()
    api.setTheme('dark')
    api.setThemeVar('   ', 'ignored')
    api.setThemeVar('brand', 'green')
    api.reset()
    expect(api.theme.value).toBe('light')
    expect(api.themeVars.value).toEqual({})
    expect(api.cssVars.value).toEqual({})
  })

  test('H5 且 applyToRoot 时写入 document.documentElement，reset 时移除', () => {
    const root = document.documentElement
    const api = useConfigProvider({ applyToRoot: true })
    api.setThemeVar('--brand', 'purple')
    expect(root.style.getPropertyValue('--brand')).toBe('purple')
    api.reset()
    expect(root.style.getPropertyValue('--brand')).toBe('')
  })

  test('非 H5 或无 document 时不碰 DOM', () => {
    const root = document.documentElement
    vi.spyOn(g.uni, 'getSystemInfoSync').mockReturnValue({ platform: 'app-plus' })
    const api = useConfigProvider({ applyToRoot: true })
    api.setThemeVar('--skip', 'yes')
    expect(root.style.getPropertyValue('--skip')).toBe('')

    vi.restoreAllMocks()
    vi.stubGlobal('document', undefined)
    api.setThemeVar('--skip2', 'yes')
    expect(api.cssVars.value['--skip2']).toBe('yes')
  })
})
