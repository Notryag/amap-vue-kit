import type { PanelId } from '../types'
import { computed, ref } from 'vue'

type CopyStatus = 'idle' | 'copied' | 'error'

export function useSnippetCopy(options: {
  activePanel: { value: PanelId }
  activePanelLabel: { value: string }
  panelSnippet: { value: string }
  logEvent: (source: 'Clipboard', summary: string, detail?: string) => void
}) {
  const copyStatus = ref<CopyStatus>('idle')
  const copyErrorMessage = ref('')
  let copyResetHandle: ReturnType<typeof setTimeout> | undefined

  const hasSnippet = computed(() => options.panelSnippet.value.trim().length > 0)

  const copyButtonLabel = computed(() => {
    if (copyStatus.value === 'copied')
      return 'Copied!'

    if (copyStatus.value === 'error')
      return 'Retry copy'

    return 'Copy snippet'
  })

  const copyStatusMessage = computed(() => {
    if (!hasSnippet.value)
      return 'Snippet is unavailable for the current panel.'

    if (copyStatus.value === 'copied')
      return `${options.activePanelLabel.value} snippet copied to the clipboard.`

    if (copyStatus.value === 'error')
      return copyErrorMessage.value || 'Clipboard copy failed. Try copying manually.'

    return `Copy the ${options.activePanelLabel.value} panel as a ready-to-use <script setup> snippet.`
  })

  const copyButtonStateClass = computed(() => (
    copyStatus.value === 'idle' ? null : copyStatus.value
  ))

  function scheduleCopyReset(status: CopyStatus) {
    if (copyResetHandle != null) {
      clearTimeout(copyResetHandle)
      copyResetHandle = undefined
    }

    const delay = status === 'copied' ? 2400 : 4000

    copyResetHandle = setTimeout(() => {
      copyStatus.value = 'idle'
      copyErrorMessage.value = ''
      copyResetHandle = undefined
    }, delay)
  }

  async function attemptClipboardWrite(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      }
      catch {
        // fallback
      }
    }

    if (typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', 'true')
        textarea.style.position = 'fixed'
        textarea.style.top = '-1000px'
        textarea.style.opacity = '0'

        document.body.appendChild(textarea)
        textarea.select()

        const success = document.execCommand('copy')
        document.body.removeChild(textarea)

        if (success)
          return true
      }
      catch {
        // ignore
      }
    }

    return false
  }

  async function copySnippet() {
    if (!hasSnippet.value) {
      copyStatus.value = 'error'
      copyErrorMessage.value = 'No snippet available for this panel.'
      scheduleCopyReset('error')
      return
    }

    const success = await attemptClipboardWrite(options.panelSnippet.value)

    if (success) {
      copyStatus.value = 'copied'
      copyErrorMessage.value = ''
      options.logEvent('Clipboard', 'copy', `${options.activePanelLabel.value} panel snippet`)
      scheduleCopyReset('copied')
    }
    else {
      copyStatus.value = 'error'
      copyErrorMessage.value = 'Clipboard copy is not supported in this environment.'
      scheduleCopyReset('error')
    }
  }

  function cleanupSnippetCopy() {
    if (copyResetHandle != null) {
      clearTimeout(copyResetHandle)
      copyResetHandle = undefined
    }
  }

  return {
    copyStatus,
    copyErrorMessage,
    hasSnippet,
    copyButtonLabel,
    copyStatusMessage,
    copyButtonStateClass,
    copySnippet,
    cleanupSnippetCopy,
  }
}
