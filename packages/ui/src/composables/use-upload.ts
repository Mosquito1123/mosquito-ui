import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { MqUploadFile, MqUploadProps } from '../components/mq-upload/types'

export type UseUploadFileStatus = 'ready' | 'pending' | 'success' | 'error'

/** 文件条目。`id` 用于稳定地定位数组中的项，`url` 在上传成功后写入。 */
export interface UseUploadFile extends MqUploadFile {
  id?: string
  url?: string
  status?: UseUploadFileStatus
  progress?: number
}

export type UseUploadOptions = Pick<
  MqUploadProps,
  | 'action'
  | 'maxCount'
  | 'maxSize'
  | 'accept'
  | 'beforeUpload'
  | 'customUpload'
  | 'name'
  | 'headers'
  | 'formData'
  | 'multiple'
>

export interface UseUploadReturn {
  files: Ref<UseUploadFile[]>
  uploading: ComputedRef<boolean>
  /** 本轮上传的粗略进度（0-100）：`uni.uploadFile` 没有进度回调，单文件上传时只有 0 与 100。 */
  progress: Ref<number>
  error: Ref<unknown>
  /** 调起选择并追加文件，返回本次实际追加的条目。 */
  choose: () => Promise<UseUploadFile[]>
  /** 上传指定文件（对象或下标），默认上传所有未成功的文件，返回成功得到的地址。 */
  upload: (file?: UseUploadFile | number) => Promise<string[]>
  remove: (file: UseUploadFile | number) => void
  clear: () => void
  /** 校验单个文件：路径、数量、大小与 `beforeUpload`。 */
  validate: (file: MqUploadFile) => Promise<boolean>
}

interface ChooseItem {
  path?: string
  name?: string
  size?: number
  type?: string
}

interface ChooseResult {
  tempFilePaths?: string[]
  tempFiles?: ChooseItem[]
  tempFilePath?: string
  size?: number
  name?: string
}

interface UploadResult {
  statusCode?: number
  data?: unknown
}

interface UniUploadApi {
  chooseImage?: (api: {
    count: number
    sizeType?: string[]
    sourceType?: string[]
    success: (result: ChooseResult) => void
    fail?: (error: unknown) => void
  }) => void
  chooseVideo?: (api: {
    sourceType?: string[]
    success: (result: ChooseResult) => void
    fail?: (error: unknown) => void
  }) => void
  chooseFile?: (api: {
    count: number
    success: (result: ChooseResult) => void
    fail?: (error: unknown) => void
  }) => void
  uploadFile?: (api: {
    url: string
    filePath: string
    name: string
    header?: Record<string, string>
    formData?: Record<string, string>
    success: (result: UploadResult) => void
    fail: (error: unknown) => void
  }) => void
}

function getUni(): UniUploadApi | undefined {
  return (globalThis as typeof globalThis & { uni?: UniUploadApi }).uni
}

function nonNegative(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0
}

function toFiles(result: ChooseResult): MqUploadFile[] {
  let list: ChooseItem[] = result.tempFiles?.length
    ? [...result.tempFiles]
    : (result.tempFilePaths ?? []).map((path) => ({ path }))
  if (result.tempFilePath && !list.length) {
    list = [...list, { path: result.tempFilePath, name: result.name, size: result.size, type: 'video' }]
  }
  return list
    .map((file) => ({
      path: typeof file.path === 'string' ? file.path : '',
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    .filter((file) => Boolean(file.path))
}

function pickUrl(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return ''
  }
  const record = value as Record<string, unknown>
  for (const key of ['url', 'path', 'fileUrl', 'data']) {
    const item = record[key]
    if (typeof item === 'string' && item) {
      return item
    }
    if (item && typeof item === 'object') {
      const nested = pickUrl(item)
      if (nested) {
        return nested
      }
    }
  }
  return ''
}

function resolveUploadUrl(data: unknown): string {
  if (typeof data !== 'string') {
    return pickUrl(data)
  }
  const text = data.trim()
  if (!text) {
    return ''
  }
  try {
    return pickUrl(JSON.parse(text)) || text
  } catch {
    return text
  }
}

/**
 * 文件选择与上传的状态容器。不依赖 `MqUpload` 组件，所有 uni API 都从全局读取，便于 mock。
 */
export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const action = options.action ?? ''
  const maxCount = nonNegative(options.maxCount)
  const maxSize = nonNegative(options.maxSize)
  const accept = options.accept ?? 'image'
  const multiple = options.multiple !== false
  const name = options.name ?? 'file'
  const headers = options.headers
  const formData = options.formData
  const beforeUpload = options.beforeUpload
  const customUpload = options.customUpload

  const files = ref<UseUploadFile[]>([])
  const progress = ref(0)
  const error = ref<unknown>(null)
  const uploading = computed(() => files.value.some((file) => file.status === 'pending'))
  let serial = 0

  function fail(reason: unknown) {
    error.value = reason
  }

  async function check(file: MqUploadFile, count: number, all: readonly UseUploadFile[]): Promise<boolean> {
    if (!file || typeof file.path !== 'string' || !file.path.trim()) {
      fail(new Error('empty file path'))
      return false
    }
    if (maxSize > 0 && typeof file.size === 'number' && file.size > maxSize) {
      fail(new Error(`file exceeds ${maxSize} bytes`))
      return false
    }
    const source = file as UseUploadFile
    const exists = all.some(
      (item) => (source.id !== undefined && item.id === source.id) || item.path === file.path,
    )
    if (maxCount > 0 && !exists && count >= maxCount) {
      fail(new Error(`file count exceeds ${maxCount}`))
      return false
    }
    if (beforeUpload) {
      try {
        if ((await beforeUpload(file)) === false) {
          return false
        }
      } catch (reason) {
        fail(reason)
        return false
      }
    }
    return true
  }

  function validate(file: MqUploadFile): Promise<boolean> {
    return check(file, files.value.length, files.value)
  }

  function patch(file: UseUploadFile, changes: Partial<UseUploadFile>) {
    const index = files.value.findIndex((item) =>
      file.id !== undefined ? item.id === file.id : item.path === file.path,
    )
    if (index < 0) {
      return
    }
    files.value = files.value.map((item, i) => (i === index ? { ...item, ...changes } : item))
  }

  async function appendFiles(list: MqUploadFile[]): Promise<UseUploadFile[]> {
    const next = [...files.value]
    const added: UseUploadFile[] = []
    for (const file of list) {
      if (!(await check(file, next.length, next))) {
        continue
      }
      const item: UseUploadFile = { ...file, id: `u${(serial += 1)}`, status: 'ready', progress: 0 }
      next.push(item)
      added.push(item)
    }
    if (added.length) {
      files.value = next
    }
    return added
  }

  function choose(): Promise<UseUploadFile[]> {
    const uni = getUni()
    if (!uni) {
      return Promise.resolve([])
    }
    return new Promise<UseUploadFile[]>((resolve) => {
      const remaining = maxCount > 0 ? Math.max(1, maxCount - files.value.length) : 99
      const count = multiple ? remaining : 1
      const done = (result: ChooseResult) => {
        void appendFiles(toFiles(result)).then(resolve)
      }
      const failed = (reason: unknown) => {
        fail(reason)
        resolve([])
      }

      if (accept === 'image') {
        if (!uni.chooseImage) {
          resolve([])
          return
        }
        uni.chooseImage({
          count,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: done,
          fail: failed,
        })
        return
      }
      if (accept === 'video') {
        if (!uni.chooseVideo) {
          resolve([])
          return
        }
        uni.chooseVideo({ sourceType: ['album', 'camera'], success: done, fail: failed })
        return
      }
      if (uni.chooseFile) {
        uni.chooseFile({ count, success: done, fail: failed })
      } else if (uni.chooseImage) {
        uni.chooseImage({ count, success: done, fail: failed })
      } else {
        resolve([])
      }
    })
  }

  function uploadToAction(file: MqUploadFile): Promise<string> {
    const uni = getUni()
    if (!uni?.uploadFile || !action) {
      return Promise.reject(new Error('uploadFile is unavailable'))
    }
    const url = action
    return new Promise<string>((resolve, reject) => {
      uni.uploadFile!({
        url,
        filePath: file.path,
        name,
        header: headers,
        formData,
        success: (result) => {
          const status = result.statusCode ?? 200
          if (status < 200 || status >= 300) {
            reject(new Error(`upload failed: ${status}`))
            return
          }
          resolve(resolveUploadUrl(result.data) || file.path)
        },
        fail: reject,
      })
    })
  }

  async function send(file: MqUploadFile): Promise<string> {
    if (customUpload) {
      return await customUpload(file)
    }
    if (action) {
      return await uploadToAction(file)
    }
    return file.path
  }

  function targetsOf(target?: UseUploadFile | number): UseUploadFile[] {
    if (target === undefined) {
      return files.value.filter((file) => file.status !== 'success')
    }
    if (typeof target === 'number') {
      return files.value[target] ? [files.value[target]] : []
    }
    const found = files.value.find((item) => item.id === target.id || item.path === target.path)
    return found ? [found] : [{ ...target }]
  }

  async function upload(target?: UseUploadFile | number): Promise<string[]> {
    error.value = null
    const targets = targetsOf(target)
    const urls: string[] = []
    for (const file of targets) {
      if (!(await validate(file))) {
        continue
      }
      patch(file, { status: 'pending', progress: 0 })
      try {
        const url = await send(file)
        if (!url || typeof url !== 'string') {
          throw new Error('empty upload url')
        }
        patch(file, { status: 'success', url, progress: 100 })
        urls.push(url)
      } catch (reason) {
        fail(reason)
        patch(file, { status: 'error' })
      }
    }
    progress.value = targets.length ? Math.round((urls.length / targets.length) * 100) : 0
    return urls
  }

  function remove(target: UseUploadFile | number) {
    const index =
      typeof target === 'number'
        ? target
        : files.value.findIndex((item) => item.id === target.id || item.path === target.path)
    if (index < 0 || index >= files.value.length) {
      return
    }
    files.value = files.value.filter((_, i) => i !== index)
    progress.value = 0
  }

  function clear() {
    files.value = []
    progress.value = 0
    error.value = null
  }

  return {
    files,
    uploading,
    progress,
    error,
    choose,
    upload,
    remove,
    clear,
    validate,
  }
}
