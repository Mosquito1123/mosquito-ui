import { afterEach, describe, expect, test, vi } from 'vitest'
import { useDialog } from '@/composables/use-dialog'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useDialog', () => {
  test('默认值与 show 覆盖', () => {
    const dialog = useDialog({ title: '默认标题', message: '默认内容', confirmText: '知道了' })
    expect(dialog.visible.value).toBe(false)
    expect(dialog.title.value).toBe('默认标题')
    expect(dialog.options.value.confirmText).toBe('知道了')

    dialog.show({ title: '新标题' })
    expect(dialog.visible.value).toBe(true)
    expect(dialog.title.value).toBe('新标题')
    expect(dialog.message.value).toBe('默认内容')
    expect(dialog.options.value.confirmText).toBe('知道了')

    dialog.show()
    expect(dialog.title.value).toBe('默认标题')
  })

  test('confirm 等待异步 beforeConfirm，通过后才关闭', async () => {
    let release: (ok: boolean) => void = () => {}
    const beforeConfirm = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          release = (ok) => resolve(ok)
        }),
    )
    const dialog = useDialog({ beforeConfirm })
    dialog.show()
    const pending = dialog.confirm()
    expect(beforeConfirm).toHaveBeenCalledTimes(1)
    expect(dialog.visible.value).toBe(true)
    release(true)
    await expect(pending).resolves.toBe(true)
    expect(dialog.visible.value).toBe(false)
  })

  test('beforeConfirm 返回 false 或抛错时不关闭', async () => {
    const rejectDialog = useDialog({ beforeConfirm: () => false })
    rejectDialog.show()
    await expect(rejectDialog.confirm()).resolves.toBe(false)
    expect(rejectDialog.visible.value).toBe(true)

    const throwDialog = useDialog({
      beforeConfirm: () => {
        throw new Error('不允许')
      },
    })
    throwDialog.show()
    await expect(throwDialog.confirm()).resolves.toBe(false)
    expect(throwDialog.visible.value).toBe(true)
  })

  test('可在运行时替换 beforeConfirm', async () => {
    const dialog = useDialog()
    dialog.show()
    dialog.beforeConfirm.value = vi.fn(() => false)
    await expect(dialog.confirm()).resolves.toBe(false)
    expect(dialog.visible.value).toBe(true)

    dialog.beforeConfirm.value = undefined
    await expect(dialog.confirm()).resolves.toBe(true)
    expect(dialog.visible.value).toBe(false)
  })

  test('cancel/close 不触发 beforeConfirm；隐藏时 confirm 直接返回 false', async () => {
    const beforeConfirm = vi.fn(() => true)
    const dialog = useDialog({ beforeConfirm })
    dialog.show()
    dialog.cancel()
    expect(dialog.visible.value).toBe(false)
    expect(beforeConfirm).not.toHaveBeenCalled()

    dialog.show()
    dialog.close()
    expect(beforeConfirm).not.toHaveBeenCalled()
    await expect(dialog.confirm()).resolves.toBe(false)
  })

  test('confirm 等待期间被 close 后不再关闭（不会重复触发副作用）', async () => {
    let release: () => void = () => {}
    const dialog = useDialog({
      beforeConfirm: () =>
        new Promise<void>((resolve) => {
          release = () => resolve()
        }),
    })
    dialog.show()
    const pending = dialog.confirm()
    dialog.close()
    release()
    await expect(pending).resolves.toBe(false)
    expect(dialog.visible.value).toBe(false)
  })
})
