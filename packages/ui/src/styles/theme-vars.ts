// 由 scripts/build-theme-vars.mjs 从 theme-tokens.json 生成，请勿手动编辑。
// 令牌唯一数据源：packages/ui/src/styles/theme-tokens.json

export const mqThemeVars = {
  colorPrimary: 'var(--mq-color-primary, #0f3d32)',
  colorPrimaryText: 'var(--mq-color-primary-text, #f7f4ee)',
  colorSuccess: 'var(--mq-color-success, #2f7d4a)',
  colorSuccessText: 'var(--mq-color-success-text, #f4fbf6)',
  colorWarning: 'var(--mq-color-warning, #b86e00)',
  colorWarningText: 'var(--mq-color-warning-text, #fff8ee)',
  colorDanger: 'var(--mq-color-danger, #b42318)',
  colorDangerText: 'var(--mq-color-danger-text, #fff6f5)',
  text: 'var(--mq-text, #1c1915)',
  textSecondary: 'var(--mq-text-secondary, #6f675e)',
  bg: 'var(--mq-bg, #fffcf7)',
  bgMuted: 'var(--mq-bg-muted, #f6f1e8)',
  bgActive: 'var(--mq-bg-active, #ebe4d8)',
  border: 'var(--mq-border, #e6e2da)',
  mask: 'var(--mq-mask, rgba(22, 18, 12, 0.45))',
  radius: 'var(--mq-radius, 8px)',
  fontSize: 'var(--mq-font-size, 14px)',
  duration: 'var(--mq-duration, 200ms)',
  zPopup: 'var(--mq-z-popup, 1000)',
  zToast: 'var(--mq-z-toast, 1100)',
  safeBg: 'var(--mq-safe-bg, transparent)',
} as const

export type MqThemeVarName =
  | 'colorPrimary'
  | 'colorPrimaryText'
  | 'colorSuccess'
  | 'colorSuccessText'
  | 'colorWarning'
  | 'colorWarningText'
  | 'colorDanger'
  | 'colorDangerText'
  | 'text'
  | 'textSecondary'
  | 'bg'
  | 'bgMuted'
  | 'bgActive'
  | 'border'
  | 'mask'
  | 'radius'
  | 'fontSize'
  | 'duration'
  | 'zPopup'
  | 'zToast'
  | 'safeBg'
