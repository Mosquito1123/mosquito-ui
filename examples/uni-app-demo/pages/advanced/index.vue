<script setup lang="ts">
import { ref } from 'vue'
import {
  MqBarCode,
  MqBanner,
  MqButton,
  MqDivider,
  MqGap,
  MqImagePreview,
  MqImg,
  MqQrCode,
  MqSignature,
  MqSlideVerify,
  MqSwiper,
  MqText,
  showToast,
} from '@mosquito/ui'

const bannerCurrent = ref(0)
const bannerData = [
  { title: '满减活动进行中', image: '' },
  { title: '新客首单立减', image: '' },
  { title: '配送提速升级', image: '' },
]

const swiperCurrent = ref(0)
const swiperList = [
  { url: 'https://picsum.photos/640/360', title: '轮播一' },
  { url: 'https://picsum.photos/640/361', title: '轮播二' },
]

const previewVisible = ref(false)
const previewUrls = ['https://picsum.photos/640/360', 'https://picsum.photos/640/361']

const verified = ref(false)

function onSignature(result: { tempFilePath: string }) {
  showToast(result.tempFilePath ? '签名已导出' : '导出失败')
}

function onCodeError() {
  showToast('内容无法编码')
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">进阶组件</text>
      <text class="demo__desc">轮播、图片预览、二维码、条码、手写签名与滑动验证。</text>
    </view>

    <mq-divider>Banner 轮播图</mq-divider>
    <view class="demo__field">
      <mq-banner v-model="bannerCurrent" :data="bannerData" :height="140" :radius="10" show-title />
      <text class="demo__note">第 {{ bannerCurrent + 1 }} 张</text>
    </view>

    <mq-divider>Swiper 轮播</mq-divider>
    <view class="demo__field">
      <mq-swiper v-model="swiperCurrent" :list="swiperList" :height="140" indicator />
      <text class="demo__note">第 {{ swiperCurrent + 1 }} 张</text>
    </view>

    <mq-divider>ImagePreview 图片预览</mq-divider>
    <view class="demo__field">
      <mq-img
        src="https://picsum.photos/640/360"
        height="120"
        radius="8"
        alt="点图片全屏预览"
        @click="previewVisible = true"
      />
      <mq-button size="small" @click="previewVisible = true">打开预览</mq-button>
      <mq-image-preview v-model="previewVisible" :urls="previewUrls" :current="0" show-index indicator />
    </view>

    <mq-divider>QRCode 二维码 / BarCode 条码</mq-divider>
    <view class="demo__field">
      <mq-qr-code text="https://github.com/Mosquito1123/mosquito-ui" :size="160" @error="onCodeError" />
      <mq-bar-code text="690123456789" :height="60" @error="onCodeError" />
    </view>

    <mq-divider>Signature 签名板</mq-divider>
    <view class="demo__field">
      <mq-signature :export-scale="2" background-color="#fffcf7" :height="200" @confirm="onSignature" />
    </view>

    <mq-divider>SlideVerify 滑动验证</mq-divider>
    <view class="demo__field">
      <mq-slide-verify v-model="verified" @success="showToast('验证通过')" @fail="showToast('再试一次')" />
      <view class="demo__row">
        <mq-button size="small" @click="verified = false">重置状态</mq-button>
      </view>
      <mq-text text="也可以给组件传 ref，调用 reset() 重置。" type="primary" />
    </view>

    <mq-gap :height="12" />
    <text class="demo__foot">进阶组件演示结束</text>
  </view>
</template>

<style lang="scss">
.demo {
  min-height: 100vh;
  padding: 16px 0 32px;
  background: var(--mq-bg-muted, #f6f1e8);
}

.demo__hero {
  padding: 8px 16px 16px;
}

.demo__title {
  display: block;
  font-size: 22px;
  font-weight: 600;
  color: var(--mq-text, #1c1915);
}

.demo__desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__note {
  display: block;
  padding: 8px 0;
  font-size: 12px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__field > .mq-qr-code,
.demo__field > .mq-bar-code {
  margin-bottom: 12px;
}

.demo__row {
  display: flex;
  flex-direction: row;
  padding-top: 8px;
}

.demo__row > .mq-button {
  margin-right: 8px;
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
