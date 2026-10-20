<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  MqActionSheet,
  MqAvatar,
  MqAvatarGroup,
  MqBadge,
  MqButton,
  MqCalendar,
  MqCascader,
  MqCell,
  MqCellGroup,
  MqCheckbox,
  MqCheckboxGroup,
  MqCollapse,
  MqCollapseItem,
  MqCountdown,
  MqDatetimePicker,
  MqDialog,
  MqDropMenu,
  MqDropMenuItem,
  MqDivider,
  MqEmpty,
  MqFloatingPanel,
  MqFloatView,
  MqGap,
  MqImg,
  MqInput,
  MqInputNumber,
  MqLoading,
  MqMarquee,
  MqNavbar,
  MqNoticeBar,
  MqNotify,
  MqPicker,
  MqPopup,
  MqProgress,
  MqRadio,
  MqRadioGroup,
  MqRate,
  MqReadMore,
  MqSafeBottom,
  MqSearch,
  MqSegmented,
  MqSelect,
  MqSignature,
  MqSkeleton,
  MqSlider,
  MqSlideVerify,
  MqStep,
  MqSteps,
  MqSwitch,
  MqTab,
  MqTable,
  MqTabbar,
  MqTabbarItem,
  MqTabs,
  MqTag,
  MqTextarea,
  MqTimeline,
  MqTimelineItem,
  MqToast,
  MqUpload,
  hideToast,
  showNotify,
  showToast,
} from '@mosquito/ui'
import type { MqCascaderOption, MqSelectOption, MqTableColumn } from '@mosquito/ui'

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
const dialogVisible = ref(false)
const count = ref(2)
const tab = ref('order')
const tabbar = ref('home')
const segment = ref('评论')
const skeletonOn = ref(true)
const segments = ['评论', '点赞', '贡献']
const pickerVisible = ref(false)
const calendarVisible = ref(false)
const date = ref('2026-10-20')
const city = ref<Array<string | number>>(['zj', 'hz'])
const cities = [
  {
    value: 'zj',
    label: '浙江',
    children: [
      { value: 'hz', label: '杭州' },
      { value: 'nb', label: '宁波' },
    ],
  },
  {
    value: 'js',
    label: '江苏',
    children: [
      { value: 'nj', label: '南京' },
      { value: 'sz', label: '苏州' },
    ],
  },
]
const uploads = ref<string[]>([])
const tableColumns: MqTableColumn[] = [
  { prop: 'name', label: '项目', width: 110 },
  {
    prop: 'amount',
    label: '金额',
    align: 'right',
    formatter: (_row, value) => `¥${Number(value).toFixed(2)}`,
  },
  { prop: 'state', label: '状态', width: 76, align: 'center' },
]
const tableData = [
  { id: 1, name: '运费', amount: 12, state: '已付' },
  { id: 2, name: '包装', amount: 3.5, state: '待付' },
]

const cityLabel = computed(() => {
  const selected = city.value
  const group = cities.find((item) => item.value === selected[0])
  const child = group?.children.find((item) => item.value === selected[1])
  return group && child ? `${group.label} / ${child.label}` : '请选择'
})

function onTableRow(row: Record<string, unknown>) {
  showToast(`${String(row.name)} 行`)
}

const datetimeVisible = ref(false)
const datetimeValue = ref(Date.now())
const cascadeVisible = ref(false)
const region = ref<string | number>('hz')
const regionOptions: MqCascaderOption[] = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波' },
    ],
  },
  {
    value: 'js',
    text: '江苏',
    children: [
      { value: 'nj', text: '南京' },
      { value: 'sz', text: '苏州' },
    ],
  },
]
const sortValue = ref<string | number>('default')
const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '销量优先', value: 'sales' },
]
const filter = ref<string | number>('all')
const filterOptions = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'unpaid', tip: '下单 30 分钟内' },
  { label: '已发货', value: 'shipped' },
]
const panelHeight = ref(120)
const panelOpen = ref(false)

const datetimeLabel = computed(() => {
  const date = new Date(datetimeValue.value)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
})

const regionLabel = computed(() => {
  for (const province of regionOptions) {
    const city = province.children?.find((item) => item.value === region.value)
    if (city) {
      return `${province.text} / ${city.text}`
    }
  }
  return '请选择'
})

function onSignature(result: { tempFilePath: string }) {
  showToast(result.tempFilePath ? '签名已导出' : '导出失败')
}

const selectVisible = ref(false)
const selectValue = ref<string | number>('hz')
const selectOptions: MqSelectOption[] = [
  { label: '杭州', value: 'hz' },
  { label: '宁波', value: 'nb' },
  { label: '南京', value: 'nj' },
  { label: '苏州', value: 'sz' },
]
const multiVisible = ref(false)
const multiValue = ref<Array<string | number>>(['hz'])
const tagOptions: MqSelectOption[] = [
  { label: '包邮', value: 'free' },
  { label: '次日达', value: 'next' },
  { label: '支持退换', value: 'refund' },
]
const verified = ref(false)

const selectLabel = computed(
  () => selectOptions.find((item) => item.value === selectValue.value)?.label || '请选择',
)

const multiLabel = computed(() => {
  const labels = multiValue.value
    .map((value) => tagOptions.find((item) => item.value === value)?.label)
    .filter(Boolean)
  return labels.length ? labels.join('、') : '请选择'
})

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

function onDialogConfirm() {
  showToast('已确认')
}

function flashNotify() {
  showNotify({ type: 'primary', message: '订单状态已更新', closable: true })
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

    <mq-divider>图片、选择和数据</mq-divider>

    <view class="demo__row">
      <mq-avatar-group :max-count="3" :total="8" size="medium">
        <mq-avatar text="蚊" bg-color="#0f3d32" color="#f7f4ee" />
        <mq-avatar text="式" />
        <mq-avatar src="https://picsum.photos/80" alt="图" />
        <mq-avatar text="UI" />
      </mq-avatar-group>
    </view>

    <view class="demo__field">
      <mq-img
        src="https://picsum.photos/640/360"
        height="120"
        radius="8"
        alt="网络不可用时会落到这块占位"
      />
    </view>

    <mq-cell title="城市" :value="cityLabel" is-link @click="pickerVisible = true" />
    <mq-cell title="日期" :value="date" is-link @click="calendarVisible = true" />

    <view class="demo__field">
      <mq-upload v-model="uploads" :max-count="4" tip="选图后先保存在本地路径，接 action 才会上传" />
    </view>

    <view class="demo__field">
      <mq-table
        :data="tableData"
        :columns="tableColumns"
        row-key="id"
        stripe
        border
        size="small"
        @row-click="onTableRow"
      />
    </view>

    <mq-divider>日期、级联和手写</mq-divider>

    <mq-cell title="日期时间" :value="datetimeLabel" is-link @click="datetimeVisible = true" />
    <mq-cell title="地区" :value="regionLabel" is-link @click="cascadeVisible = true" />

    <view class="demo__field">
      <mq-drop-menu>
        <mq-drop-menu-item v-model="filter" title="筛选" :options="filterOptions" />
        <mq-drop-menu-item v-model="sortValue" title="排序" :options="sortOptions" />
      </mq-drop-menu>
    </view>

    <view class="demo__field">
      <mq-signature
        :export-scale="2"
        background-color="#fffcf7"
        :height="200"
        @confirm="onSignature"
      />
    </view>

    <view class="demo__field">
      <mq-button block @click="panelOpen = true">打开浮动面板</mq-button>
    </view>

    <mq-divider>时间线、选择和验证</mq-divider>

    <view class="demo__field">
      <mq-marquee
        text="今日订单已更新，点击查看配送进度；本周满减活动进行中。"
        :duration="10"
        @click="showToast('点了跑马灯')"
      />
    </view>

    <mq-cell title="单选城市" :value="selectLabel" is-link @click="selectVisible = true" />
    <mq-cell title="多选标签" :value="multiLabel" is-link @click="multiVisible = true" />

    <view class="demo__field">
      <mq-slide-verify
        v-model="verified"
        @success="showToast('验证通过')"
        @fail="showToast('再试一次')"
      />
    </view>

    <view class="demo__field">
      <mq-read-more
        text="轻量组件库优先保证运行时开销可控：列表只渲染必要节点，弹层复用一个遮罩，动画尽量交给 CSS。长文本默认折叠，展开后再完整显示，避免首屏被一段说明撑高。这里是一段用于演示折叠效果的占位文本，可以替换成协议、商品详情或帮助说明。"
        :max-height="72"
      />
    </view>

    <view class="demo__field">
      <mq-timeline>
        <mq-timeline-item title="下单" time="09:20" active>订单已创建，等待支付</mq-timeline-item>
        <mq-timeline-item title="发货" time="14:05">仓库已出库，运输中</mq-timeline-item>
        <mq-timeline-item title="签收" time="待定">等待收货</mq-timeline-item>
      </mq-timeline>
    </view>

    <mq-float-view :x="300" :y="540" :width="52" :height="52" @click="showToast('点了悬浮窗')">
      <view class="demo__float">+</view>
    </mq-float-view>

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

    <mq-divider>导航和反馈</mq-divider>

    <mq-navbar title="订单详情" left-text="返回" left-arrow right-text="分享" bordered @click-left="showToast('返回')" @click-right="showToast('分享')" />

    <mq-gap :height="12" />

    <mq-tabs v-model="tab">
      <mq-tab title="订单" name="order">
        <text>订单内容</text>
      </mq-tab>
      <mq-tab title="物流" name="ship">
        <text>物流内容</text>
      </mq-tab>
      <mq-tab title="禁用" name="off" disabled>
        <text>不会打开</text>
      </mq-tab>
    </mq-tabs>

    <view class="demo__field">
      <mq-segmented v-model="segment" :options="segments" />
      <text class="demo__note">当前分段：{{ segment }}</text>
    </view>

    <view class="demo__row">
      <mq-input-number v-model="count" :min="0" :max="9" />
      <mq-button size="small" @click="dialogVisible = true">对话框</mq-button>
      <mq-button size="small" type="primary" @click="flashNotify">通知</mq-button>
      <mq-button size="small" @click="skeletonOn = !skeletonOn">骨架</mq-button>
    </view>

    <view class="demo__field">
      <mq-countdown :time="90 * 60 * 1000" format="mm分ss秒" />
      <mq-gap :height="8" />
      <mq-skeleton theme="paragraph" :loading="skeletonOn" animation="gradient">
        <text>骨架关掉后显示这段文字。</text>
      </mq-skeleton>
    </view>

    <mq-tabbar v-model="tabbar" bordered>
      <mq-tabbar-item name="home" title="首页" mark="首" />
      <mq-tabbar-item name="cart" title="购物车" mark="车" :value="3" />
      <mq-tabbar-item name="me" title="我的" mark="我" is-dot />
    </mq-tabbar>

    <mq-dialog
      v-model="dialogVisible"
      title="确认操作"
      message="记在这一页，不会连到支付。"
      @confirm="onDialogConfirm"
    />

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

    <mq-picker
      v-model="city"
      v-model:visible="pickerVisible"
      title="选择城市"
      :columns="cities"
      cascade
    />

    <mq-popup v-model="calendarVisible" position="bottom" title="选择日期">
      <view class="demo__field">
        <mq-calendar v-model="date" @confirm="calendarVisible = false" />
      </view>
      <mq-safe-bottom />
    </mq-popup>

    <mq-datetime-picker
      v-model="datetimeValue"
      v-model:visible="datetimeVisible"
      title="选择日期时间"
      :use-second="false"
    />

    <mq-cascader
      v-model="region"
      v-model:visible="cascadeVisible"
      title="选择地区"
      :options="regionOptions"
    />

    <mq-floating-panel
      v-if="panelOpen"
      v-model:height="panelHeight"
      :anchors="[120, 320]"
      safe-area
    >
      <view class="demo__field">
        <text class="demo__note">拖动顶部横条，或直接在内容区下拉。</text>
        <mq-button size="small" type="primary" @click="panelOpen = false">收起面板</mq-button>
      </view>
    </mq-floating-panel>

    <mq-select
      v-model="selectValue"
      v-model:visible="selectVisible"
      title="选择城市"
      searchable
      placeholder="搜索城市"
      :options="selectOptions"
    />

    <mq-select
      v-model="multiValue"
      v-model:visible="multiVisible"
      title="选择标签"
      multiple
      :options="tagOptions"
    />

    <mq-toast />
    <mq-notify />

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

.demo__float {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  color: #f7f4ee;
  font-size: 22px;
  background: var(--mq-color-primary, #0f3d32);
  border-radius: 50%;
  box-shadow: 0 6px 18px rgba(15, 61, 50, 0.32);
}
</style>
