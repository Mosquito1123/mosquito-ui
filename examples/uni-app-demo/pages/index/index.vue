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

function onSave() {
  showToast('已记在这一页')
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">蚊式组件</text>
      <text class="demo__desc">六个浅节点组件，主题走 CSS 变量。</text>
    </view>

    <mq-cell title="底部面板" value="滑出" is-link @click="sheetVisible = true" />
    <mq-cell title="居中层" value="打开" is-link @click="centerVisible = true" />
    <mq-cell title="安全区背景" value="暖纸色" />

    <view class="demo__row">
      <mq-button type="primary" @click="onSave">保存</mq-button>
      <mq-button @click="hideToast">收起提示</mq-button>
      <mq-button type="danger" size="small" disabled>禁用</mq-button>
    </view>

    <mq-button type="success" block @click="showToast({ message: '块级按钮', duration: 1600 })">
      块级按钮
    </mq-button>

    <view class="demo__row">
      <mq-loading />
      <mq-loading :size="28" color="#b86e00" />
    </view>

    <mq-popup v-model="centerVisible" position="center">
      <view class="demo__panel">
        <text class="demo__panel-title">居中内容</text>
        <mq-button type="primary" block @click="centerVisible = false">关闭</mq-button>
      </view>
    </mq-popup>

    <mq-popup v-model="sheetVisible" position="bottom">
      <view class="demo__sheet">
        <text class="demo__panel-title">底部只留一块面板</text>
        <mq-safe-bottom bg="#fffcf7">
          <mq-button block @click="sheetVisible = false">收起</mq-button>
        </mq-safe-bottom>
      </view>
    </mq-popup>

    <mq-toast />

    <mq-safe-bottom class="demo__footer" bg="#f6f1e8">
      <text class="demo__footer-text">底部安全区，背景可换</text>
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

.demo__row {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px 8px 16px 16px;
}

.demo__row > .mq-button,
.demo__row > .mq-loading {
  margin-right: 8px;
}

.demo__panel,
.demo__sheet {
  padding: 16px;
}

.demo__panel-title {
  display: block;
  margin-bottom: 12px;
}

.demo__footer-text {
  display: block;
  padding: 8px 16px 0;
  color: var(--mq-text-secondary, #6f675e);
  font-size: 12px;
}
</style>
