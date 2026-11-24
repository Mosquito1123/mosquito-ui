import type { BarCodeFormat } from './barcode'

export type { BarCodeFormat } from './barcode'

export type MqBarCodeTextPosition = 'top' | 'bottom'

export interface MqBarCodeProps {
  /** 条码内容。为空或含非法字符时发出 `error` 事件并显示文字占位。 */
  text?: string
  /** 条码格式。当前仅实现 `CODE128`，其余格式会发出 `error` 事件。默认 `CODE128`。 */
  format?: BarCodeFormat
  /** 画布宽度，单位 px。大于 0 时模块按宽度缩放；为 0 时按 `lineWidth` 自动计算。默认 `0`。 */
  width?: number
  /** 画布高度，单位 px。默认 `60`。 */
  height?: number
  /** 单个模块的基准宽度，单位 px（`width` 为 0 时生效）。默认 `2`。 */
  lineWidth?: number
  /** 是否显示文字标注。默认 `true`。 */
  displayValue?: boolean
  /** 文字位置。默认 `bottom`。 */
  textPosition?: MqBarCodeTextPosition
  /** 条码与文字颜色。默认 `#000000`。 */
  color?: string
  /** 背景色。默认 `#ffffff`。 */
  background?: string
  /** canvas 的 id，不传时自动生成。 */
  canvasId?: string
}

export interface MqBarCodeEmits {
  /** 内容是否可编码，绘制前发出。 */
  valid: [valid: boolean]
  error: [error: Error]
}

export interface MqBarCodeExpose {
  /** 立即重绘。 */
  draw: () => void
}
