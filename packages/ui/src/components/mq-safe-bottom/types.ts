export interface MqSafeBottomProps {
  /**
   * 背景色。默认 `transparent`。
   * 同时写到行内 `background-color` 和 CSS 变量 `--mq-safe-bg`，
   * 安全区留白和插槽内容用同一块底色。
   * 空字符串视为透明。可传 `#fffcf7`、`rgb()`、`var(--mq-bg)`。
   */
  bg?: string
}
