<template>
  <view class="mq-upload" :class="{ 'is-disabled': disabled }">
    <view class="mq-upload__list">
      <view
        v-for="(url, index) in modelValue"
        :key="`${url}-${index}`"
        class="mq-upload__item"
        :style="itemStyle"
      >
        <image
          v-if="accept === 'image'"
          class="mq-upload__image"
          :src="url"
          mode="aspectFill"
          @click="onPreview(url)"
        />
        <view v-else class="mq-upload__file" @click="onOpen(url)">
          <text class="mq-upload__file-mark">文件</text>
          <text class="mq-upload__file-name">{{ fileName(url) }}</text>
        </view>
        <text
          v-if="!readonly && !disabled"
          class="mq-upload__remove"
          role="button"
          :aria-label="`删除第 ${index + 1} 个文件`"
          @click.stop="onRemove(index, url)"
        >
          ×
        </text>
      </view>

      <view
        v-for="item in pending"
        :key="item.id"
        class="mq-upload__item is-pending"
        :style="itemStyle"
      >
        <mq-loading :size="18" />
      </view>

      <view
        v-if="showAdd"
        class="mq-upload__add"
        :style="itemStyle"
        role="button"
        tabindex="0"
        @click="onChoose"
        @keydown.enter.prevent="onChoose"
      >
        <text class="mq-upload__plus">+</text>
        <text v-if="maxCount > 0" class="mq-upload__count">{{ total }}/{{ maxCount }}</text>
      </view>
    </view>
    <text v-if="tip" class="mq-upload__tip">{{ tip }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolvePx } from '../../utils/model'
import MqLoading from '../mq-loading/MqLoading.vue'
import type { MqUploadEmits, MqUploadFile, MqUploadProps } from './types'

interface ChooseFileItem {
  path?: string
  name?: string
  size?: number
  type?: string
}

interface ChooseImageResult {
  tempFilePaths?: string[]
  tempFiles?: ChooseFileItem[]
}

interface ChooseVideoResult {
  tempFilePath?: string
  size?: number
  name?: string
}

interface UploadFileResult {
  statusCode?: number
  data?: unknown
}

interface UniUploadApi {
  chooseImage?: (options: {
    count: number
    sizeType?: string[]
    sourceType?: string[]
    success: (result: ChooseImageResult) => void
    fail?: (error: unknown) => void
  }) => void
  chooseVideo?: (options: {
    count?: number
    sourceType?: string[]
    success: (result: ChooseVideoResult) => void
    fail?: (error: unknown) => void
  }) => void
  chooseFile?: (options: {
    count: number
    type?: string
    extension?: string[]
    success: (result: ChooseImageResult) => void
    fail?: (error: unknown) => void
  }) => void
  uploadFile?: (options: {
    url: string
    filePath: string
    name: string
    header?: Record<string, string>
    formData?: Record<string, string>
    success: (result: UploadFileResult) => void
    fail: (error: unknown) => void
  }) => void
  previewImage?: (options: { urls: string[]; current?: string }) => void
  openDocument?: (options: { filePath: string; fail?: (error: unknown) => void }) => void
}

defineOptions({
  name: 'mq-upload',
})

const props = withDefaults(defineProps<MqUploadProps>(), {
  modelValue: () => [],
  maxCount: 9,
  multiple: true,
  accept: 'image',
  disabled: false,
  readonly: false,
  size: 76,
  preview: true,
  action: '',
  name: 'file',
  headers: undefined,
  formData: undefined,
  maxSize: 0,
  beforeUpload: undefined,
  customUpload: undefined,
  tip: '',
})

const emit = defineEmits<MqUploadEmits>()

let serial = 0
const pending = ref<Array<{ id: number; file: MqUploadFile }>>([])

const total = computed(() => props.modelValue.length + pending.value.length)
const showAdd = computed(
  () => !props.disabled && !props.readonly && (props.maxCount <= 0 || total.value < props.maxCount),
)
const itemStyle = computed(() => {
  const size = resolvePx(props.size, 76)
  return {
    width: `${size}px`,
    height: `${size}px`,
  }
})

function getUni(): UniUploadApi | undefined {
  const host = globalThis as typeof globalThis & { uni?: UniUploadApi }
  return host.uni
}

function toFiles(files?: ChooseFileItem[], paths?: string[]): MqUploadFile[] {
  if (files && files.length) {
    return files
      .map((file) => ({
        path: file.path || '',
        name: file.name,
        size: file.size,
        type: file.type,
      }))
      .filter((file) => Boolean(file.path))
  }
  return (paths ?? []).filter(Boolean).map((path) => ({ path }))
}

function onChoose() {
  if (!showAdd.value) {
    return
  }
  const uni = getUni()
  if (!uni) {
    return
  }
  const remaining = props.maxCount > 0 ? Math.max(1, props.maxCount - total.value) : 99
  const count = props.multiple ? remaining : 1

  if (props.accept === 'image') {
    if (!uni.chooseImage) {
      return
    }
    uni.chooseImage({
      count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        void handleFiles(toFiles(result.tempFiles, result.tempFilePaths))
      },
    })
    return
  }

  if (props.accept === 'video') {
    if (!uni.chooseVideo) {
      return
    }
    uni.chooseVideo({
      sourceType: ['album', 'camera'],
      success: (result) => {
        if (!result.tempFilePath) {
          return
        }
        void handleFiles([
          {
            path: result.tempFilePath,
            name: result.name,
            size: result.size,
            type: 'video',
          },
        ])
      },
    })
    return
  }

  if (uni.chooseFile) {
    uni.chooseFile({
      count,
      success: (result) => {
        void handleFiles(toFiles(result.tempFiles, result.tempFilePaths))
      },
    })
    return
  }

  if (uni.chooseImage) {
    uni.chooseImage({
      count,
      success: (result) => {
        void handleFiles(toFiles(result.tempFiles, result.tempFilePaths))
      },
    })
  }
}

async function handleFiles(files: MqUploadFile[]) {
  if (!files.length) {
    return
  }
  const list = [...props.modelValue]

  for (const file of files) {
    if (props.maxCount > 0 && list.length + pending.value.length >= props.maxCount) {
      break
    }
    if (props.maxSize > 0 && typeof file.size === 'number' && file.size > props.maxSize) {
      emit('oversize', { file, maxSize: props.maxSize })
      continue
    }
    if (props.beforeUpload) {
      try {
        const allowed = await props.beforeUpload(file)
        if (allowed === false) {
          continue
        }
      } catch {
        continue
      }
    }

    const id = (serial += 1)
    pending.value = [...pending.value, { id, file }]
    try {
      const url = props.customUpload
        ? await props.customUpload(file)
        : props.action
          ? await uploadToAction(file)
          : file.path
      if (!url) {
        throw new Error('empty upload url')
      }
      list.push(url)
      emit('update:modelValue', [...list])
      emit('change', { fileList: [...list] })
      emit('success', { file, url })
    } catch (error) {
      emit('error', { file, error })
    } finally {
      pending.value = pending.value.filter((item) => item.id !== id)
    }
  }
}

function uploadToAction(file: MqUploadFile): Promise<string> {
  const uni = getUni()
  if (!uni?.uploadFile || !props.action) {
    return Promise.reject(new Error('uploadFile is unavailable'))
  }
  const action = props.action
  return new Promise<string>((resolve, reject) => {
    uni.uploadFile!({
      url: action,
      filePath: file.path,
      name: props.name,
      header: props.headers,
      formData: props.formData,
      success: (result) => {
        const status = result.statusCode ?? 200
        if (status < 200 || status >= 300) {
          reject(new Error(`upload failed: ${status}`))
          return
        }
        resolve(parseUploadUrl(result.data) || file.path)
      },
      fail: reject,
    })
  })
}

function parseUploadUrl(data: unknown): string {
  if (typeof data === 'string') {
    const text = data.trim()
    if (!text) {
      return ''
    }
    try {
      return pickUrl(JSON.parse(text))
    } catch {
      return text
    }
  }
  return pickUrl(data)
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

function onRemove(index: number, url: string) {
  if (props.disabled || props.readonly) {
    return
  }
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
  emit('change', { fileList: list })
  emit('remove', { index, url })
}

function onPreview(url: string) {
  if (props.accept !== 'image' || !props.preview) {
    return
  }
  getUni()?.previewImage?.({ urls: [...props.modelValue], current: url })
}

function onOpen(url: string) {
  if (props.accept === 'image') {
    onPreview(url)
    return
  }
  getUni()?.openDocument?.({ filePath: url })
}

function fileName(url: string): string {
  const clean = url.split('?')[0].split('#')[0]
  const name = clean.split('/').pop() || url
  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}

defineExpose({
  choose: onChoose,
  preview: onPreview,
  clear() {
    emit('update:modelValue', [])
    emit('change', { fileList: [] })
  },
})
</script>

<style lang="scss">
@import './index.scss';
</style>
