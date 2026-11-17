import { getCurrentInstance, onBeforeUnmount, onMounted, onUnmounted } from 'vue'

export function tryOnUnmounted(cleanup: () => void) {
  if (getCurrentInstance())
    onUnmounted(cleanup)
}

export function tryOnBeforeUnmount(cleanup: () => void) {
  if (getCurrentInstance())
    onBeforeUnmount(cleanup)
}

export function tryOnMounted(callback: () => void) {
  if (getCurrentInstance())
    onMounted(callback)
}
