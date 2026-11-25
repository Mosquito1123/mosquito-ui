<script setup lang="ts">
import { ref } from 'vue'
import {
  MqActionSheet,
  MqButton,
  MqDialog,
  MqDivider,
  MqGap,
  MqLoading,
  MqMessageBox,
  MqNotify,
  MqPopup,
  MqSafeBottom,
  MqToast,
  hideNotify,
  hideToast,
  showNotify,
  showToast,
  useMessage,
} from '@mosquito/ui'

const message = useMessage()

const centerVisible = ref(false)
const sheetVisible = ref(false)
const bottomVisible = ref(false)
const lockedVisible = ref(false)
const dialogVisible = ref(false)
const popupNote = ref('弹出层还没打开')

const orderActions = [
  { name: '复制单号', description: '记在这一页' },
  { name: '删除订单', color: '#b42318' },
  { name: '暂不可用', disabled: true },
]

function onAction(payload: { item: { name: string } }) {
  showToast(payload.item.name)
}

function onDialogConfirm() {
  showToast('已确认')
}

function onMessageBoxConfirm() {
  message.confirm({ title: '确认操作', msg: '这次真的要继续吗？' }).catch(() => showToast('已取消'))
}

function onMessageBoxPrompt() {
  message
    .prompt({ title: '输入备注', inputPlaceholder: '写点什么' })
    .then((value) => showToast(value || '空内容'))
    .catch(() => showToast('已取消'))
}

function holdToast() {
  showToast({ message: '停住，直到收起', duration: 0 })
}

function flashNotify() {
  showNotify({ type: 'primary', message: '订单状态已更新', closable: true })
}

function onCenterOpen() {
  popupNote.value = '居中层已打开'
}

function onCenterClose() {
  popupNote.value = '居中层已关闭'
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">反馈组件</text>
      <text class="demo__desc">命令式提示与受控弹层。同一页面只挂一个 toast 宿主。</text>
    </view>

    <mq-divider>Toast 轻提示</mq-divider>
    <view class="demo__row">
      <mq-button type="primary" @click="showToast('已保存')">普通提示</mq-button>
      <mq-button type="warning" size="small" @click="holdToast">停住</mq-button>
      <mq-button size="small" @click="hideToast">收起提示</mq-button>
    </view>
    <text class="demo__note">showToast 返回只关闭当前一条的函数；duration 为 0 时不自动关闭。</text>

    <mq-divider>Notify 通知条</mq-divider>
    <view class="demo__row">
      <mq-button type="primary" size="small" @click="flashNotify">顶部通知</mq-button>
      <mq-button
        size="small"
        @click="showNotify({ message: '底部通知', position: 'bottom', type: 'success' })"
      >
        底部通知
      </mq-button>
      <mq-button size="small" @click="hideNotify">收起通知</mq-button>
    </view>

    <mq-divider>Loading 加载指示</mq-divider>
    <view class="demo__row">
      <mq-loading />
      <mq-loading :size="28" color="#b86e00" />
      <mq-loading size="12px" color="#b42318" label="提交中" />
    </view>

    <mq-divider>Dialog 对话框</mq-divider>
    <view class="demo__row">
      <mq-button type="primary" @click="dialogVisible = true">打开对话框</mq-button>
    </view>

    <mq-divider>ActionSheet 动作面板</mq-divider>
    <view class="demo__row">
      <mq-button @click="sheetVisible = true">更多操作</mq-button>
    </view>

    <mq-divider>Popup 弹出层</mq-divider>
    <view class="demo__row">
      <mq-button @click="centerVisible = true">居中层</mq-button>
      <mq-button @click="bottomVisible = true">底部面板</mq-button>
      <mq-button @click="lockedVisible = true">遮罩不关闭</mq-button>
    </view>
    <text class="demo__note">{{ popupNote }}</text>

    <mq-gap :height="12" />

    <mq-dialog
      v-model="dialogVisible"
      title="确认操作"
      message="记在这一页，不会连到支付。"
      @confirm="onDialogConfirm"
    />
    <mq-action-sheet v-model="sheetVisible" title="订单" :actions="orderActions" @select="onAction" />

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

    <mq-popup v-model="bottomVisible" position="bottom" title="底部说明">
      <view class="demo__sheet">
        <mq-safe-bottom bg="#fffcf7">
          <mq-button block @click="bottomVisible = false">收起</mq-button>
        </mq-safe-bottom>
      </view>
    </mq-popup>

    <mq-divider>MessageBox 命令式弹框</mq-divider>
    <view class="demo__row">
      <mq-button size="small" @click="message.alert('操作成功')">alert</mq-button>
      <mq-button size="small" @click="onMessageBoxConfirm">confirm</mq-button>
      <mq-button size="small" @click="onMessageBoxPrompt">prompt</mq-button>
    </view>
    <mq-message-box />

    <mq-toast />
    <mq-notify />

    <text class="demo__foot">反馈组件演示结束</text>
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
.demo__row > .mq-loading {
  margin-right: 8px;
  margin-bottom: 8px;
}

.demo__panel,
.demo__sheet {
  padding: 16px;
}

.demo__panel-title {
  display: block;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 500;
}

.demo__foot {
  display: block;
  padding: 16px;
  font-size: 12px;
  text-align: center;
  color: var(--mq-text-secondary, #6f675e);
}
</style>
