import type { ShallowRef } from 'vue'

interface OverlayActionsTarget<TOptions> {
  setOptions: (options: TOptions | { extData: any }) => void
  setExtData?: (data: any) => void
  show: () => void
  hide: () => void
}

/** Common imperative actions; geometry conversion stays in each shape hook. */
export function createOverlayActions<TOptions extends Record<string, any>>(
  overlay: ShallowRef<OverlayActionsTarget<TOptions> | null>,
) {
  return {
    setOptions(options: TOptions) {
      overlay.value?.setOptions(options)
    },
    setExtData(extData: any) {
      const instance = overlay.value
      if (typeof instance?.setExtData === 'function')
        instance.setExtData(extData)
      else
        instance?.setOptions({ extData })
    },
    show() {
      overlay.value?.show()
    },
    hide() {
      overlay.value?.hide()
    },
  }
}
