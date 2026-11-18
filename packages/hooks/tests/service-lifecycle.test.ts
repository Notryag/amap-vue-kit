import { loader } from '@amap-vue/shared'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, reactive } from 'vue'
import { useAutoComplete } from '../src/useAutoComplete'
import { useDriving } from '../src/useDriving'
import { useGeocoder } from '../src/useGeocoder'
import { useGeolocation } from '../src/useGeolocation'
import { usePlaceSearch } from '../src/usePlaceSearch'
import { useRiding } from '../src/useRiding'
import { useWalking } from '../src/useWalking'
import { useWeather } from '../src/useWeather'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

const services = [
  {
    name: 'Driving',
    create: () => {
      const api = useDriving()
      return {
        ...api,
        instance: api.driving,
        call: () => api.search([116, 39], [117, 40]),
      }
    },
  },
  {
    name: 'Walking',
    create: () => {
      const api = useWalking()
      return {
        ...api,
        instance: api.walking,
        call: () => api.search([116, 39], [117, 40]),
      }
    },
  },
  {
    name: 'Riding',
    create: () => {
      const api = useRiding()
      return {
        ...api,
        instance: api.riding,
        call: () => api.search([116, 39], [117, 40]),
      }
    },
  },
  {
    name: 'Geocoder',
    create: () => {
      const api = useGeocoder()
      return {
        ...api,
        instance: api.geocoder,
        call: () => api.getLocation('北京'),
      }
    },
  },
  {
    name: 'Weather',
    create: () => {
      const api = useWeather()
      return {
        ...api,
        instance: api.weather,
        call: () => api.getLive('北京'),
      }
    },
  },
  {
    name: 'Geolocation',
    create: () => {
      const api = useGeolocation()
      return {
        ...api,
        instance: api.geolocation,
        call: () => api.getCurrentPosition(),
      }
    },
  },
  {
    name: 'AutoComplete',
    create: () => {
      const api = useAutoComplete()
      return {
        ...api,
        instance: api.autoComplete,
        call: () => api.search('北京'),
      }
    },
  },
  {
    name: 'PlaceSearch',
    create: () => {
      const api = usePlaceSearch()
      return {
        ...api,
        instance: api.placeSearch,
        call: () => api.search('北京'),
      }
    },
  },
]

beforeEach(() => {
  class Route {
    search(...args: any[]) {
      args.at(-1)('complete', { routes: [] })
    }

    setMap() {}
    clear() {}
  }
  vi.stubGlobal('AMap', {
    ...AMap,
    Driving: Route,
    Walking: Route,
    Riding: Route,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe.each(services)('$name lifecycle', ({ create }) => {
  it('waits for the same initialization on concurrent first calls', async () => {
    const loading = deferred<typeof AMap>()
    const load = vi.spyOn(loader, 'load').mockReturnValue(loading.promise)
    const api = create()
    const first = api.call()
    const second = api.call()
    loading.resolve(AMap)
    const results = await Promise.all([first, second])
    expect(results[0]).not.toBeNull()
    expect(results[1]).not.toBeNull()
    expect(load).toHaveBeenCalledTimes(1)
    api.destroy()
  })

  it('does not create an instance after destroy during loading and can be recreated', async () => {
    const loading = deferred<typeof AMap>()
    vi.spyOn(loader, 'load').mockReturnValueOnce(loading.promise).mockResolvedValue(AMap)
    const api = create()
    const result = api.call()
    api.destroy()
    loading.resolve(AMap)
    expect(await result).toBeNull()
    expect(api.instance.value).toBeNull()
    expect(await api.call()).not.toBeNull()
    api.destroy()
  })

  it('allows retry after an initialization failure', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(loader, 'load').mockRejectedValueOnce(new Error('load failed')).mockResolvedValue(AMap)
    const api = create()
    expect(await api.call()).toBeNull()
    expect(await api.call()).not.toBeNull()
    api.destroy()
  })

  it('keeps a replacement initialization pending when an obsolete load finishes', async () => {
    const obsolete = deferred<typeof AMap>()
    const replacement = deferred<typeof AMap>()
    const load = vi.spyOn(loader, 'load')
      .mockReturnValueOnce(obsolete.promise)
      .mockReturnValueOnce(replacement.promise)
    const api = create()
    const first = api.call()
    await Promise.resolve()
    api.destroy()
    const second = api.call()
    obsolete.resolve(AMap)
    expect(await first).toBeNull()
    const third = api.call()
    replacement.resolve(AMap)
    const results = await Promise.all([second, third])
    expect(results.every(result => result !== null)).toBe(true)
    expect(load).toHaveBeenCalledTimes(2)
    api.destroy()
  })

  it('does not create an instance after the component unmounts during loading', async () => {
    const loading = deferred<typeof AMap>()
    vi.spyOn(loader, 'load').mockReturnValue(loading.promise)
    let api!: ReturnType<typeof create>
    let result!: ReturnType<typeof api.call>
    const wrapper = mount(defineComponent({
      setup() {
        api = create()
        result = api.call()
        return () => null
      },
    }))
    wrapper.unmount()
    loading.resolve(AMap)
    expect(await result).toBeNull()
    expect(api.instance.value).toBeNull()
    expect(await api.call()).toBeNull()
  })
})

it('preserves extra plugins and uses the latest service options after loading', async () => {
  const loading = deferred<typeof AMap>()
  const load = vi.spyOn(loader, 'load').mockReturnValue(loading.promise)
  const PlaceSearch = AMap.PlaceSearch
  const create = vi.spyOn(AMap, 'PlaceSearch').mockImplementation(options => new PlaceSearch(options))
  const options = reactive({
    city: '北京',
    loadOptions: {
      plugins: ['AMap.Scale'],
    },
  })
  const api = usePlaceSearch(() => options)
  const result = api.search('咖啡')
  await Promise.resolve()
  options.city = '上海'
  loading.resolve(AMap)
  expect(await result).not.toBeNull()
  expect(load).toHaveBeenCalledWith(expect.objectContaining({
    plugins: ['AMap.Scale', 'AMap.PlaceSearch'],
  }))
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ city: '上海' }))
  api.destroy()
})
