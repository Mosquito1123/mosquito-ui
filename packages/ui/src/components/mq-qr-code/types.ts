import type { QrCodeLevel } from './qrcode'

export type { QrCodeLevel } from './qrcode'

export interface MqQrCodeProps {
  /** 二维码内容。为空时发出 `error` 事件并显示文字占位。 */
  text?: string
  /** 二维码边长。数字按 px，字符串原样使用（如 `200px`）。默认 `200`。 */
  size?: number | string
  /** 纠错级别 `'L' | 'M' | 'Q' | 'H'`。优先级高于 `correctLevel`。默认 `'H'`。 */
  level?: QrCodeLevel
  /** 深色模块颜色。默认 `#000000`。 */
  colorDark?: string
  /** 浅色模块颜色。默认 `#ffffff`。 */
  colorLight?: string
  /** 模块四周的留白，单位 px。默认 `0`。 */
  margin?: number
  /** canvas 的 id，不传时自动生成。 */
  canvasId?: string
  /** 兼容别名：`level` 未提供时生效，等价于 wot-ui 的 `correctLevel`。 */
  correctLevel?: QrCodeLevel
}

export interface MqQrCodeEmits {
  click: [event: Event]
  error: [error: Error]
}

export interface MqQrCodeExpose {
  /** 立即重绘。 */
  draw: () => void
  /** H5 下导出 PNG data URL；无 canvas 时返回 `undefined`。 */
  toDataURL: () => string | undefined
}
