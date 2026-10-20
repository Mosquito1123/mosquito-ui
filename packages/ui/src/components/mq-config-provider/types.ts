export type MqThemeMode = 'light' | 'dark'

export interface MqConfigProviderProps {
  theme?: MqThemeMode
  /** CSS 变量键值。键可省略 `--` 前缀，会自动补上。 */
  themeVars?: Record<string, string>
}
