import { createLoader } from '@amap-vue/shared'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function cleanupScripts() {
  document
    .querySelectorAll<HTMLScriptElement>('script[data-amap-loader], script[data-amap-loca]')
    .forEach(element => element.remove())
}

describe('amap loader timeouts', () => {
  let originalAMap: any

  beforeEach(() => {
    originalAMap = (window as any).AMap
    cleanupScripts()
  })

  afterEach(() => {
    (window as any).AMap = originalAMap
    cleanupScripts()
    vi.useRealTimers()
  })

  it('rejects when the JSAPI script does not load before the timeout', async () => {
    vi.useFakeTimers()
    const localLoader = createLoader()

    ;(window as any).AMap = undefined

    const promise = localLoader.load({ key: 'timeout-key', timeout: 100 })
    const assertion = expect(promise).rejects.toThrowError(/timed out/i)

    await vi.advanceTimersByTimeAsync(100)

    await assertion
  })

  it('resolves before the timeout when the script loads', async () => {
    vi.useFakeTimers()
    const localLoader = createLoader()

    ;(window as any).AMap = undefined

    const promise = localLoader.load({ key: 'timeout-key', timeout: 100 })

    const script = document.querySelector<HTMLScriptElement>('script[data-amap-loader="true"]')
    if (!script)
      throw new Error('Loader did not append the JSAPI script tag')

    const fakeAMap = { Map: class {} } as any
    ;(window as any).AMap = fakeAMap

    script.dispatchEvent(new window.Event('load'))

    await expect(promise).resolves.toBe(fakeAMap)
    expect(vi.getTimerCount()).toBe(0)

    script.remove()
  })
})
