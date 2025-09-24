import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue } from 'vue'

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

  let creating = false

  async function ensureWeather() {
    if (!isClient)
      return null
    if (weather.value)
      return weather.value
    if (creating)
      return weather.value
    creating = true
    try {
      const loaderOptions = optionsRef.value.loadOptions ? toValue(optionsRef.value.loadOptions) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.Weather'] })
      const instance = new (AMapInstance as any).Weather()
      weather.value = instance
      return instance
    }
    catch (error) {
      warn(error instanceof Error ? error.message : String(error))
      return null
    }
    finally {
      creating = false
    }
  }

  onBeforeUnmount(() => {
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
    weather.value = null
  }

  return {
    weather,
    getLive,
    getForecast,
    destroy,
  }
}
