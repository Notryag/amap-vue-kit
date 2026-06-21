export type RenderScheduleHandle = ReturnType<typeof setTimeout> | number

export function scheduleRenderFrame(callback: () => void): RenderScheduleHandle {
  const requestFrame = globalThis.requestAnimationFrame

  if (typeof requestFrame === 'function')
    return requestFrame(() => callback())

  return globalThis.setTimeout(callback, 16)
}

export function cancelRenderFrame(handle: RenderScheduleHandle) {
  const cancelFrame = globalThis.cancelAnimationFrame

  if (typeof cancelFrame === 'function' && typeof handle === 'number')
    cancelFrame(handle)
  else
    globalThis.clearTimeout(handle)
}
