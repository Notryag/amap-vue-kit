import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import AmapAutoComplete from '../src/components/AmapAutoComplete.vue'
import AmapPlaceSearch from '../src/components/AmapPlaceSearch.vue'
import AmapWeatherPanel from '../src/components/AmapWeatherPanel.vue'

async function flushAsync() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

describe('amapAutoComplete', () => {
  it('searches tips, emits v-model updates, and selects a tip', async () => {
    const wrapper = mount(AmapAutoComplete, {
      props: {
        modelValue: '',
        debounce: 0,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('咖啡')
    await flushAsync()

    const searchEvents = wrapper.emitted('search')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('咖啡')
    expect(searchEvents?.at(-1)?.[0]).toMatchObject({ keyword: '咖啡' })
    expect(wrapper.findAll('.amap-auto-complete__item')).toHaveLength(2)

    await wrapper.find('.amap-auto-complete__item').trigger('click')
    await flushAsync()

    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ name: '咖啡中心' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('咖啡中心')
  })
})

describe('amapPlaceSearch', () => {
  it('searches POIs, emits selection, and paginates results', async () => {
    const wrapper = mount(AmapPlaceSearch, {
      props: {
        modelValue: '',
        debounce: 0,
        options: { pageSize: 2 },
      },
    })

    await wrapper.find('input').setValue('餐厅')
    await flushAsync()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('餐厅')
    expect(wrapper.findAll('.amap-place-search__item')).toHaveLength(2)
    expect(wrapper.text()).toContain('第 1 / 25 页')

    await wrapper.find('.amap-place-search__item').trigger('click')
    expect(wrapper.emitted('select')?.[0][0]).toMatchObject({ id: '餐厅-1' })

    await wrapper.findAll('button').find(button => button.text() === '下一页')!.trigger('click')
    await flushAsync()

    const vm = wrapper.vm as any
    expect(vm.pagination.pageIndex).toBe(2)
    expect(vm.pois[0].id).toBe('餐厅-3')
  })
})

describe('amapWeatherPanel', () => {
  it('loads weather, emits model updates, and refreshes selected city', async () => {
    const wrapper = mount(AmapWeatherPanel, {
      props: {
        modelValue: '北京',
        cities: ['北京', '上海'],
      },
    })

    await flushAsync()

    expect(wrapper.text()).toContain('实时天气')
    expect(wrapper.text()).toContain('北京')

    await wrapper.find('select').setValue('上海')
    await flushAsync()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('上海')
    expect(wrapper.text()).toContain('上海')

    const errorSpy = vi.fn()
    await wrapper.setProps({ onError: errorSpy })
    await (wrapper.vm as any).refresh('')
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
