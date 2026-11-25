<script setup lang="ts">
import {
  MqButton,
  MqConfigProvider,
  MqDialog,
  MqDivider,
  MqMessageBox,
  MqGap,
  MqNotify,
  MqTag,
  MqToast,
} from '@mosquito/ui'
import {
  useConfigProvider,
  useCountDown,
  useDialog,
  useMessage,
  useNotify,
  useToast,
  useUpload,
} from '@mosquito/ui/composables'

const toast = useToast({ duration: 1500 })
const notify = useNotify({ position: 'top', duration: 2500 })
const dialog = useDialog({ title: '确认操作', message: '记在这一页，不会连到支付。' })
const message = useMessage()
const dialogVisible = dialog.visible
const timer = useCountDown({ time: 90 * 1000, format: 'mm分ss秒' })
const uploader = useUpload({ accept: 'image', maxCount: 3 })
const theme = useConfigProvider({ theme: 'light' })

async function onConfirm() {
  const ok = await dialog.confirm()
  toast.show(ok ? '已确认' : '已取消')
}

async function onPick() {
  const picked = await uploader.choose()
  toast.show(picked.length ? `选中 ${picked.length} 个文件` : '没有选中文件')
}

async function onUpload() {
  const urls = await uploader.upload()
  toast.show(urls.length ? `上传完成 ${urls.length} 个` : '没有可上传的文件')
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">组合式函数</text>
      <text class="demo__desc">从 @mosquito/ui/composables 导入，按场景把命令式调用收进逻辑层。</text>
    </view>

    <mq-divider>useToast 轻提示</mq-divider>
    <view class="demo__field">
      <view class="demo__row">
        <mq-button type="primary" size="small" @click="toast.show('保存成功')">普通提示</mq-button>
        <mq-button type="success" size="small" @click="toast.success('已提交')">成功</mq-button>
        <mq-button
          type="warning"
          size="small"
          @click="toast.show({ message: '停住，直到收起', duration: 0 })"
        >
          停住
        </mq-button>
        <mq-button size="small" @click="toast.hide()">收起</mq-button>
      </view>
    </view>

    <mq-divider>useNotify 通知条</mq-divider>
    <view class="demo__field">
      <view class="demo__row">
        <mq-button type="primary" size="small" @click="notify.primary('提交中')">主色</mq-button>
        <mq-button type="success" size="small" @click="notify.success('保存成功')">成功</mq-button>
        <mq-button type="danger" size="small" @click="notify.error('删除失败')">错误</mq-button>
        <mq-button size="small" @click="notify.hide()">收起</mq-button>
      </view>
    </view>

    <mq-divider>useDialog 对话框状态</mq-divider>
    <view class="demo__field">
      <view class="demo__row">
        <mq-button type="primary" size="small" @click="dialog.show({ message: '确定记在这一页？' })">
          打开
        </mq-button>
      </view>
      <mq-dialog
        v-model="dialogVisible"
        :title="dialog.title.value"
        :message="dialog.message.value"
        confirm-text="确认"
        @confirm="onConfirm"
        @cancel="dialog.cancel"
      />
    </view>

    <mq-divider>useCountDown 倒计时</mq-divider>
    <view class="demo__field">
      <text class="demo__value">{{ timer.formatted.value }}</text>
      <view class="demo__row">
        <mq-button size="small" @click="timer.pause()">暂停</mq-button>
        <mq-button size="small" @click="timer.start()">继续</mq-button>
        <mq-button size="small" @click="timer.update(30 * 1000)">改为 30 秒</mq-button>
        <mq-button size="small" @click="timer.reset()">重置</mq-button>
      </view>
    </view>

    <mq-divider>useUpload 上传流程</mq-divider>
    <view class="demo__field">
      <view class="demo__row">
        <mq-button size="small" @click="onPick">选择图片</mq-button>
        <mq-button type="primary" size="small" @click="onUpload">上传</mq-button>
        <mq-button size="small" @click="uploader.clear()">清空</mq-button>
      </view>
      <text class="demo__note"
        >已选 {{ uploader.files.value.length }} 个，进度 {{ uploader.progress.value }}%</text
      >
    </view>

    <mq-divider>useConfigProvider 主题状态</mq-divider>
    <view class="demo__field">
      <view class="demo__row">
        <mq-button size="small" @click="theme.setTheme('light')">亮色</mq-button>
        <mq-button size="small" @click="theme.setTheme('dark')">暗色</mq-button>
        <mq-button size="small" @click="theme.reset()">重置</mq-button>
      </view>
      <mq-config-provider :theme="theme.theme.value" :theme-vars="theme.cssVars.value">
        <view class="demo__scope">
          <mq-button type="primary" size="small">受控按钮</mq-button>
          <mq-tag type="primary">受控标记</mq-tag>
        </view>
      </mq-config-provider>
    </view>

    <mq-divider>useMessage 命令式弹框</mq-divider>
    <view class="demo__row">
      <mq-button size="small" @click="message.alert('操作成功')">alert</mq-button>
      <mq-button
        size="small"
        @click="
          message
            .confirm('确定继续吗')
            .then(() => toast.show('已确认'))
            .catch(() => toast.show('已取消'))
        "
      >
        confirm
      </mq-button>
    </view>
    <mq-message-box />

    <mq-toast />
    <mq-notify />

    <mq-gap :height="12" />
    <text class="demo__foot">组合式用法演示结束</text>
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

.demo__value {
  display: block;
  padding: 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--mq-color-primary, #0f3d32);
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.demo__row > .mq-button {
  margin-right: 8px;
  margin-bottom: 8px;
}

.demo__scope {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  padding: 12px;
}

.demo__scope > .mq-button,
.demo__scope > .mq-tag {
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
