import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { AmapHawkEye, AmapMap } from '../src'

describe('amapHawkEye', () => {
  it('emits ready, updates props and removes its control on unmount', async () => {
    const wrapper = mount({
      components: { AmapMap, AmapHawkEye },
      data: () => ({ visible: true, isOpen: true, width: '160px' }),
      template: '<AmapMap><AmapHawkEye :visible="visible" :is-open="isOpen" :width="width" /></AmapMap>',
    })
    await flushPromises()
    await flushPromises()
    const child = wrapper.findComponent(AmapHawkEye)
    const first = (child.vm as any).control
    expect(child.emitted('ready')?.[0]).toEqual([first])
    expect(first.isOpen).toBe(true)
    wrapper.vm.isOpen = false
    wrapper.vm.visible = false
    await flushPromises()
    expect((child.vm as any).control).toBe(first)
    expect(first.isOpen).toBe(false)
    expect(first.visible).toBe(false)
    wrapper.vm.width = '220px'
    await flushPromises()
    const second = (child.vm as any).control
    expect(second).not.toBe(first)
    expect(first.map).toBeNull()
    expect(second.options.width).toBe('220px')
    wrapper.unmount()
    expect(second.map).toBeNull()
  })
})
