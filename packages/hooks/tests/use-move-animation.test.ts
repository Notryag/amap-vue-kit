import type { MoveAnimationEvent, MoveAnimationTarget } from '../src/useMoveAnimation'
import { loader } from '@amap-vue/shared'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, shallowRef } from 'vue'
import { useMoveAnimation } from '../src/useMoveAnimation'

function createTarget() {
  const marker = new AMap.Marker()
  return Object.assign(marker, {
    moveTo: vi.fn(),
    moveAlong: vi.fn(),
    pauseMove: vi.fn(),
    resumeMove: vi.fn(),
    stopMove: vi.fn(),
    on: vi.spyOn(marker, 'on'),
    off: vi.spyOn(marker, 'off'),
  })
}

afterEach(() => vi.restoreAllMocks())

describe('useMoveAnimation', () => {
  it('loads on playback, forwards controls and unbinds events when the scope stops', async () => {
    const load = vi.spyOn(loader, 'load').mockResolvedValue(AMap)
    const marker = createTarget()
    const onMoving = vi.fn()
    const onMoveAlong = vi.fn()
    const onMoveEnd = vi.fn()
    const scope = effectScope()
    const animation = scope.run(() => useMoveAnimation(marker, { onMoving, onMoveAlong, onMoveEnd }))!
    const start: [number, number] = [116.397, 39.908]
    const end: [number, number] = [116.405, 39.912]
    const path = [
      { position: start },
      { position: end, duration: 1200 },
    ]

    expect(load).not.toHaveBeenCalled()
    await expect(animation.moveAlong(path, { autoRotation: false })).resolves.toBe(true)
    expect(load).toHaveBeenCalledExactlyOnceWith({
      plugins: ['AMap.MoveAnimation'],
    })
    expect(marker.moveAlong).toHaveBeenCalledExactlyOnceWith(path, { autoRotation: false })
    expect(marker.on.mock.calls).toEqual([
      ['moving', onMoving],
      ['movealong', onMoveAlong],
      ['moveend', onMoveEnd],
    ])
    const event: MoveAnimationEvent = {
      passedPath: [start, end],
      target: marker,
    }
    marker.on.mock.calls.forEach(([, listener]) => listener(event))
    expect(onMoving).toHaveBeenCalledExactlyOnceWith(event)
    expect(onMoveAlong).toHaveBeenCalledExactlyOnceWith(event)
    expect(onMoveEnd).toHaveBeenCalledExactlyOnceWith(event)

    animation.pause()
    animation.resume()
    expect(marker.pauseMove).toHaveBeenCalledTimes(1)
    expect(marker.resumeMove).toHaveBeenCalledTimes(1)

    scope.stop()
    expect(marker.off.mock.calls).toEqual(marker.on.mock.calls)
    expect(marker.stopMove).toHaveBeenCalledTimes(1)
    await expect(animation.moveTo(end)).resolves.toBe(false)
  })

  it('ignores stale starts after stop, marker replacement or a newer start', async () => {
    let resolvePlugin!: (sdk: typeof AMap) => void
    vi.spyOn(loader, 'load').mockReturnValue(new Promise(resolve => resolvePlugin = resolve))
    const first = createTarget()
    const next = createTarget()
    const target = shallowRef<MoveAnimationTarget>(first)
    const onMoveEnd = vi.fn()
    const animation = useMoveAnimation(target, { onMoveEnd })
    const cancelled = animation.moveTo([116, 39])
    animation.stop()
    const replaced = animation.moveTo([117, 39])
    target.value = next
    const superseded = animation.moveTo([118, 39])
    const newest = animation.moveTo([119, 39], { duration: 800 })

    resolvePlugin(AMap)
    await expect(Promise.all([
      cancelled,
      replaced,
      superseded,
      newest,
    ])).resolves.toEqual([false, false, false, true])
    expect(first.moveTo).not.toHaveBeenCalled()
    expect(next.moveTo).toHaveBeenCalledExactlyOnceWith([119, 39], { duration: 800 })
    target.value = first
    expect(next.off).toHaveBeenCalledExactlyOnceWith('moveend', onMoveEnd)
    expect(next.stopMove).toHaveBeenCalledTimes(1)
    animation.destroy()
  })

  it('returns false for invalid paths and retries after a plugin load failure', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const load = vi.spyOn(loader, 'load').mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValue(AMap)
    const marker = createTarget()
    const animation = useMoveAnimation(marker)

    await expect(animation.moveAlong([
      [116, 39],
      [Number.NaN, 39],
    ])).resolves.toBe(false)
    expect(load).not.toHaveBeenCalled()
    await expect(animation.moveTo([116, 39])).resolves.toBe(false)
    expect(warn).toHaveBeenCalledWith('[amap-vue] Unavailable')
    await expect(animation.moveTo([116, 39])).resolves.toBe(true)
    expect(marker.moveTo).toHaveBeenCalledExactlyOnceWith([116, 39], undefined)
    animation.destroy()
  })
})
