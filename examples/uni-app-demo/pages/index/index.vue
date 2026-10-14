<script setup lang="ts">
import { ref } from 'vue'
import {
  MqButton,
  MqCell,
  MqLoading,
  MqPopup,
  MqSafeBottom,
  MqToast,
  hideToast,
  showToast,
} from '@mosquito/ui'

const centerVisible = ref(false)
const sheetVisible = ref(false)
const lockedVisible = ref(false)
const popupNote = ref('弹出层还没打开')
const saving = ref(false)
const footerBg = ref('#f6f1e8')
const footerColor = ref('#6f675e')

const bgChoices = [
  { bg: 'transparent', label: '透明', ink: '#6f675e' },
  { bg: '#fffcf7', label: '纸色', ink: '#6f675e' },
  { bg: '#0f3d32', label: '松绿', ink: '#f7f4ee' },
]

function onSave() {
  saving.value = true
  showToast('已记在这一页')
  setTimeout(() => {
    saving.value = false
  }, 700)
}

function onDisabledCell() {
  showToast('禁用格不该发出点击')
}

function holdToast() {
  showToast({ message: '停住，直到收起', duration: 0 })
}

function onCenterOpen() {
  popupNote.value = '居中层已打开'
}

function onCenterClose() {
  popupNote.value = '居中层已关闭'
}

function pickBg(bg: string, ink: string) {
  footerBg.value = bg
  footerColor.value = ink
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">蚊式组件</text>
      <text class="demo__desc">浅节点、CSS 变量。禁用、加载和 v-model 都停在组件边界上。</text>
    </view>

    <mq-cell title="底部面板" value="滑出" is-link @click="sheetVisible = true" />
    <mq-cell title="居中层" value="打开" is-link @click="centerVisible = true" />
    <mq-cell title="遮罩不关闭" value="锁定" is-link @click="lockedVisible = true" />
    <mq-cell title="禁用" value="无点击" is-link disabled @click="onDisabledCell" />
    <mq-cell title="数量" :value="0" />

    <text class="demo__note">{{ popupNote }}</text>

    <view class="demo__row">
      <mq-button type="primary" :loading="saving" @click="onSave">保存</mq-button>
      <mq-button @click="hideToast">收起提示</mq-button>
      <mq-button type="warning" size="small" @click="holdToast">停住</mq-button>
      <mq-button type="danger" size="small" disabled>禁用</mq-button>
    </view>

    <mq-button type="success" block @click="showToast({ message: '块级按钮', duration: 1600 })">
      块级按钮
    </mq-button>

    <view class="demo__row">
      <mq-loading />
      <mq-loading :size="28" color="#b86e00" />
      <mq-loading size="12px" color="#b42318" label="提交中" />
    </view>

    <text class="demo__note">安全区背景。点色块，底部条跟着变。</text>
    <view class="demo__presets">
      <mq-safe-bottom
        v-for="item in bgChoices"
        :key="item.label"
        class="demo__preset"
        :bg="item.bg"
        @click="pickBg(item.bg, item.ink)"
      >
        <text class="demo__preset-text" :style="{ color: item.ink }">{{ item.label }}</text>
      </mq-safe-bottom>
    </view>

    <mq-popup
      v-model="centerVisible"
      position="center"
      title="居中说明"
      @open="onCenterOpen"
      @close="onCenterClose"
    >
      <view class="demo__panel">
        <text class="demo__panel-title">居中内容</text>
        <mq-button type="primary" block @click="centerVisible = false">关闭</mq-button>
      </view>
    </mq-popup>

    <mq-popup v-model="lockedVisible" position="center" :mask-closable="false" title="需要点按钮关闭">
      <view class="demo__panel">
        <text class="demo__panel-title">点遮罩不会关</text>
        <mq-button type="primary" block @click="lockedVisible = false">关闭</mq-button>
      </view>
    </mq-popup>

    <mq-popup v-model="sheetVisible" position="bottom" title="底部说明">
      <view class="demo__sheet">
        <text class="demo__panel-title">底部只留一块面板</text>
        <mq-safe-bottom bg="#fffcf7">
          <mq-button block @click="sheetVisible = false">收起</mq-button>
        </mq-safe-bottom>
      </view>
    </mq-popup>

    <mq-toast />

    <mq-safe-bottom class="demo__footer" :bg="footerBg">
      <text class="demo__footer-text" :style="{ color: footerColor }">底部安全区 {{ footerBg }}</text>
    </mq-safe-bottom>
  </view>
</template>

<style lang="scss">
.demo {
  min-height: 100vh;
  padding: 16px 0 24px;
}

.demo__hero {
  padding: 8px 16px 20px;
}

.demo__title {
  display: block;
  font-size: 22px;
  font-weight: 600;
}

.demo__desc {
  display: block;
  margin-top: 6px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__note {
  display: block;
  padding: 8px 16px 0;
  color: var(--mq-text-secondary, #6f675e);
  font-size: 12px;
}

.demo__row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px 8px 8px 16px;
}

.demo__row > .mq-button,
.demo__row > .mq-loading {
  margin-right: 8px;
  margin-bottom: 8px;
}

.demo__presets {
  display: flex;
  flex-direction: row;
  padding: 8px 16px 0;
}

.demo__preset {
  flex: 1;
  margin-right: 8px;
  border: 1px solid var(--mq-border, #e6e2da);
  border-radius: 8px;
  cursor: pointer;
}

.demo__preset:last-child {
  margin-right: 0;
}

.demo__preset-text {
  display: block;
  padding: 10px 8px;
  font-size: 12px;
  text-align: center;
}

.demo__panel,
.demo__sheet {
  padding: 16px;
}

.demo__panel-title {
  display: block;
  margin-bottom: 12px;
}

.demo__footer {
  margin-top: 12px;
}

.demo__footer-text {
  display: block;
  padding: 8px 16px 0;
  font-size: 12px;
}
</style>
