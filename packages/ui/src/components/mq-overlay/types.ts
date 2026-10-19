export interface MqOverlayProps {
  /** 是否展示。对齐 wot-ui `show`。 */
  show?: boolean
  duration?: number
  zIndex?: number
}

export interface MqOverlayEmits {
  (e: 'click', event: Event): void
}
