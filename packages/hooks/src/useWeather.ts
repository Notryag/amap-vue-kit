import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { computed, shallowRef, toValue } from 'vue'
import { tryOnBeforeUnmount } from './lifecycle'
import { useServiceInstance } from './service-instance'

export interface UseWeatherOptions {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseWeatherReturn {
  weather: ShallowRef<AMap.Weather | null>
  getLive: (city: string) => Promise<AMap.WeatherLiveResult | null>
  getForecast: (city: string) => Promise<AMap.WeatherForecastResult | null>
  destroy: () => void
}

export function useWeather(options: MaybeRefOrGetter<UseWeatherOptions | undefined> = {}): UseWeatherReturn {
  const weather = shallowRef<AMap.Weather | null>(null)
  const optionsRef = computed<UseWeatherOptions>(() => ({
    ...(toValue(options) as UseWeatherOptions | undefined ?? {}),
  }))

  const { ensure: ensureWeather, invalidate } = useServiceInstance(
    weather,
    'AMap.Weather',
    () => optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined,
    (AMapInstance) => {
      return new AMapInstance.Weather()
    },
  )

  tryOnBeforeUnmount(() => {
    destroy()
  })

  async function getLive(city: string): Promise<AMap.WeatherLiveResult | null> {
    const instance = await ensureWeather()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getLive(city, (status: string, result: AMap.WeatherLiveResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  async function getForecast(city: string): Promise<AMap.WeatherForecastResult | null> {
    const instance = await ensureWeather()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.getForecast(city, (status: string, result: AMap.WeatherForecastResult) => {
        if (status === 'complete')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function destroy() {
    invalidate()
    weather.value = null
  }

  return {
    weather,
    getLive,
    getForecast,
    destroy,
  }
}
