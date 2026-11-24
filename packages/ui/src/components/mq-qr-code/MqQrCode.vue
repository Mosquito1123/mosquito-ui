<template>
  <view class="mq-qr-code" :style="rootStyle" @click="onClick">
    <canvas
      :id="resolvedCanvasId"
      class="mq-qr-code__canvas"
      :canvas-id="resolvedCanvasId"
      :style="canvasStyle"
    />
    <text v-if="fallback" class="mq-qr-code__fallback">{{ fallbackText }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getUni } from '../../utils/platform'
import { generateQRCode } from './qrcode'
import type { MqQrCodeEmits, MqQrCodeProps } from './types'

defineOptions({
  name: 'mq-qr-code',
})

const props = withDefaults(defineProps<MqQrCodeProps>(), {
  text: '',
  colorDark: '#000000',
  colorLight: '#ffffff',
  margin: 0,
  canvasId: '',
})

const emit = defineEmits<MqQrCodeEmits>()
const instance = getCurrentInstance()

const generatedId = `mq-qr-code-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const resolvedCanvasId = computed(() => props.canvasId || generatedId)
const effectiveLevel = computed(() => props.level || props.correctLevel || 'H')
const fallback = ref(false)
const fallbackText = computed(() => props.text || '二维码内容为空')

function px(value: number | string | undefined, fallbackValue: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallbackValue
}

const rootStyle = computed<Record<string, string>>(() => {
  const size = px(props.size, 200)
  return { width: `${size}px`, height: `${size}px` }
})

const canvasStyle = computed<Record<string, string>>(() => ({
  width: '100%',
  height: '100%',
}))

/** 抹平 uni 画布与 H5 2d context 的差异，只暴露填充所需的三个动作。 */
interface CanvasAdapter {
  fill: (color: string) => void
  rect: (x: number, y: number, width: number, height: number) => void
  commit: () => void
}

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

function context(size: number): CanvasAdapter | undefined {
  const uniApi = getUni()
  if (uniApi?.createCanvasContext) {
    try {
      const ctx = uniApi.createCanvasContext(resolvedCanvasId.value, instance?.proxy)
      if (ctx) {
        return {
          fill: (color) => ctx.setFillStyle(color),
          rect: (x, y, width, height) => ctx.fillRect(x, y, width, height),
          commit: () => ctx.draw(),
        }
      }
    } catch {
      // 平台画布不可用，继续尝试 H5 2d context。
    }
  }

  const element = h5Canvas()
  if (element && typeof element.getContext === 'function') {
    try {
      element.width = size
      element.height = size
      const ctx = element.getContext('2d')
      if (ctx) {
        return {
          fill: (color) => {
            ctx.fillStyle = color
          },
          rect: (x, y, width, height) => ctx.fillRect(x, y, width, height),
          commit: () => undefined,
        }
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
  if (!props.text) {
    fallback.value = true
    emit('error', new Error('二维码内容不能为空'))
    return
  }

  let matrix: ReturnType<typeof generateQRCode>
  try {
    matrix = generateQRCode(props.text, effectiveLevel.value)
  } catch (error) {
    fallback.value = true
    emit('error', toError(error))
    return
  }

  const size = px(props.size, 200)
  const ctx = context(size)
  if (!ctx) {
    fallback.value = true
    return
  }

  fallback.value = false
  const { modules, size: count } = matrix
  const margin = Math.max(0, Math.floor(props.margin || 0))
  const inner = Math.max(count, size - margin * 2)
  const cell = Math.max(1, Math.floor(inner / count))
  const drawn = cell * count
  const offset = Math.max(margin, Math.floor((size - drawn) / 2))

  ctx.fill(props.colorLight)
  ctx.rect(0, 0, size, size)
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (modules[row][col]) {
        ctx.rect(offset + col * cell, offset + row * cell, cell, cell)
      }
    }
  }
  ctx.commit()
}

function toDataURL(): string | undefined {
  const element = h5Canvas()
  if (!element || typeof element.toDataURL !== 'function') {
    return undefined
  }
  try {
    const url = element.toDataURL('image/png')
    return typeof url === 'string' && url ? url : undefined
  } catch {
    return undefined
  }
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
  // 小程序端 canvas 需在下一轮才可用，这里用宏任务错开初始化时机。
  drawTimer = setTimeout(() => {
    drawTimer = undefined
    draw()
  }, 0)
}

function onClick(event: Event) {
  emit('click', event)
}

watch(
  [
    () => props.text,
    () => props.level,
    () => props.correctLevel,
    () => props.size,
    () => props.margin,
    () => props.colorDark,
    () => props.colorLight,
    resolvedCanvasId,
  ],
  scheduleDraw,
)

onMounted(scheduleDraw)
onBeforeUnmount(clearTimer)

defineExpose({
  draw,
  toDataURL,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
