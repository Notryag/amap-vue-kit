import type { LngLatLike } from '@amap-vue/shared'
import type { MaybeRefOrGetter } from 'vue'
import { isClient, loader, warn } from '@amap-vue/shared'
import { onScopeDispose, toValue, watch } from 'vue'

export type MoveAnimationTarget = AMap.Marker | AMap.LabelMarker
export type MoveToOptions = AMap.MoveToOptions
export type MoveAlongOptions = AMap.MoveAlongOptions
export type MoveAlongPoint = AMap.MoveAlongPoint

export interface MoveAnimationEvent {
  passedPath: LngLatLike[]
  target: MoveAnimationTarget
}

export interface UseMoveAnimationOptions {
  /** Invoked while the marker is moving. */
  onMoving?: (event: MoveAnimationEvent) => void
  /** Invoked after a complete traversal of a moveAlong route. */
  onMoveAlong?: (event: MoveAnimationEvent) => void
  /** Native moveend event, also emitted during moveAlong. */
  onMoveEnd?: (event: MoveAnimationEvent) => void
}

export interface UseMoveAnimationReturn {
  /** Starts a movement after loading the plugin. Resolves false if it did not start. */
  moveTo: (position: LngLatLike, options?: MoveToOptions) => Promise<boolean>
  /** Starts a route after loading the plugin. Resolves false if it did not start. */
  moveAlong: (path: readonly LngLatLike[] | readonly MoveAlongPoint[], options?: MoveAlongOptions) => Promise<boolean>
  pause: () => void
  resume: () => void
  /** Stops playback and cancels a start waiting for the plugin. */
  stop: () => void
  /** Stops playback, removes listeners and disposes the hook. */
  destroy: () => void
}

function isValidPosition(position: LngLatLike) {
  const [lng, lat] = Array.isArray(position)
    ? position
    : [
        position.getLng(),
        position.getLat(),
      ]
  return Number.isFinite(lng) && Number.isFinite(lat)
}

/** Controls animations on an existing Marker, Text or LabelMarker. */
export function useMoveAnimation(
  target: MaybeRefOrGetter<MoveAnimationTarget | null | undefined>,
  options: UseMoveAnimationOptions = {},
): UseMoveAnimationReturn {
  const events = [
    ['moving', options.onMoving],
    ['movealong', options.onMoveAlong],
    ['moveend', options.onMoveEnd],
  ] as const
  let active: MoveAnimationTarget | undefined
  let request = 0
  let destroyed = false

  function stop() {
    request++
    const marker = active
    active = undefined
    if (!marker)
      return

    for (const [event, handler] of events) {
      if (handler)
        marker.off(event, handler)
    }
    marker.stopMove?.()
  }

  const unwatch = watch(() => toValue(target), stop, { flush: 'sync' })

  function destroy() {
    destroyed = true
    unwatch()
    stop()
  }

  onScopeDispose(destroy, true)

  async function start(play: (marker: MoveAnimationTarget) => boolean) {
    const marker = toValue(target)
    if (!isClient || destroyed || !marker)
      return false

    stop()
    const current = request
    try {
      await loader.load({
        plugins: ['AMap.MoveAnimation'],
      })
      if (current !== request)
        return false

      active = marker
      for (const [event, handler] of events) {
        if (handler)
          marker.on(event, handler)
      }
      if (play(marker))
        return true

      throw new Error('AMap.MoveAnimation is unavailable on this marker.')
    }
    catch (error) {
      if (current === request) {
        stop()
        warn(error instanceof Error
          ? error.message
          : String(error))
      }
      return false
    }
  }

  async function moveTo(position: LngLatLike, animationOptions?: MoveToOptions) {
    if (!isValidPosition(position)) {
      warn('useMoveAnimation.moveTo() requires a valid coordinate.')
      return false
    }
    return start((marker) => {
      if (!marker.moveTo)
        return false
      marker.moveTo(position, animationOptions)
      return true
    })
  }

  async function moveAlong(path: readonly LngLatLike[] | readonly MoveAlongPoint[], animationOptions?: MoveAlongOptions) {
    if (path.length < 2 || !path.every(point => isValidPosition('position' in point
      ? point.position
      : point))) {
      warn('useMoveAnimation.moveAlong() requires at least two valid coordinates.')
      return false
    }
    // Copy the array because the SDK may modify the path during playback.
    const route = path.slice()
    return start((marker) => {
      if (!marker.moveAlong)
        return false
      marker.moveAlong(route, animationOptions)
      return true
    })
  }

  return {
    moveTo,
    moveAlong,
    pause: () => active?.pauseMove?.(),
    resume: () => active?.resumeMove?.(),
    stop,
    destroy,
  }
}
