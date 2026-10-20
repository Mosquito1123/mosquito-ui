<template>
  <view class="mq-signature" :class="{ 'is-disabled': disabled }">
    <view class="mq-signature__stage" :style="stageStyle">
      <canvas
        :id="canvasId"
        class="mq-signature__canvas"
        :canvas-id="canvasId"
        :disable-scroll="true"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      />
    </view>
    <view class="mq-signature__footer">
      <slot
        name="footer"
        :clear="clear"
        :confirm="confirm"
        :revoke="revoke"
        :restore="restore"
        :can-undo="canUndo"
        :can-redo="canRedo"
      >
        <text class="mq-signature__action" role="button" tabindex="0" @click="clear">
          {{ clearText }}
        </text>
        <text
          v-if="enableHistory"
          class="mq-signature__action"
          :class="{ 'is-off': !canUndo }"
          role="button"
          tabindex="0"
          @click="revoke"
        >
          {{ undoText }}
        </text>
        <text
          class="mq-signature__action is-confirm"
          role="button"
          tabindex="0"
          @click="confirm"
        >
          {{ confirmText }}
        </text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { getUni } from '../../utils/platform'
import type { UniCanvasContext } from '../../utils/platform'
import type { MqSignatureEmits, MqSignatureProps, MqSignatureResult } from './types'

defineOptions({
  name: 'mq-signature',
})

const props = withDefaults(defineProps<MqSignatureProps>(), {
  penColor: '#000000',
  lineWidth: 3,
  confirmText: '确认',
  clearText: '清空',
  undoText: '撤销',
  disabled: false,
  height: 240,
  width: '100%',
  backgroundColor: '',
  fileType: 'png',
  quality: 1,
  exportScale: 1,
  enableHistory: false,
})

const emit = defineEmits<MqSignatureEmits>()

const instance = getCurrentInstance()
const canvasId = `mq-signature-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const strokes = ref<Array<Array<{ x: number; y: number }>>>([])
const redoStack = ref<Array<Array<{ x: number; y: number }>>>([])
const drawing = ref(false)
const currentStroke = ref<Array<{ x: number; y: number }>>([])
const initialized = ref(false)

const stageStyle = computed(() => {
  const style: Record<string, string> = {}
  style.height = typeof props.height === 'number' ? `${props.height}px` : String(props.height)
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : String(props.width)
  }
  return style
})

const canUndo = computed(() => strokes.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)

let context: UniCanvasContext | undefined

function ctx(): UniCanvasContext | undefined {
  if (!context) {
    context = getUni()?.createCanvasContext?.(canvasId, instance?.proxy)
  }
  return context
}

function paintBackground() {
  if (!props.backgroundColor) {
    return
  }
  const canvas = ctx()
  if (!canvas) {
    return
  }
  const width = typeof props.width === 'number' ? props.width : 0
  const height = typeof props.height === 'number' ? props.height : 0
  canvas.setFillStyle(props.backgroundColor)
  canvas.fillRect(0, 0, width || 10000, height || 240)
  canvas.draw()
}

function applyPen(canvas: UniCanvasContext) {
  canvas.setStrokeStyle(props.penColor)
  canvas.setLineWidth(props.lineWidth)
  canvas.setLineCap('round')
  canvas.setLineJoin('round')
}

function drawStroke(points: Array<{ x: number; y: number }>, clear = false) {
  if (!points.length) {
    return
  }
  const canvas = ctx()
  if (!canvas) {
    return
  }
  applyPen(canvas)
  canvas.beginPath()
  canvas.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length; index += 1) {
    canvas.lineTo(points[index].x, points[index].y)
  }
  canvas.stroke()
  canvas.draw(clear)
}

function redraw() {
  const canvas = ctx()
  if (!canvas) {
    return
  }
  canvas.clearRect(0, 0, 10000, 10000)
  canvas.draw()
  paintBackground()
  for (const stroke of strokes.value) {
    drawStroke(stroke, true)
  }
}

function init(forceUpdate = false) {
  if (initialized.value && !forceUpdate) {
    return
  }
  initialized.value = true
  redraw()
}

function touchPoint(event: Event): { x: number; y: number } | null {
  const detail = event as Event & {
    touches?: Array<{ x?: number; y?: number; clientX?: number; clientY?: number }>
    changedTouches?: Array<{ x?: number; y?: number; clientX?: number; clientY?: number }>
  }
  const touch = detail.touches?.[0] ?? detail.changedTouches?.[0]
  if (!touch) {
    return null
  }
  const x = Number(touch.x ?? touch.clientX)
  const y = Number(touch.y ?? touch.clientY)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
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
  drawing.value = true
  currentStroke.value = [point]
  redoStack.value = []
  emit('start', event)
}

function onTouchMove(event: Event) {
  if (!drawing.value || props.disabled) {
    return
  }
  const point = touchPoint(event)
  if (!point) {
    return
  }
  const points = currentStroke.value
  const last = points[points.length - 1]
  points.push(point)
  if (points.length === 2) {
    const canvas = ctx()
    if (!canvas) {
      return
    }
    applyPen(canvas)
    canvas.beginPath()
    canvas.moveTo(last.x, last.y)
    canvas.lineTo(point.x, point.y)
    canvas.stroke()
    canvas.draw(true)
  } else {
    drawStroke(points.slice(-2), true)
  }
  emit('signing', event)
}

function onTouchEnd(event: Event) {
  if (!drawing.value) {
    return
  }
  drawing.value = false
  if (currentStroke.value.length) {
    strokes.value = [...strokes.value, currentStroke.value]
  }
  currentStroke.value = []
  emit('end', event)
}

function clear() {
  strokes.value = []
  redoStack.value = []
  currentStroke.value = []
  drawing.value = false
  const canvas = ctx()
  if (canvas) {
    canvas.clearRect(0, 0, 10000, 10000)
    canvas.draw()
    paintBackground()
  }
  emit('clear')
}

function revoke() {
  if (!strokes.value.length) {
    return
  }
  const next = strokes.value.slice(0, -1)
  redoStack.value = [...redoStack.value, strokes.value[strokes.value.length - 1]]
  strokes.value = next
  redraw()
}

function restore() {
  if (!redoStack.value.length) {
    return
  }
  const next = redoStack.value[redoStack.value.length - 1]
  redoStack.value = redoStack.value.slice(0, -1)
  strokes.value = [...strokes.value, next]
  redraw()
}

function confirm(): Promise<MqSignatureResult | undefined> {
  return new Promise((resolve) => {
    const api = getUni()
    if (!api?.canvasToTempFilePath) {
      resolve(undefined)
      return
    }
    const exportScale = props.exportScale > 0 ? props.exportScale : 1
    const width = (typeof props.width === 'number' ? props.width : 0) * exportScale
    const height = (typeof props.height === 'number' ? props.height : 0) * exportScale
    api.canvasToTempFilePath(
      {
        canvasId,
        fileType: props.fileType,
        quality: props.quality,
        destWidth: width || undefined,
        destHeight: height || undefined,
        success: (res) => {
          const result = { tempFilePath: res.tempFilePath }
          emit('confirm', result)
          resolve(result)
        },
        fail: () => {
          resolve(undefined)
        },
      },
      instance?.proxy,
    )
  })
}

onMounted(() => {
  init()
})

defineExpose({
  init,
  confirm,
  clear,
  revoke,
  restore,
})
</script>

<style lang="scss">
@import './index.scss';
</style>
