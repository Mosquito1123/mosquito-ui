<script setup lang="ts">
import { ref } from 'vue'
import {
  MqActionSheet,
  MqBadge,
  MqButton,
  MqCell,
  MqCellGroup,
  MqCheckbox,
  MqCheckboxGroup,
  MqCollapse,
  MqCollapseItem,
  MqDivider,
  MqEmpty,
  MqInput,
  MqLoading,
  MqNoticeBar,
  MqPopup,
  MqProgress,
  MqRadio,
  MqRadioGroup,
  MqRate,
  MqSafeBottom,
  MqSearch,
  MqSlider,
  MqStep,
  MqSteps,
  MqSwitch,
  MqTag,
  MqTextarea,
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
const notifyOn = ref(true)
const agreed = ref(false)
const nickname = ref('')
const fruit = ref<Array<string | number>>(['apple'])
const shipping = ref('air')
const progress = ref(46)
const tags = ref(['已支付', '待发货'])
const memo = ref('')
const volume = ref(40)
const score = ref(3)
const step = ref(1)
const openPanels = ref<string[]>(['ship'])
const query = ref('')
const actionsVisible = ref(false)
const orderActions = [
  { name: '复制单号', description: '记在这一页' },
  { name: '删除订单', color: '#b42318' },
  { name: '暂不可用', disabled: true },
]

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

function closeTag(index: number) {
  tags.value = tags.value.filter((_, item) => item !== index)
}

function bumpProgress(delta: number) {
  progress.value = Math.min(100, Math.max(0, progress.value + delta))
}

function onSearch(payload: { value: string }) {
  const keyword = payload.value.trim()
  showToast(keyword ? `搜索 ${keyword}` : '请输入关键字')
}

function onAction(payload: { item: { name: string } }) {
  showToast(payload.item.name)
}

function moveStep(delta: number) {
  step.value = Math.min(2, Math.max(0, step.value + delta))
}
</script>

<template>
  <view class="demo">
    <view class="demo__hero">
      <text class="demo__title">蚊式组件</text>
      <text class="demo__desc">浅节点、CSS 变量。按钮、单元格和表单都走同一套 v-model。</text>
    </view>

    <mq-cell title="底部面板" value="滑出" is-link @click="sheetVisible = true" />
    <mq-cell title="居中层" value="打开" is-link @click="centerVisible = true" />
    <mq-cell title="遮罩不关闭" value="锁定" is-link @click="lockedVisible = true" />
    <mq-cell title="禁用" value="无点击" is-link disabled @click="onDisabledCell" />
    <mq-cell title="数量" :value="0" />

    <text class="demo__note">{{ popupNote }}</text>

    <view class="demo__row">
      <mq-button type="primary" :loading="saving" @click="onSave">保存</mq-button>
      <mq-button variant="plain" type="primary" round @click="hideToast">镂空</mq-button>
      <mq-button variant="text" type="primary" @click="hideToast">文字</mq-button>
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

    <mq-divider>表单和标记</mq-divider>

    <mq-cell-group title="订单" value="可嵌开关" insert border>
      <mq-cell title="昵称" label="最多 12 个字" required>
        <mq-input v-model="nickname" compact placeholder="怎么称呼" :maxlength="12" show-word-limit clearable />
      </mq-cell>
      <mq-cell title="通知" clickable @click="notifyOn = !notifyOn">
        <mq-switch v-model="notifyOn" />
      </mq-cell>
      <mq-cell title="备注" placeholder="还没写" ellipsis value="" />
    </mq-cell-group>

    <view class="demo__field">
      <mq-checkbox v-model="agreed">同意记在这一页</mq-checkbox>
      <text class="demo__note">水果最多选两项</text>
      <mq-checkbox-group v-model="fruit" direction="horizontal" :max="2">
        <mq-checkbox name="apple">苹果</mq-checkbox>
        <mq-checkbox name="pear">梨</mq-checkbox>
        <mq-checkbox name="plum" disabled>李子</mq-checkbox>
      </mq-checkbox-group>
      <mq-radio-group v-model="shipping" direction="horizontal" type="button">
        <mq-radio value="air">空运</mq-radio>
        <mq-radio value="land">陆运</mq-radio>
      </mq-radio-group>
    </view>

    <view class="demo__row">
      <mq-tag>默认</mq-tag>
      <mq-tag type="primary">进行中</mq-tag>
      <mq-tag type="success" variant="plain">完成</mq-tag>
      <mq-tag type="warning" variant="light" round>注意</mq-tag>
      <mq-tag
        v-for="(tag, index) in tags"
        :key="tag"
        type="danger"
        closable
        @close="closeTag(index)"
      >
        {{ tag }}
      </mq-tag>
    </view>

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

    <mq-progress :percentage="progress" />
    <mq-progress :percentage="100" status="success" hide-text />
    <view class="demo__row">
      <mq-button size="small" @click="bumpProgress(-10)">减十</mq-button>
      <mq-button size="small" type="primary" @click="bumpProgress(10)">加十</mq-button>
    </view>

    <mq-divider>反馈和导航</mq-divider>

    <view class="demo__field">
      <mq-search v-model="query" placeholder="搜订单" clearable @search="onSearch" />
    </view>

    <mq-notice-bar text="包裹已揽收，预计明天送达" closable scrollable @click="showToast('点了通告')">
      <template #prefix>
        <text>通知</text>
      </template>
    </mq-notice-bar>
    <mq-notice-bar text="说明可以换行，不滚动。" type="info" wrapable />

    <view class="demo__field">
      <mq-textarea v-model="memo" placeholder="补充说明" :maxlength="40" show-word-limit clearable auto-height />
    </view>

    <mq-slider v-model="volume" show-extreme-value :step="10" />
    <text class="demo__note">音量 {{ volume }}</text>

    <view class="demo__field">
      <mq-rate v-model="score" allow-half clearable />
      <text class="demo__note">评分 {{ score }}。再点当前星会清空。</text>
    </view>

    <mq-steps :active="step" align-center>
      <mq-step title="下单" description="已提交" />
      <mq-step title="发货" />
      <mq-step title="签收" />
    </mq-steps>
    <view class="demo__row">
      <mq-button size="small" @click="moveStep(-1)">上一步</mq-button>
      <mq-button size="small" type="primary" @click="moveStep(1)">下一步</mq-button>
    </view>

    <mq-collapse v-model="openPanels">
      <mq-collapse-item name="ship" title="配送说明">
        <text>空运两天，陆运五天。</text>
      </mq-collapse-item>
      <mq-collapse-item name="pay" title="付款说明">
        <text>记在这一页，不连支付。</text>
      </mq-collapse-item>
    </mq-collapse>

    <mq-cell title="更多操作" value="打开" is-link @click="actionsVisible = true" />
    <mq-action-sheet v-model="actionsVisible" title="订单" :actions="orderActions" @select="onAction" />

    <mq-empty tip="这里还没有记录">
      <mq-button size="small" @click="showToast('去添加')">去添加</mq-button>
    </mq-empty>

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
.demo__row > .mq-loading,
.demo__row > .mq-badge,
.demo__row > .mq-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.demo__field {
  padding: 0 16px 8px;
}

.demo__dot-label {
  display: inline-block;
  padding: 8px 12px 8px 0;
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
