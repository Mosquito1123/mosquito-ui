import { afterEach, describe, expect, it } from 'vitest'
import { useVideoPreview } from '@/composables/use-video-preview'
import { videoPreviewState } from '@/utils/video-preview'

afterEach(() => {
  useVideoPreview().hide()
})

describe('useVideoPreview', () => {
  it('show 更新共享状态，hide 关闭', () => {
    const { state, show, hide } = useVideoPreview()
    expect(state).toBe(videoPreviewState)
    show('a.mp4')
    expect(state.visible).toBe(true)
    expect(state.src).toBe('a.mp4')
    hide()
    expect(state.visible).toBe(false)
  })

  it('支持对象入参并保存标题与封面', () => {
    const { state, show } = useVideoPreview()
    show({ src: 'b.mp4', title: '标题', poster: 'p.png' })
    expect(state.src).toBe('b.mp4')
    expect(state.title).toBe('标题')
    expect(state.poster).toBe('p.png')
  })

  it('空白输入被忽略且不改变当前预览', () => {
    const { state, show } = useVideoPreview()
    show('a.mp4')
    const close = show('   ')
    close()
    expect(state.visible).toBe(true)
    expect(state.src).toBe('a.mp4')
  })

  it('closer 只关闭自己那一次', () => {
    const { state, show } = useVideoPreview()
    const first = show('a.mp4')
    show('b.mp4')
    first()
    expect(state.visible).toBe(true)
    expect(state.src).toBe('b.mp4')
  })
})
