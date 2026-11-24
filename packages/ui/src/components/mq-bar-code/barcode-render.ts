/** 把 `bars` 绘制到画布的纯函数工具，不访问 DOM，便于单测。 */

export interface BarCodeRenderOptions {
  /** 画布宽度。大于 0 时模块宽度按宽度缩放；为 0 时使用 `lineWidth`。 */
  width: number
  /** 画布高度（含文字区）。 */
  height: number
  /** 单个模块的基准宽度，单位 px。默认 2。 */
  lineWidth: number
  /** 是否在条码下方/上方显示文字。 */
  displayValue: boolean
  /** 文字位置。默认 `bottom`。 */
  textPosition: 'top' | 'bottom'
  /** 文字字号。默认 12。 */
  fontSize: number
  /** 文字与条码的间距。默认 4。 */
  textMargin: number
  /** 条码与文字颜色。 */
  color: string
  /** 背景色。 */
  background: string
}

export interface BarCodeLayout {
  width: number
  height: number
  moduleWidth: number
  barTop: number
  barHeight: number
  textY: number
}

/**
 * 同时兼容 uni 的 `createCanvasContext` 与 H5 的 2d context。
 * 所有方法都是可选的，缺失时跳过对应绘制步骤。
 */
export interface BarCodeCanvasContext {
  fillRect: (x: number, y: number, width: number, height: number) => void
  clearRect?: (x: number, y: number, width: number, height: number) => void
  setFillStyle?: (color: string) => void
  setFontSize?: (size: number) => void
  setTextAlign?: (align: 'left' | 'center' | 'right') => void
  fillText?: (text: string, x: number, y: number) => void
  draw?: (reserve?: boolean) => void
  fillStyle?: string
  font?: string
  textAlign?: string
}

export function countModules(bars: number[]): number {
  return bars.reduce((total, width) => total + width, 0)
}

/** 计算画布尺寸、模块宽度与文字位置。 */
export function resolveBarCodeLayout(bars: number[], options: BarCodeRenderOptions): BarCodeLayout {
  const modules = Math.max(countModules(bars), 1)
  const width = options.width > 0 ? options.width : modules * Math.max(1, options.lineWidth)
  const moduleWidth = options.width > 0 ? width / modules : Math.max(1, options.lineWidth)
  const textHeight = options.displayValue ? options.fontSize + options.textMargin : 0
  const barHeight = Math.max(1, options.height - textHeight)
  const barTop = options.textPosition === 'top' ? textHeight : 0
  const textY = options.textPosition === 'top' ? options.fontSize : options.height - options.textMargin

  return { width, height: options.height, moduleWidth, barTop, barHeight, textY }
}

function applyFill(context: BarCodeCanvasContext, color: string): void {
  if (typeof context.setFillStyle === 'function') {
    context.setFillStyle(color)
  } else {
    context.fillStyle = color
  }
}

/** 绘制条码（奇数下标是白条，只填黑条），可选文字标注。 */
export function drawBarCode(
  context: BarCodeCanvasContext,
  bars: number[],
  displayText: string,
  options: BarCodeRenderOptions,
): BarCodeLayout {
  const layout = resolveBarCodeLayout(bars, options)

  context.clearRect?.(0, 0, layout.width, layout.height)
  if (options.background) {
    applyFill(context, options.background)
    context.fillRect(0, 0, layout.width, layout.height)
  }

  applyFill(context, options.color)
  let x = 0
  bars.forEach((width, index) => {
    if (index % 2 === 0) {
      context.fillRect(x, layout.barTop, width * layout.moduleWidth, layout.barHeight)
    }
    x += width * layout.moduleWidth
  })

  if (options.displayValue && displayText) {
    if (typeof context.setFontSize === 'function') {
      context.setFontSize(options.fontSize)
    } else {
      context.font = `${options.fontSize}px sans-serif`
    }
    if (typeof context.setTextAlign === 'function') {
      context.setTextAlign('center')
    } else {
      context.textAlign = 'center'
    }
    context.fillText?.(displayText, layout.width / 2, layout.textY)
  }

  context.draw?.()
  return layout
}
