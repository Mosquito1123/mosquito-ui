<template>
  <view class="mq-bar-code" :style="rootStyle">
    <canvas
      :id="resolvedCanvasId"
      class="mq-bar-code__canvas"
      :canvas-id="resolvedCanvasId"
      :style="canvasStyle"
    />
    <text v-if="fallback" class="mq-bar-code__fallback">{{ fallbackText }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import { encodeBarCode } from './barcode'
import { drawBarCode, resolveBarCodeLayout } from './barcode-render'
import type { BarCodeCanvasContext, BarCodeRenderOptions } from './barcode-render'
import type { MqBarCodeEmits, MqBarCodeProps } from './types'

defineOptions({
  name: 'mq-bar-code',
})

const props = withDefaults(defineProps<MqBarCodeProps>(), {
  text: '',
  format: 'CODE128',
  width: 0,
  height: 60,
  lineWidth: 2,
  displayValue: true,
  textPosition: 'bottom',
  color: '#000000',
  background: '#ffffff',
  canvasId: '',
})

const emit = defineEmits<MqBarCodeEmits>()
const instance = getCurrentInstance()

const generatedId = `mq-bar-code-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const resolvedCanvasId = computed(() => props.canvasId || generatedId)
const fallback = ref(false)
const fallbackText = computed(() => props.text || '条形码内容为空')

const renderOptions = computed<BarCodeRenderOptions>(() => ({
  width: props.width,
  height: props.height,
  lineWidth: props.lineWidth,
  displayValue: props.displayValue,
  textPosition: props.textPosition,
  fontSize: 12,
  textMargin: 4,
  color: props.color,
  background: props.background,
}))

const rootStyle = computed<Record<string, string>>(() => ({
  width: props.width > 0 ? `${props.width}px` : 'auto',
  height: `${props.height}px`,
}))

const canvasStyle = computed<Record<string, string>>(() => ({
  width: props.width > 0 ? `${props.width}px` : 'auto',
  height: `${props.height}px`,
}))

function h5Canvas(): HTMLCanvasElement | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }
  try {
    return document.getElementById(resolvedCanvasId.value) as HTMLCanvasElement | undefined
  } catch {
    return undefined
  }
}

function context(width: number): BarCodeCanvasContext | undefined {
  const uniApi = getUni()
  if (uniApi?.createCanvasContext) {
    try {
      const ctx = uniApi.createCanvasContext(resolvedCanvasId.value, instance?.proxy)
      if (ctx) {
        // 部分小程序画布还提供文字相关方法，类型声明里未覆盖，这里按可选能力处理。
        const textCtx = ctx as typeof ctx & {
          setFontSize?: (size: number) => void
          setTextAlign?: (align: 'left' | 'center' | 'right') => void
          fillText?: (text: string, x: number, y: number) => void
        }
        return {
          fillRect: (x, y, w, h) => ctx.fillRect(x, y, w, h),
          clearRect: (x, y, w, h) => ctx.clearRect(x, y, w, h),
          setFillStyle: (color) => ctx.setFillStyle(color),
          setFontSize: textCtx.setFontSize ? (size) => textCtx.setFontSize!(size) : undefined,
          setTextAlign: textCtx.setTextAlign ? (align) => textCtx.setTextAlign!(align) : undefined,
          fillText: textCtx.fillText ? (text, x, y) => textCtx.fillText!(text, x, y) : undefined,
          draw: () => ctx.draw(),
        }
      }
    } catch {
      // 平台画布不可用，继续尝试 H5 2d context。
    }
  }

  const element = h5Canvas()
  if (element && typeof element.getContext === 'function') {
    try {
      element.width = width
      element.height = props.height
      const ctx = element.getContext('2d')
      if (ctx) {
        return ctx as unknown as BarCodeCanvasContext
      }
    } catch {
      // jsdom 等环境没有真实 canvas，降级为文字占位。
    }
  }
  return undefined
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function draw() {
  let encoded: ReturnType<typeof encodeBarCode>
  try {
    encoded = encodeBarCode(props.text, props.format)
  } catch (error) {
    fallback.value = true
    emit('valid', false)
    emit('error', toError(error))
    return
  }

  emit('valid', true)
  const layout = resolveBarCodeLayout(encoded.bars, renderOptions.value)
  const ctx = context(layout.width)
  if (!ctx) {
    fallback.value = true
    return
  }

  fallback.value = false
  drawBarCode(ctx, encoded.bars, encoded.text, renderOptions.value)
}

let drawTimer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
  if (drawTimer !== undefined) {
    clearTimeout(drawTimer)
    drawTimer = undefined
  }
}

function scheduleDraw() {
  clearTimer()
  drawTimer = setTimeout(() => {
    drawTimer = undefined
    draw()
  }, 0)
}

watch(
  [
    () => props.text,
    () => props.format,
    () => props.width,
    () => props.height,
    () => props.lineWidth,
    () => props.displayValue,
    () => props.textPosition,
    () => props.color,
    () => props.background,
    resolvedCanvasId,
  ],
  scheduleDraw,
)

onMounted(scheduleDraw)
onBeforeUnmount(clearTimer)

defineExpose({
  draw,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
