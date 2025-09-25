import { describe, expect, it, vi } from 'vitest'

import { useAutoComplete } from '../src/useAutoComplete'
import { useGeocoder } from '../src/useGeocoder'
import { useGeolocation } from '../src/useGeolocation'
import { usePlaceSearch } from '../src/usePlaceSearch'
import { useWeather } from '../src/useWeather'

describe('service hooks', () => {
  it('geocoder resolves location and address', async () => {
    const geocoder = useGeocoder()
    const locationResult = await geocoder.getLocation('天安门')
    expect(locationResult?.geocodes?.[0]?.formattedAddress).toContain('天安门')

    const addressResult = await geocoder.getAddress([116.39, 39.9])
    expect(addressResult?.regeocode?.formattedAddress).toContain('地址')
  })

  it('geolocation provides current position and watcher', async () => {
    const geolocation = useGeolocation()
    const position = await geolocation.getCurrentPosition()
    expect(position?.position).toBeInstanceOf(AMap.LngLat)

    const handler = vi.fn()
    const watchId = await geolocation.watchPosition(result => handler(result))
    expect(typeof watchId === 'number').toBe(true)
    expect(handler).toHaveBeenCalled()

    geolocation.clearWatch(watchId ?? undefined)
    geolocation.destroy()
  })

  it('weather service returns live and forecast data', async () => {
    const weather = useWeather()
    const live = await weather.getLive('北京')
    expect(live?.weather).toBeDefined()

    const forecast = await weather.getForecast('北京')
    expect(forecast?.forecasts?.length).toBeGreaterThan(0)
  })

  it('auto complete returns suggestions for keywords', async () => {
    const autoComplete = useAutoComplete()
    const result = await autoComplete.search('咖啡')
    expect(result?.tips?.length).toBeGreaterThan(0)
    autoComplete.setCity('北京')
    autoComplete.setType('餐饮服务')
    autoComplete.destroy()
  })

  it('place search paginates results', async () => {
    const placeSearch = usePlaceSearch({ pageSize: 5 })
    const first = await placeSearch.search('美食')
    expect(first?.poiList?.pois.length).toBe(5)
    placeSearch.setPageIndex(2)
    const second = await placeSearch.search('美食')
    expect(second?.poiList?.pageIndex).toBe(2)
    const details = await placeSearch.getDetails('美食-1')
    expect(details?.poiList?.pois[0]?.name).toContain('详情')
    placeSearch.destroy()
  })
})
