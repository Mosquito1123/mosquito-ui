import { computed, reactive, toRef, type ComputedRef, type Ref } from 'vue'
import type { MqThemeMode } from '../components/mq-config-provider/types'

export interface UseConfigProviderOptions {
  theme?: MqThemeMode
  /** CSS 变量键值，键可省略 `--` 前缀。传入时合并到全局状态。 */
  themeVars?: Record<string, string>
  /** H5 下是否把变量写到 `document.documentElement`，默认 false（避免隐式全局副作用）。 */
  applyToRoot?: boolean
}

export interface UseConfigProviderReturn {
  theme: Ref<MqThemeMode>
  themeVars: Ref<Record<string, string>>
  setTheme: (theme: MqThemeMode) => void
  setThemeVar: (key: string, value: string) => void
  setThemeVars: (vars: Record<string, string>) => void
  reset: () => void
  cssVars: ComputedRef<Record<string, string>>
}

interface SharedState {
  theme: MqThemeMode
  themeVars: Record<string, string>
}

const DEFAULT_THEME: MqThemeMode = 'light'

/** 模块级单例：所有 `useConfigProvider()` 看到的是同一份主题。 */
const state = reactive<SharedState>({
  theme: DEFAULT_THEME,
  themeVars: {},
})

let appliedKeys: string[] = []

function withPrefix(key: string): string {
  const trimmed = String(key ?? '').trim()
  if (!trimmed) {
    return ''
  }
  return trimmed.startsWith('--') ? trimmed : `--${trimmed}`
}

function styleVars(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(state.themeVars)) {
    if (value == null || value === '') {
      continue
    }
    const name = withPrefix(key)
    if (name) {
      result[name] = String(value)
    }
  }
  return result
}

function isH5(): boolean {
  try {
    const host = globalThis as typeof globalThis & {
      uni?: { getSystemInfoSync?: () => { platform?: string } }
    }
    const platform = host.uni?.getSystemInfoSync?.()?.platform
    if (typeof platform === 'string') {
      return platform.toLowerCase() === 'h5'
    }
  } catch {
    // 平台信息不可用时退回 DOM 判断。
  }
  return typeof globalThis.document !== 'undefined'
}

function documentRoot(): HTMLElement | undefined {
  if (!isH5()) {
    return undefined
  }
  const root = globalThis.document?.documentElement
  return root && typeof root.style?.setProperty === 'function' ? root : undefined
}

function applyToDocument() {
  const root = documentRoot()
  if (!root) {
    return
  }
  const styles = styleVars()
  for (const [key, value] of Object.entries(styles)) {
    root.style.setProperty(key, value)
  }
  for (const key of appliedKeys) {
    if (!(key in styles)) {
      root.style.removeProperty(key)
    }
  }
  appliedKeys = Object.keys(styles)
}

function clearDocument() {
  const root = documentRoot()
  if (root) {
    for (const key of appliedKeys) {
      root.style.removeProperty(key)
    }
  }
  appliedKeys = []
}

/**
 * 全局主题状态。非 H5 环境（或 `applyToRoot: false`）只维护响应式数据，不碰 DOM。
 */
export function useConfigProvider(options: UseConfigProviderOptions = {}): UseConfigProviderReturn {
  const shouldApply = options.applyToRoot === true
  if (options.theme !== undefined) {
    state.theme = options.theme === 'dark' ? 'dark' : 'light'
  }
  if (options.themeVars) {
    state.themeVars = { ...state.themeVars, ...options.themeVars }
  }
  if (shouldApply) {
    applyToDocument()
  }

  function setTheme(theme: MqThemeMode) {
    state.theme = theme === 'dark' ? 'dark' : 'light'
    if (shouldApply) {
      applyToDocument()
    }
  }

  function setThemeVar(key: string, value: string) {
    const name = String(key ?? '').trim()
    if (!name) {
      return
    }
    state.themeVars = { ...state.themeVars, [name]: String(value ?? '') }
    if (shouldApply) {
      applyToDocument()
    }
  }

  function setThemeVars(vars: Record<string, string>) {
    const next: Record<string, string> = { ...state.themeVars }
    for (const [key, value] of Object.entries(vars ?? {})) {
      const name = String(key ?? '').trim()
      if (name) {
        next[name] = String(value ?? '')
      }
    }
    state.themeVars = next
    if (shouldApply) {
      applyToDocument()
    }
  }

  function reset() {
    state.theme = DEFAULT_THEME
    state.themeVars = {}
    clearDocument()
  }

  return {
    theme: toRef(state, 'theme'),
    themeVars: toRef(state, 'themeVars'),
    setTheme,
    setThemeVar,
    setThemeVars,
    reset,
    cssVars: computed(styleVars),
  }
}
