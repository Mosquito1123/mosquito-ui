export type MqThemeMode = 'light' | 'dark'

export interface MqConfigProviderProps {
  theme?: MqThemeMode
  /** CSS 变量键值。键可省略 `--` 前缀，会自动补上。 */
  themeVars?: Record<string, string>
  /** 全局语言标识，例如 `zh-CN` / `en-US`。变化时切换全部组件的文案。 */
  locale?: string
}
