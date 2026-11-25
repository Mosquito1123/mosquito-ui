import { afterEach, describe, expect, test, vi } from 'vitest'
import { useUpload } from '@/composables/use-upload'

const g = globalThis as any
const uni = g.uni

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useUpload', () => {
  test('choose 调用 uni.chooseImage 并把结果追加为 ready 文件', async () => {
    const chooseImage = vi.spyOn(uni, 'chooseImage').mockImplementation((options: any) => {
      options.success({ tempFilePaths: ['/a.png', '/b.png'] })
    })
    const api = useUpload()
    const added = await api.choose()
    expect(chooseImage).toHaveBeenCalledTimes(1)
    expect(chooseImage.mock.calls[0][0].count).toBe(99)
    expect(added).toHaveLength(2)
    expect(api.files.value.map((file) => file.path)).toEqual(['/a.png', '/b.png'])
    expect(api.files.value[0].status).toBe('ready')
    expect(api.files.value[0].id).toBeTruthy()
  })

  test('choose 支持 video 与 file，并受 maxCount/multiple 约束', async () => {
    const chooseVideo = vi.spyOn(uni, 'chooseVideo').mockImplementation((options: any) => {
      options.success({ tempFilePath: '/v.mp4', size: 12 })
    })
    const video = useUpload({ accept: 'video', maxCount: 2 })
    const added = await video.choose()
    expect(chooseVideo).toHaveBeenCalledTimes(1)
    expect(added[0].type).toBe('video')

    const chooseFile = vi.spyOn(uni, 'chooseFile').mockImplementation((options: any) => {
      options.success({ tempFiles: [{ path: '/f.pdf', name: 'f.pdf' }] })
    })
    const single = useUpload({ accept: 'file', multiple: false, maxCount: 3 })
    await single.choose()
    expect(chooseFile.mock.calls[0][0].count).toBe(1)
    expect(single.files.value[0].name).toBe('f.pdf')
  })

  test('validate 校验路径、大小、数量与 beforeUpload', async () => {
    const beforeUpload = vi.fn(() => false)
    const api = useUpload({ maxSize: 10, maxCount: 1, beforeUpload })
    expect(await api.validate({ path: '' })).toBe(false)
    expect(api.error.value).toBeInstanceOf(Error)
    expect(await api.validate({ path: '/big.png', size: 11 })).toBe(false)
    expect(await api.validate({ path: '/ok.png' })).toBe(false)
    expect(beforeUpload).toHaveBeenCalledTimes(1)

    beforeUpload.mockReturnValue(true)
    expect(await api.validate({ path: '/ok.png' })).toBe(true)
  })

  test('无 action/customUpload 时直接用临时路径作为结果', async () => {
    vi.spyOn(uni, 'chooseImage').mockImplementation((options: any) => {
      options.success({ tempFilePaths: ['/local.png'] })
    })
    const api = useUpload()
    await api.choose()
    const urls = await api.upload()
    expect(urls).toEqual(['/local.png'])
    expect(api.files.value[0].status).toBe('success')
    expect(api.files.value[0].url).toBe('/local.png')
    expect(api.uploading.value).toBe(false)
    expect(api.progress.value).toBe(100)
    expect(api.error.value).toBeNull()
  })

  test('customUpload 可异步返回地址，upload 可指定单个文件', async () => {
    vi.spyOn(uni, 'chooseImage').mockImplementation((options: any) => {
      options.success({ tempFilePaths: ['/one.png', '/two.png'] })
    })
    const customUpload = vi.fn(async (file: { path: string }) => `https://cdn/${file.path}`)
    const api = useUpload({ customUpload })
    await api.choose()
    const urls = await api.upload(1)
    expect(customUpload).toHaveBeenCalledTimes(1)
    expect(urls).toEqual(['https://cdn//two.png'])
    expect(api.files.value[1].status).toBe('success')
    expect(api.files.value[0].status).toBe('ready')
  })

  test('action 走 uni.uploadFile 并解析返回的地址；失败写入 error', async () => {
    const uploadFile = vi.spyOn(uni, 'uploadFile').mockImplementation((options: any) => {
      options.success({ statusCode: 200, data: JSON.stringify({ url: 'https://cdn/ok.png' }) })
    })
    const api = useUpload({ action: 'https://api/upload', name: 'avatar' })
    const chosen = [{ path: '/ok.png' }]
    api.files.value = chosen.map((file) => ({ ...file, id: 'u1', status: 'ready' }) as any)
    expect(await api.upload()).toEqual(['https://cdn/ok.png'])
    expect(uploadFile.mock.calls[0][0]).toMatchObject({ url: 'https://api/upload', name: 'avatar' })

    uploadFile.mockImplementation((options: any) => {
      options.success({ statusCode: 500, data: 'oops' })
    })
    expect(await api.upload({ path: '/ok.png' })).toEqual([])
    expect(api.error.value).toBeInstanceOf(Error)
    expect(api.files.value[0].status).toBe('error')
  })

  test('remove/clear 与无 uni 时的安全降级', async () => {
    vi.spyOn(uni, 'chooseImage').mockImplementation((options: any) => {
      options.success({ tempFilePaths: ['/a.png', '/b.png'] })
    })
    const api = useUpload()
    await api.choose()
    api.remove(0)
    expect(api.files.value.map((file) => file.path)).toEqual(['/b.png'])
    api.clear()
    expect(api.files.value).toEqual([])
    expect(api.progress.value).toBe(0)

    const savedUni = g.uni
    delete g.uni
    try {
      expect(await api.choose()).toEqual([])
      expect(await api.upload({ path: '/offline.png' })).toEqual(['/offline.png'])
    } finally {
      g.uni = savedUni
    }
  })
})
