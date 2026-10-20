/** 对 `uni` 全局能力做最小声明，避免组件直接依赖平台类型包。 */

export interface UniCanvasContext {
  setStrokeStyle: (color: string) => void
  setFillStyle: (color: string) => void
  setLineWidth: (width: number) => void
  setLineCap: (cap: 'butt' | 'round' | 'square') => void
  setLineJoin: (join: 'miter' | 'round' | 'bevel') => void
  beginPath: () => void
  moveTo: (x: number, y: number) => void
  lineTo: (x: number, y: number) => void
  stroke: () => void
  fillRect: (x: number, y: number, width: number, height: number) => void
  clearRect: (x: number, y: number, width: number, height: number) => void
  draw: (reserve?: boolean, callback?: () => void) => void
}

export interface UniCanvasToTempFilePathOptions {
  canvasId: string
  fileType?: string
  quality?: number
  destWidth?: number
  destHeight?: number
  success?: (result: { tempFilePath: string }) => void
  fail?: (error: unknown) => void
}

export interface UniPlatformApi {
  getSystemInfoSync?: () => { windowHeight?: number }
  createCanvasContext?: (canvasId: string, instance?: unknown) => UniCanvasContext
  canvasToTempFilePath?: (
    options: UniCanvasToTempFilePathOptions,
    instance?: unknown,
  ) => void
}

export function getUni(): UniPlatformApi | undefined {
  const host = globalThis as typeof globalThis & { uni?: UniPlatformApi }
  return host.uni
}
