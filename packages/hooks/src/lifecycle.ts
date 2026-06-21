import { getCurrentInstance, onBeforeUnmount, onMounted } from 'vue'

export function tryOnBeforeUnmount(cleanup: () => void) {
  if (getCurrentInstance())
    onBeforeUnmount(cleanup)
}

export function tryOnMounted(callback: () => void) {
  if (getCurrentInstance())
    onMounted(callback)
}
