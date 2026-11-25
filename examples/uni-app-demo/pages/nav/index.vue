<script setup lang="ts">
import { ref } from 'vue'
import {
  MqBacktop,
  MqButton,
  MqDivider,
  MqGap,
  MqIndexAnchor,
  MqIndexBar,
  MqNavbar,
  MqSidebar,
  MqSidebarItem,
  MqSticky,
  MqTab,
  MqTabbar,
  MqTabbarItem,
  MqTabs,
  showToast,
} from '@mosquito/ui'

const tab = ref('order')
const tabbar = ref('home')
const sidebar = ref('fruit')
const scrollTop = ref(0)

function onIndexSelect(index: string | number) {
  showToast(`索引 ${index}`)
}

function onSidebarChange(payload: { value: string | number; label: string }) {
  showToast(payload.label)
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">导航组件</text>
      <text class="demo__desc">顶栏、标签页、底栏、索引栏、侧边导航、吸顶与回到顶部。</text>
    </view>

    <mq-divider>Navbar 导航栏</mq-divider>
    <mq-navbar
      title="订单详情"
      left-text="返回"
      left-arrow
      right-text="分享"
      bordered
      @click-left="showToast('返回')"
      @click-right="showToast('分享')"
    />

    <mq-divider>Tabs 标签页</mq-divider>
    <view class="demo__field">
      <mq-tabs v-model="tab">
        <mq-tab title="订单" name="order">
          <text class="demo__pane">订单内容</text>
        </mq-tab>
        <mq-tab title="物流" name="ship">
          <text class="demo__pane">物流内容</text>
        </mq-tab>
        <mq-tab title="禁用" name="off" disabled>
          <text class="demo__pane">不会打开</text>
        </mq-tab>
      </mq-tabs>
    </view>

    <mq-divider>Tabbar 底部标签栏</mq-divider>
    <view class="demo__field">
      <mq-tabbar v-model="tabbar" bordered>
        <mq-tabbar-item name="home" title="首页" mark="首" />
        <mq-tabbar-item name="cart" title="购物车" mark="车" :value="3" />
        <mq-tabbar-item name="me" title="我的" mark="我" is-dot />
      </mq-tabbar>
      <text class="demo__note">当前：{{ tabbar }}</text>
    </view>

    <mq-divider>IndexBar 索引栏</mq-divider>
    <view class="demo__index-wrap">
      <mq-index-bar @select="onIndexSelect">
        <mq-index-anchor index="A">
          <view class="demo__index-item">A · 阿胶</view>
        </mq-index-anchor>
        <view class="demo__index-item">苹果</view>
        <mq-index-anchor index="B">
          <view class="demo__index-item">B · 背包</view>
        </mq-index-anchor>
        <view class="demo__index-item">杯子</view>
        <mq-index-anchor index="C">
          <view class="demo__index-item">C · 茶叶</view>
        </mq-index-anchor>
      </mq-index-bar>
    </view>

    <mq-divider>Sidebar 侧边导航</mq-divider>
    <view class="demo__field demo__sidebar-wrap">
      <mq-sidebar v-model="sidebar" @change="onSidebarChange">
        <mq-sidebar-item label="水果" value="fruit" badge="8" />
        <mq-sidebar-item label="蔬菜" value="veg" is-dot />
        <mq-sidebar-item label="饮品" value="drink" />
        <mq-sidebar-item label="禁用" value="off" disabled />
      </mq-sidebar>
      <view class="demo__side-content">
        <text class="demo__note">当前：{{ sidebar }}</text>
      </view>
    </view>

    <mq-divider>Sticky 吸顶</mq-divider>
    <view class="demo__field">
      <mq-sticky :offset-top="0">
        <view class="demo__sticky">吸顶内容（offsetTop 0）</view>
      </mq-sticky>
      <view class="demo__tall">向下滚动，上面这块会吸在顶部。</view>
    </view>

    <mq-divider>Backtop 回到顶部</mq-divider>
    <view class="demo__field">
      <text class="demo__note">用 scrollTop 控制显示阈值，默认 top 为 300。</text>
      <mq-button size="small" @click="scrollTop = 400">模拟滚动到 400</mq-button>
      <mq-button size="small" @click="scrollTop = 0">回到 0</mq-button>
    </view>
    <mq-backtop :scroll-top="scrollTop" :top="300" @click="scrollTop = 0" />

    <mq-gap :height="72" />
    <text class="demo__foot">导航组件演示结束</text>
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

.demo__pane {
  display: block;
  padding: 16px 0;
  font-size: 13px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__index-wrap {
  height: 240px;
  margin: 0 16px 8px;
  background: var(--mq-bg, #fffcf7);
  border: 1px solid var(--mq-border, #e6e2da);
  border-radius: var(--mq-radius, 8px);
}

.demo__index-item {
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--mq-border, #e6e2da);
}

.demo__sidebar-wrap {
  display: flex;
  flex-direction: row;
  height: 180px;
  overflow: hidden;
  background: var(--mq-bg, #fffcf7);
  border-radius: var(--mq-radius, 8px);
}

.demo__side-content {
  flex: 1;
  padding: 12px;
}

.demo__sticky {
  padding: 10px 12px;
  font-size: 13px;
  color: var(--mq-color-primary, #0f3d32);
  background: var(--mq-bg, #fffcf7);
  border: 1px solid var(--mq-border, #e6e2da);
  border-radius: 6px;
}

.demo__tall {
  height: 160px;
  padding: 12px;
  font-size: 12px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
