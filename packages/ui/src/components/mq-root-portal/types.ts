export interface MqRootPortalProps {
  /** Teleport 目标选择器。默认 `'body'`。 */
  to?: string
  /** 关闭传送，改为原位渲染。默认 `false`。 */
  disabled?: boolean
}
