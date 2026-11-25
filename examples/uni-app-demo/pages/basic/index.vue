<script setup lang="ts">
import { ref } from 'vue'
import {
  MqAvatar,
  MqAvatarGroup,
  MqBadge,
  MqButton,
  MqCell,
  MqCellGroup,
  MqDivider,
  MqGap,
  MqIcon,
  MqImg,
  MqTag,
  MqText,
  showToast,
} from '@mosquito/ui'

const saving = ref(false)
const tags = ref(['已支付', '待发货'])

function onSave() {
  saving.value = true
  showToast('已记在这一页')
  setTimeout(() => {
    saving.value = false
  }, 700)
}

function closeTag(index: number) {
  tags.value = tags.value.filter((_, item) => item !== index)
}

function onDisabledCell() {
  showToast('禁用格不该发出点击')
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">基础组件</text>
      <text class="demo__desc">按钮、单元格、标记、头像、图片与文本。</text>
    </view>

    <text class="demo__label">Button 按钮</text>
    <view class="demo__row">
      <mq-button type="primary" :loading="saving" @click="onSave">保存</mq-button>
      <mq-button variant="plain" type="primary" round @click="showToast('镂空按钮')">镂空</mq-button>
      <mq-button variant="text" type="primary" @click="showToast('文字按钮')">文字</mq-button>
      <mq-button type="success" size="small" @click="showToast('成功')">成功</mq-button>
      <mq-button type="warning" size="small" @click="showToast('警告')">警告</mq-button>
      <mq-button type="danger" size="small" disabled>禁用</mq-button>
    </view>
    <view class="demo__field">
      <mq-button type="success" block @click="showToast({ message: '块级按钮', duration: 1600 })">
        块级按钮
      </mq-button>
    </view>

    <mq-divider>Cell 单元格</mq-divider>
    <mq-cell-group title="订单" value="可嵌内容" insert border>
      <mq-cell title="说明" value="打开" is-link @click="showToast('打开说明')" />
      <mq-cell title="数量" :value="0" />
      <mq-cell title="备注" label="标题下方的一行说明" value="还没写" />
      <mq-cell title="禁用" value="无点击" is-link disabled @click="onDisabledCell" />
    </mq-cell-group>

    <mq-divider>Tag 标记</mq-divider>
    <view class="demo__row">
      <mq-tag>默认</mq-tag>
      <mq-tag type="primary">进行中</mq-tag>
      <mq-tag type="success" variant="plain">完成</mq-tag>
      <mq-tag type="warning" variant="light" round>注意</mq-tag>
      <mq-tag v-for="(tag, index) in tags" :key="tag" type="danger" closable @close="closeTag(index)">
        {{ tag }}
      </mq-tag>
    </view>

    <mq-divider>Badge 徽标</mq-divider>
    <view class="demo__row">
      <mq-badge :value="8">
        <mq-button size="small">消息</mq-button>
      </mq-badge>
      <mq-badge :value="120" :max="99">
        <mq-button size="small" variant="plain">未读</mq-button>
      </mq-badge>
      <mq-badge is-dot>
        <text class="demo__dot-label">有更新</text>
      </mq-badge>
    </view>

    <mq-divider>Avatar 头像</mq-divider>
    <view class="demo__row">
      <mq-avatar text="蚊" bg-color="#0f3d32" color="#f7f4ee" />
      <mq-avatar mark="式" shape="square" />
      <mq-avatar text="UI" size="small" />
    </view>
    <view class="demo__row">
      <mq-avatar-group :max-count="3" :total="8" size="medium">
        <mq-avatar text="蚊" bg-color="#0f3d32" color="#f7f4ee" />
        <mq-avatar text="式" />
        <mq-avatar src="https://picsum.photos/80" alt="图" />
        <mq-avatar text="UI" />
      </mq-avatar-group>
    </view>

    <mq-divider>Img 图片</mq-divider>
    <view class="demo__field">
      <mq-img src="https://picsum.photos/640/360" height="120" radius="8" alt="网络不可用时会落到这块占位" />
    </view>

    <mq-divider>Text 文本</mq-divider>
    <view class="demo__field">
      <mq-text text="主题色文本" type="primary" bold />
      <mq-text text="成功" type="success" />
      <mq-text text="危险" type="error" />
      <mq-text text="¥12.50" mode="price" prefix="合计 " size="18" />
      <mq-text text="13800138000" mode="phone" />
      <mq-text text="两行以上会按 lines 截断显示" :lines="1" />
    </view>

    <mq-divider>Icon 图标</mq-divider>
    <view class="demo__row">
      <mq-icon name="add" :size="20" />
      <mq-icon name="search" :size="20" />
      <mq-icon name="star" :size="20" color="#b86e00" />
      <mq-icon name="check" :size="20" color="#2f7d4a" />
      <mq-icon name="close" :size="20" color="#b42318" />
      <mq-icon name="未知" :size="20" />
    </view>
    <text class="demo__note"
      >内置名映射到 unicode 字形，未知名回退为名称首字符；箭头等标记仍走文字符号。</text
    >
    <view class="demo__row">
      <text class="demo__symbol">‹</text>
      <text class="demo__symbol">›</text>
      <text class="demo__symbol">★</text>
      <text class="demo__symbol">✓</text>
    </view>

    <mq-gap :height="12" />
    <text class="demo__foot">基础组件演示结束</text>
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

.demo__label {
  display: block;
  padding: 4px 16px 8px;
  font-size: 12px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__note {
  display: block;
  padding: 8px 16px 0;
  font-size: 12px;
  color: var(--mq-text-secondary, #6f675e);
}

.demo__row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px 8px 8px 16px;
}

.demo__row > .mq-button,
.demo__row > .mq-tag,
.demo__row > .mq-badge,
.demo__row > .mq-avatar,
.demo__row > .mq-icon,
.demo__row > .demo__symbol {
  margin-right: 8px;
  margin-bottom: 8px;
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__dot-label {
  display: inline-block;
  padding: 8px 12px 8px 0;
  font-size: 13px;
}

.demo__symbol {
  display: inline-block;
  width: 32px;
  height: 32px;
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  color: var(--mq-color-primary, #0f3d32);
  background: var(--mq-bg, #fffcf7);
  border: 1px solid var(--mq-border, #e6e2da);
  border-radius: 6px;
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
