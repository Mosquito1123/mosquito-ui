import { describe, expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MqInputNumber from '@/components/mq-input-number/MqInputNumber.vue'

type NumberWrapper = ReturnType<typeof mountNumber>

function mountNumber(props: Record<string, unknown> = {}) {
  return mount(MqInputNumber, { props: { modelValue: 0, ...props } })
}

function control(wrapper: NumberWrapper) {
  return wrapper.find('input')
}

async function clickStep(wrapper: NumberWrapper, index: 0 | 1) {
  await wrapper.findAll('.mq-input-number__btn')[index].trigger('click')
}

describe('MqInputNumber', () => {
  test('默认渲染输入框与加减按钮，点击按钮提交数字', async () => {
    const wrapper = mountNumber()
    expect(wrapper.classes()).toContain('mq-input-number')
    expect(control(wrapper).element.value).toBe('0')
    expect(wrapper.findAll('.mq-input-number__btn')).toHaveLength(2)
    expect(wrapper.findAll('.mq-input-number__btn')[0].classes()).toContain('is-disabled')

    await clickStep(wrapper, 1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: 1 })
  })

  test('遵守 min / max 与 step', async () => {
    const wrapper = mountNumber({ modelValue: 5, min: 3, max: 7, step: 2 })
    await clickStep(wrapper, 1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
    await wrapper.setProps({ modelValue: 7 })
    expect(wrapper.findAll('.mq-input-number__btn')[1].classes()).toContain('is-disabled')

    await clickStep(wrapper, 0)
    expect(wrapper.emitted('update:modelValue')).toEqual([[7], [5]])
    await wrapper.setProps({ modelValue: 3 })
    expect(wrapper.findAll('.mq-input-number__btn')[0].classes()).toContain('is-disabled')
  })

  test('precision 与 stepStrictly 影响回显值', () => {
    const rounded = mountNumber({ modelValue: 1.236, precision: 2 })
    expect(control(rounded).element.value).toBe('1.24')

    const strict = mountNumber({ modelValue: 1.2, step: 0.5, stepStrictly: true })
    expect(control(strict).element.value).toBe('1')
  })

  test('默认立即提交输入值，非法输入不提交', async () => {
    const wrapper = mountNumber({ modelValue: 2, min: 0, max: 10 })
    await control(wrapper).setValue('7')
    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: 7 })

    await control(wrapper).setValue('abc')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  test('immediateChange=false 时只在失焦时提交', async () => {
    const wrapper = mountNumber({ modelValue: 2, immediateChange: false })
    await control(wrapper).setValue('9')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await control(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toEqual([[9]])
  })

  test('focus / blur 事件回传数值或原始字符串', async () => {
    const wrapper = mountNumber({ modelValue: 3 })
    await control(wrapper).trigger('focus')
    expect(wrapper.emitted('focus')).toEqual([[{ value: 3 }]])

    control(wrapper).element.value = '8'
    await control(wrapper).trigger('blur')
    expect(wrapper.emitted('blur')).toEqual([[{ value: 8 }]])
    expect(wrapper.emitted('update:modelValue')).toEqual([[8]])

    control(wrapper).element.value = 'abc'
    await control(wrapper).trigger('focus')
    expect(wrapper.emitted('focus')![1][0]).toEqual({ value: 'abc' })
  })

  test('withoutInput 隐藏输入框但保留加减按钮', async () => {
    const wrapper = mountNumber({ withoutInput: true })
    expect(wrapper.classes()).toContain('is-without-input')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.findAll('.mq-input-number__btn')).toHaveLength(2)

    await clickStep(wrapper, 1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  test('allowNull 支持空值回显、输入清空与失焦清空', async () => {
    const empty = mountNumber({ allowNull: true, modelValue: '' })
    expect(control(empty).element.value).toBe('')
    await control(empty).trigger('focus')
    expect(empty.emitted('focus')).toEqual([[{ value: '' }]])

    const wrapper = mountNumber({ allowNull: true, modelValue: 4 })
    await control(wrapper).setValue('')
    expect(wrapper.emitted('update:modelValue')).toEqual([['']])
    expect(wrapper.emitted('change')![0][0]).toEqual({ value: '' })

    await wrapper.setProps({ modelValue: 4 })
    control(wrapper).element.value = ''
    await control(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toEqual([[''], ['']])

    await clickStep(wrapper, 1)
    expect(wrapper.emitted('update:modelValue')![2][0]).toBe(5)
  })

  test('allowNull=false 时失焦空值回退到当前数字', async () => {
    const wrapper = mountNumber({ modelValue: 4 })
    control(wrapper).element.value = ''
    await control(wrapper).trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('inputWidth 与 placeholder 透传到输入框', () => {
    const numeric = mountNumber({ inputWidth: 120, placeholder: '数量' })
    expect(control(numeric).attributes('style')).toContain('width: 120px')
    expect(control(numeric).attributes('placeholder')).toBe('数量')

    const text = mountNumber({ inputWidth: '80%' })
    expect(control(text).attributes('style')).toContain('width: 80%')
    expect(mountNumber().find('input').attributes('style')).toBeUndefined()
  })

  test('disabled / disableInput 阻止输入提交', async () => {
    const disabled = mountNumber({ modelValue: 2, disabled: true })
    expect(control(disabled).attributes('disabled')).toBeDefined()
    await control(disabled).setValue('5')
    await clickStep(disabled, 1)
    expect(disabled.emitted('update:modelValue')).toBeUndefined()

    const noInput = mountNumber({ modelValue: 2, disableInput: true })
    expect(control(noInput).attributes('disabled')).toBeDefined()
    await control(noInput).setValue('5')
    expect(noInput.emitted('update:modelValue')).toBeUndefined()
    await clickStep(noInput, 1)
    expect(noInput.emitted('update:modelValue')).toEqual([[3]])
  })

  test('beforeChange 拒绝时阻止提交，允许时放行', async () => {
    const rejected = mountNumber({ modelValue: 1, beforeChange: () => false })
    await clickStep(rejected, 1)
    expect(rejected.emitted('update:modelValue')).toBeUndefined()

    const allowed = mountNumber({ modelValue: 1, beforeChange: vi.fn(() => true) })
    await clickStep(allowed, 1)
    expect(allowed.emitted('update:modelValue')).toEqual([[2]])
    expect(allowed.props('beforeChange')).toHaveBeenCalledWith(2)
  })

  test('beforeChange 抛错时保持当前值', async () => {
    const wrapper = mountNumber({
      modelValue: 1,
      beforeChange: () => {
        throw new Error('blocked')
      },
    })
    await clickStep(wrapper, 1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
