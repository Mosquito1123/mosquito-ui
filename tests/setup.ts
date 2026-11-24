/**
 * 组件测试的统一运行环境。
 *
 * 组件面向 uni-app，测试跑在 jsdom 中，因此这里提供一个最小的 `uni` 兼容层。
 * 各测试可以用 `vi.spyOn(uni, 'xxx')` 覆盖具体行为。
 */
import { vi } from 'vitest'

type UnknownRecord = Record<string, unknown>

function noopQuery() {
  const query: UnknownRecord = {
    select: () => query,
    selectAll: () => query,
    in: () => query,
    fields: () => query,
    boundingClientRect: () => query,
    scrollOffset: () => query,
    exec: (callback?: (result: unknown[]) => void) => {
      callback?.([])
      return query
    },
  }
  return query
}

const uniMock: UnknownRecord = {
  getSystemInfoSync: () => ({
    windowWidth: 375,
    windowHeight: 667,
    pixelRatio: 2,
    platform: 'h5',
    safeArea: { top: 0, bottom: 667, left: 0, right: 375 },
    statusBarHeight: 20,
  }),
  getSystemInfo: (options?: { success?: (info: UnknownRecord) => void }) => {
    const info = uniMock.getSystemInfoSync()
    options?.success?.(info)
    return info
  },
  createSelectorQuery: () => noopQuery(),
  createCanvasContext: () => ({
    draw: vi.fn(),
    setFillStyle: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setStrokeStyle: vi.fn(),
    setLineWidth: vi.fn(),
    fillText: vi.fn(),
    setFontSize: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
  }),
  createVideoContext: () => ({
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    seek: vi.fn(),
    requestFullScreen: vi.fn(),
    exitFullScreen: vi.fn(),
  }),
  showToast: vi.fn(),
  hideToast: vi.fn(),
  showLoading: vi.fn(),
  hideLoading: vi.fn(),
  previewImage: vi.fn(),
  chooseImage: vi.fn(),
  chooseVideo: vi.fn(),
  chooseFile: vi.fn(),
  uploadFile: vi.fn(),
  getImageInfo: vi.fn(),
  saveImageToPhotosAlbum: vi.fn(),
  vibrateShort: vi.fn(),
  setClipboardData: vi.fn(),
  upx2px: (value: number) => value,
}

Object.defineProperty(globalThis, 'uni', {
  value: uniMock,
  writable: true,
  configurable: true,
})

Object.defineProperty(globalThis, 'wx', {
  value: undefined,
  writable: true,
  configurable: true,
})
