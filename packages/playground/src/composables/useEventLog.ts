import type { EventLogEntry } from '../types'
import { ref } from 'vue'

const EVENT_LOG_LIMIT = 12

function formatTimestamp(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function useEventLog() {
  let eventLogId = 0
  const eventLog = ref<EventLogEntry[]>([])

  function logEvent(source: EventLogEntry['source'], summary: string, detail?: string) {
    const entry: EventLogEntry = {
      id: ++eventLogId,
      time: formatTimestamp(new Date()),
      source,
      summary,
      detail,
    }

    eventLog.value.unshift(entry)

    if (eventLog.value.length > EVENT_LOG_LIMIT)
      eventLog.value.splice(EVENT_LOG_LIMIT)
  }

  return {
    eventLog,
    logEvent,
  }
}
