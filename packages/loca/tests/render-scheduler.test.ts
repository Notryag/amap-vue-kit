import { afterEach, describe, expect, it, vi } from 'vitest'
import { cancelRenderFrame, scheduleRenderFrame } from '../src/render-scheduler'

const originalRequestAnimationFrame = globalThis.requestAnimationFrame
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame

afterEach(() => {
  globalThis.requestAnimationFrame = originalRequestAnimationFrame
  globalThis.cancelAnimationFrame = originalCancelAnimationFrame
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('render scheduler', () => {
  it('falls back to global timers when animation frames are unavailable', () => {
    vi.useFakeTimers()
    globalThis.requestAnimationFrame = undefined as any
    globalThis.cancelAnimationFrame = undefined as any

    const callback = vi.fn()

    scheduleRenderFrame(callback)
    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(16)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('cancels scheduled timer fallback renders', () => {
    vi.useFakeTimers()
    globalThis.requestAnimationFrame = undefined as any
    globalThis.cancelAnimationFrame = undefined as any

    const callback = vi.fn()
    const handle = scheduleRenderFrame(callback)

    cancelRenderFrame(handle)
    vi.advanceTimersByTime(16)

    expect(callback).not.toHaveBeenCalled()
  })
})
