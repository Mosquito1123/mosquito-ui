<template>
  <view class="mq-img-cropper" :class="{ 'is-disabled': disabled }">
    <view class="mq-img-cropper__stage" :style="boxStyle">
      <view class="mq-img-cropper__frame">
        <view v-if="showGrid" class="mq-img-cropper__grid" />
      </view>
      <image
        v-if="imageSrc"
        class="mq-img-cropper__image"
        :src="imageSrc"
        mode="aspectFit"
        :style="imageStyle"
        @click="onImageTap"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      />
    </view>

    <canvas :id="canvasId" :canvas-id="canvasId" class="mq-img-cropper__canvas" :disable-scroll="true" />

    <view class="mq-img-cropper__footer">
      <text class="mq-img-cropper__action" role="button" tabindex="0" @click="onChoose">{{
        t('common.chooseImage')
      }}</text>
      <text class="mq-img-cropper__action" role="button" tabindex="0" @click="rotate">{{
        t('common.rotate')
      }}</text>
      <text class="mq-img-cropper__action" role="button" tabindex="0" @click="reset">{{
        t('common.reset')
      }}</text>
      <text class="mq-img-cropper__action" role="button" tabindex="0" @click="onCancel">{{
        t('common.cancel')
      }}</text>
      <text class="mq-img-cropper__action is-confirm" role="button" tabindex="0" @click="crop">{{
        t('common.confirmOk')
      }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { t } from '../../locale'
import { getUni } from '../../utils/platform'
import type { UniPlatformApi } from '../../utils/platform'
import type { MqImgCropperEmits, MqImgCropperProps, MqImgCropperReady, MqImgCropperResult } from './types'

defineOptions({
  name: 'mq-img-cropper',
})

const props = withDefaults(defineProps<MqImgCropperProps>(), {
  src: '',
  quality: 1,
  disabled: false,
  showGrid: false,
})

const emit = defineEmits<MqImgCropperEmits>()

interface ImageInfoResult {
  width?: number
  height?: number
  path?: string
}

interface ChooseImageResult {
  tempFilePaths?: string[]
  tempFiles?: Array<{ path?: string }>
}

type CropperUniApi = UniPlatformApi & {
  getImageInfo?: (options: {
    src: string
    success?: (result: ImageInfoResult) => void
    fail?: (error: unknown) => void
  }) => void
  chooseImage?: (options: {
    count?: number
    success?: (result: ChooseImageResult) => void
    fail?: (error: unknown) => void
  }) => void
}

interface CropperCanvasContext {
  clearRect?: (x: number, y: number, width: number, height: number) => void
  save?: () => void
  restore?: () => void
  translate?: (x: number, y: number) => void
  rotate?: (angle: number) => void
  scale?: (x: number, y: number) => void
  drawImage?: (src: string, x: number, y: number, width: number, height: number) => void
  draw?: (reserve?: boolean, callback?: () => void) => void
}

interface DragStart {
  x: number
  y: number
  offsetX: number
  offsetY: number
}

const instance = getCurrentInstance()
const canvasId = `mq-img-cropper-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const imageSrc = ref(props.src)
const angle = ref(0)
const zoom = ref(1)
const offset = ref({ x: 0, y: 0 })
const imageSize = ref({ width: 0, height: 0 })
let context: CropperCanvasContext | undefined
let dragStart: DragStart | undefined
let lastTap = 0

function uniApi(): CropperUniApi | undefined {
  return getUni() as CropperUniApi | undefined
}

function toNumber(value: number | string | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : undefined
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }
  return undefined
}

function parseAspect(value: number | string | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : undefined
  }
  if (typeof value === 'string') {
    const parts = value.split(':')
    if (parts.length === 2) {
      const width = Number(parts[0])
      const height = Number(parts[1])
      if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
        return width / height
      }
    }
    const numeric = Number(value)
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric
    }
  }
  return undefined
}

/** 导出尺寸：宽高比优先推算缺省的一边，两边都给出时尊重显式值。 */
function outputSize(): { width: number; height: number } {
  const ratio = parseAspect(props.aspectRatio)
  const givenWidth = toNumber(props.width)
  const givenHeight = toNumber(props.height)
  let width = givenWidth ?? 200
  let height = givenHeight ?? 200
  if (ratio !== undefined) {
    if (givenWidth === undefined && givenHeight === undefined) {
      height = Math.round(width / ratio)
    } else if (givenWidth !== undefined && givenHeight === undefined) {
      height = Math.round(width / ratio)
    } else if (givenWidth === undefined && givenHeight !== undefined) {
      width = Math.round(height * ratio)
    }
  }
  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  }
}

function normalizedQuality(): number {
  const value = Number(props.quality)
  if (!Number.isFinite(value)) {
    return 1
  }
  return Math.min(1, Math.max(0, value))
}

const boxStyle = computed(() => {
  const style: Record<string, string> = {}
  const width = toNumber(props.width)
  const height = toNumber(props.height)
  if (width !== undefined) {
    style.width = `${width}px`
  }
  if (height !== undefined) {
    style.height = `${height}px`
  }
  return style
})

const imageStyle = computed(() => ({
  transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${zoom.value}) rotate(${angle.value}deg)`,
}))

function canvasContext(): CropperCanvasContext | undefined {
  if (!context) {
    try {
      context = getUni()?.createCanvasContext?.(canvasId, instance?.proxy) as unknown as
        CropperCanvasContext | undefined
    } catch {
      context = undefined
    }
  }
  return context
}

function loadImage() {
  const src = imageSrc.value
  if (!src) {
    return
  }
  const api = uniApi()
  if (typeof api?.getImageInfo !== 'function') {
    return
  }
  try {
    api.getImageInfo({
      src,
      success: (result) => {
        const width = Number(result?.width)
        const height = Number(result?.height)
        imageSize.value = {
          width: Number.isFinite(width) && width > 0 ? width : 0,
          height: Number.isFinite(height) && height > 0 ? height : 0,
        }
        if (imageSize.value.width > 0 && imageSize.value.height > 0) {
          emit('ready', { ...imageSize.value } as MqImgCropperReady)
        }
      },
      fail: () => {},
    })
  } catch {
    // jsdom 或部分端没有 getImageInfo 时安全降级。
  }
}

function resetState() {
  angle.value = 0
  zoom.value = 1
  offset.value = { x: 0, y: 0 }
  dragStart = undefined
  lastTap = 0
}

watch(
  () => props.src,
  (src) => {
    imageSrc.value = src
    resetState()
    loadImage()
  },
  { immediate: true },
)

function chooseImage() {
  if (props.disabled) {
    return
  }
  const api = uniApi()
  if (typeof api?.chooseImage !== 'function') {
    return
  }
  try {
    api.chooseImage({
      count: 1,
      success: (result) => {
        const path = result?.tempFilePaths?.[0] ?? result?.tempFiles?.[0]?.path
        if (!path) {
          return
        }
        imageSrc.value = path
        resetState()
        loadImage()
      },
      fail: () => {},
    })
  } catch {
    // 选图能力不可用时保持原图。
  }
}

function rotate() {
  if (props.disabled) {
    return
  }
  angle.value = (angle.value + 90) % 360
}

function reset() {
  resetState()
}

function crop() {
  if (props.disabled || !imageSrc.value) {
    return
  }
  const api = uniApi()
  if (typeof api?.canvasToTempFilePath !== 'function') {
    return
  }
  const size = outputSize()
  const context = canvasContext()
  if (context) {
    try {
      context.clearRect?.(0, 0, size.width, size.height)
      context.save?.()
      context.translate?.(size.width / 2, size.height / 2)
      context.rotate?.((angle.value * Math.PI) / 180)
      context.scale?.(zoom.value, zoom.value)
      const natural = imageSize.value
      let drawWidth = size.width
      let drawHeight = size.height
      if (natural.width > 0 && natural.height > 0) {
        const ratio = natural.width / natural.height
        if (ratio > 1) {
          drawHeight = size.height
          drawWidth = drawHeight * ratio
        } else {
          drawWidth = size.width
          drawHeight = drawWidth / ratio
        }
      }
      context.drawImage?.(
        imageSrc.value,
        -drawWidth / 2 + offset.value.x,
        -drawHeight / 2 + offset.value.y,
        drawWidth,
        drawHeight,
      )
      context.restore?.()
      context.draw?.(false)
    } catch {
      // 画布不可用时仍然尝试导出，失败由下方 fail 兜底。
    }
  }
  try {
    api.canvasToTempFilePath(
      {
        canvasId,
        quality: normalizedQuality(),
        destWidth: size.width,
        destHeight: size.height,
        success: (result) => {
          const path = result?.tempFilePath
          if (!path) {
            return
          }
          const payload: MqImgCropperResult = { path, width: size.width, height: size.height }
          emit('confirm', payload)
        },
        fail: () => {},
      },
      instance?.proxy,
    )
  } catch {
    // 导出能力不可用时静默降级，避免打断宿主页面。
  }
}

function onChoose() {
  chooseImage()
}

function onCancel() {
  if (props.disabled) {
    return
  }
  emit('cancel')
}

function touchPoint(event: Event): { x: number; y: number } | undefined {
  const detail = event as Event & {
    touches?: Array<{ x?: number; y?: number; clientX?: number; clientY?: number }>
    changedTouches?: Array<{ x?: number; y?: number; clientX?: number; clientY?: number }>
  }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  if (!touch) {
    return undefined
  }
  const x = Number(touch.x ?? touch.clientX)
  const y = Number(touch.y ?? touch.clientY)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return undefined
  }
  return { x, y }
}

function onTouchStart(event: Event) {
  if (props.disabled) {
    return
  }
  const point = touchPoint(event)
  if (!point) {
    return
  }
  dragStart = { x: point.x, y: point.y, offsetX: offset.value.x, offsetY: offset.value.y }
}

function onTouchMove(event: Event) {
  if (props.disabled || !dragStart) {
    return
  }
  const point = touchPoint(event)
  if (!point) {
    return
  }
  offset.value = {
    x: dragStart.offsetX + point.x - dragStart.x,
    y: dragStart.offsetY + point.y - dragStart.y,
  }
}

function onTouchEnd() {
  dragStart = undefined
}

function onImageTap() {
  if (props.disabled) {
    return
  }
  const now = Date.now()
  if (now - lastTap <= 300) {
    zoom.value = zoom.value === 1 ? 2 : 1
    lastTap = 0
    return
  }
  lastTap = now
}

defineExpose({
  chooseImage,
  crop,
  rotate,
  reset,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
