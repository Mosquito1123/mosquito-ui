import { afterEach, describe, expect, it } from 'vitest'
import { useImagePreview } from '@/composables/use-image-preview'
import { imagePreviewState } from '@/utils/image-preview'

afterEach(() => {
  useImagePreview().hide()
})

describe('useImagePreview', () => {
  it('show 更新共享状态，hide 关闭', () => {
    const { state, show, hide } = useImagePreview()
    expect(state).toBe(imagePreviewState)
    show(['a.png', 'b.png'])
    expect(state.visible).toBe(true)
    expect(state.urls).toEqual(['a.png', 'b.png'])
    expect(state.index).toBe(0)
    hide()
    expect(state.visible).toBe(false)
  })

  it('支持对象入参并收敛索引边界', () => {
    const { state, show } = useImagePreview()
    show({ urls: ['a.png', 'b.png'], current: 99 })
    expect(state.current).toBe(1)
    expect(state.index).toBe(1)
    show({ urls: ['a.png'], index: -3 })
    expect(state.index).toBe(0)
  })

  it('空白输入被忽略且不改变当前预览', () => {
    const { state, show } = useImagePreview()
    show(['a.png'])
    const close = show([])
    close()
    expect(state.visible).toBe(true)
    expect(state.urls).toEqual(['a.png'])
  })

  it('closer 只关闭自己那一次', () => {
    const { state, show } = useImagePreview()
    const first = show(['a.png'])
    show(['b.png'])
    first()
    expect(state.visible).toBe(true)
    expect(state.urls).toEqual(['b.png'])
  })
})
