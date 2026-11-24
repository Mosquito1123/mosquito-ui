import { mount } from '@vue/test-utils'
import { afterEach, describe, test, expect } from 'vitest'
import MqRootPortal from '@/components/mq-root-portal/MqRootPortal.vue'

const slot = '<text class="portal-content">内容</text>'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('MqRootPortal', () => {
  test('teleports content to body by default', () => {
    const wrapper = mount(MqRootPortal, { slots: { default: slot } })
    expect(document.body.querySelector('.portal-content')).not.toBeNull()
    expect(wrapper.find('.mq-root-portal').exists()).toBe(false)
  })

  test('exposes default props', () => {
    const wrapper = mount(MqRootPortal, { props: { disabled: true }, slots: { default: slot } })
    expect(wrapper.props('to')).toBe('body')
    expect(wrapper.props('disabled')).toBe(true)
  })

  test('disabled renders in place', () => {
    const wrapper = mount(MqRootPortal, {
      props: { disabled: true },
      slots: { default: slot },
    })
    expect(wrapper.find('.mq-root-portal').exists()).toBe(true)
    expect(wrapper.find('.portal-content').exists()).toBe(true)
    expect(document.body.querySelector('.portal-content')).toBeNull()
  })

  test('supports a custom target selector', () => {
    const host = document.createElement('div')
    host.id = 'portal-host'
    document.body.appendChild(host)
    const wrapper = mount(MqRootPortal, {
      props: { to: '#portal-host' },
      slots: { default: slot },
    })
    expect(host.querySelector('.portal-content')).not.toBeNull()
    expect(wrapper.find('.mq-root-portal').exists()).toBe(false)
  })

  test('falls back in place when the target does not exist', () => {
    const wrapper = mount(MqRootPortal, {
      props: { to: '#missing-target' },
      slots: { default: slot },
    })
    expect(wrapper.find('.mq-root-portal').exists()).toBe(true)
    expect(wrapper.find('.portal-content').exists()).toBe(true)
  })

  test('falls back in place without throwing for an invalid selector', () => {
    const wrapper = mount(MqRootPortal, {
      props: { to: '@@@' },
      slots: { default: slot },
    })
    expect(wrapper.find('.mq-root-portal').exists()).toBe(true)
    expect(wrapper.text()).toContain('内容')
  })

  test('empty to falls back to body', () => {
    mount(MqRootPortal, { props: { to: '' }, slots: { default: slot } })
    expect(document.body.querySelector('.portal-content')).not.toBeNull()
  })
})
