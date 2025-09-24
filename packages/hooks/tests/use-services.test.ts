import { describe, expect, it, vi } from 'vitest'

import { useGeocoder } from '../src/useGeocoder'
import { useGeolocation } from '../src/useGeolocation'
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
})
