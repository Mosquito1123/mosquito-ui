<script setup lang="ts">
const categories = [
  {
    title: '基础组件',
    mark: '基',
    path: '/pages/basic/index',
    desc: 'button / cell / tag / badge / avatar / img / text / icon',
  },
  {
    title: '表单组件',
    mark: '表',
    path: '/pages/form/index',
    desc: 'input / textarea / switch / checkbox / radio / picker / calendar / upload / form',
  },
  {
    title: '反馈组件',
    mark: '馈',
    path: '/pages/feedback/index',
    desc: 'toast / notify / dialog / action-sheet / popup / loading',
  },
  {
    title: '展示组件',
    mark: '展',
    path: '/pages/display/index',
    desc: 'card / progress / steps / collapse / table / tree / timeline / waterfall',
  },
  {
    title: '导航组件',
    mark: '航',
    path: '/pages/nav/index',
    desc: 'navbar / tabs / tabbar / index-bar / sidebar / sticky / backtop',
  },
  {
    title: '进阶组件',
    mark: '进',
    path: '/pages/advanced/index',
    desc: 'banner / image-preview / qr-code / bar-code / signature / slide-verify',
  },
  {
    title: '组合式函数',
    mark: '合',
    path: '/pages/composables/index',
    desc: 'use-toast / use-notify / use-dialog / use-count-down / use-upload / use-config-provider',
  },
]

function go(path: string) {
  uni.navigateTo({ url: path })
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">蚊式组件</text>
      <text class="demo__desc">浅节点、CSS 变量。按分类浏览可运行示例。</text>
    </view>

    <view class="demo__list">
      <view v-for="item in categories" :key="item.path" class="demo__entry" @click="go(item.path)">
        <view class="demo__mark">{{ item.mark }}</view>
        <view class="demo__body">
          <text class="demo__entry-title">{{ item.title }}</text>
          <text class="demo__entry-desc">{{ item.desc }}</text>
        </view>
        <text class="demo__arrow">›</text>
      </view>
    </view>

    <text class="demo__foot">前缀 mq- · 面向 uni-app（Vue 3）</text>
  </view>
</template>

<style lang="scss">
.demo {
  min-height: 100vh;
  padding: 16px 0 32px;
  background: var(--mq-bg-muted, #f6f1e8);
}

.demo__hero {
  padding: 8px 16px 20px;
}

.demo__title {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: var(--mq-text, #1c1915);
}

.demo__desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__list {
  padding: 0 12px;
}

.demo__entry {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 14px 12px;
  background: var(--mq-bg, #fffcf7);
  border: 1px solid var(--mq-border, #e6e2da);
  border-radius: var(--mq-radius, 8px);
}

.demo__mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 12px;
  color: var(--mq-color-primary-text, #f7f4ee);
  font-size: 15px;
  background: var(--mq-color-primary, #0f3d32);
  border-radius: 8px;
}

.demo__body {
  flex: 1;
  min-width: 0;
}

.demo__entry-title {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--mq-text, #1c1915);
}

.demo__entry-desc {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__arrow {
  margin-left: 8px;
  font-size: 20px;
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
