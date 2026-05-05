import type { LoaderOptions } from '@amap-vue/shared'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

import { isClient, loader, warn } from '@amap-vue/shared'
import { computed, onBeforeUnmount, shallowRef, toValue, watch } from 'vue'

type AutoCompleteOptions = AMap.Autocomplete.Options
type AutoCompleteResult = AMap.Autocomplete.SearchResult

export interface UseAutoCompleteOptions extends Partial<AutoCompleteOptions> {
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}

export interface UseAutoCompleteReturn {
  autoComplete: ShallowRef<AMap.Autocomplete | null>
  search: (keyword: string) => Promise<AutoCompleteResult | null>
  setOptions: (options: Partial<AutoCompleteOptions>) => void
  setCity: (city: string) => void
  setType: (type: string) => void
  destroy: () => void
}

export function useAutoComplete(
  options: MaybeRefOrGetter<UseAutoCompleteOptions | undefined> = {},
): UseAutoCompleteReturn {
  const autoComplete = shallowRef<AMap.Autocomplete | null>(null)
  const optionsRef = computed<UseAutoCompleteOptions>(() => ({
    ...(toValue(options) as UseAutoCompleteOptions | undefined ?? {}),
  }))

  let creating = false

  async function ensureAutoComplete() {
    if (!isClient)
      return null
    if (autoComplete.value)
      return autoComplete.value
    if (creating)
      return autoComplete.value

    creating = true
    try {
      const { loadOptions: loadOptionsMaybe, ...rest } = optionsRef.value
      const loaderOptions = loadOptionsMaybe ? toValue(loadOptionsMaybe) : undefined
      const AMapInstance = await loader.load({ ...(loaderOptions ?? {}), plugins: ['AMap.AutoComplete'] })
      const AutoCompleteCtor = (AMapInstance as any).AutoComplete ?? (AMapInstance as any).Autocomplete
      const instance = new AutoCompleteCtor(rest)
      autoComplete.value = instance
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

  function applyOptions(instance: AMap.Autocomplete, next: Partial<AutoCompleteOptions>) {
    if ('city' in next && next.city != null)
      instance.setCity?.(next.city)
    if ('type' in next && next.type != null)
      (instance as any).setType?.(next.type)
    if ('citylimit' in next && next.citylimit != null) {
      const setCityLimit = (instance as any).setCityLimit ?? (instance as any).setCitylimit
      if (typeof setCityLimit === 'function')
        setCityLimit.call(instance, next.citylimit)
    }
    if ('lang' in next && next.lang != null)
      instance.setLang?.(next.lang)
    if ('datatype' in next && next.datatype != null)
      (instance as any).setDataType?.(next.datatype)

    const clone = { ...next }
    delete clone.city
    delete clone.type
    delete clone.citylimit
    delete clone.lang
    delete clone.datatype

    if (Object.keys(clone).length)
      (instance as any).setOptions?.(clone)
  }

  watch(optionsRef, (value) => {
    if (!autoComplete.value)
      return
    const { loadOptions: _loadOptions, ...rest } = value
    applyOptions(autoComplete.value, rest)
  }, { deep: true })

  onBeforeUnmount(() => {
    destroy()
  })

  async function search(keyword: string): Promise<AutoCompleteResult | null> {
    const query = keyword?.trim()
    if (!query)
      return null
    const instance = await ensureAutoComplete()
    if (!instance)
      return null
    return new Promise((resolve) => {
      instance.search(query, (status: AMap.Autocomplete.SearchStatus, result: string | AutoCompleteResult) => {
        if ((status === 'complete' || status === 'no_data') && typeof result !== 'string')
          resolve(result)
        else
          resolve(null)
      })
    })
  }

  function setOptions(options: Partial<AutoCompleteOptions>) {
    if (!options)
      return
    const instance = autoComplete.value
    if (!instance)
      return
    applyOptions(instance, options)
  }

  function setCity(city: string) {
    autoComplete.value?.setCity?.(city)
  }

  function setType(type: string) {
    (autoComplete.value as any)?.setType?.(type)
  }

  function destroy() {
    autoComplete.value = null
  }

  return {
    autoComplete,
    search,
    setOptions,
    setCity,
    setType,
    destroy,
  }
}
