<script setup lang="ts">
import type { EventLogEntry } from '../types'

defineProps<{
  eventLog: EventLogEntry[]
  limit: number
}>()
</script>

<template>
  <aside class="event-log" aria-live="polite">
    <header class="event-log-header">
      <h2>Event log</h2>
      <span class="event-log-meta">Last {{ Math.min(eventLog.length, limit) }} events</span>
    </header>
    <p v-if="eventLog.length === 0" class="event-log-empty">
      Interact with the map or controls to see live events.
    </p>
    <ul v-else class="event-log-list">
      <li v-for="entry in eventLog" :key="entry.id" class="event-log-item">
        <span class="event-log-time">{{ entry.time }}</span>
        <div class="event-log-content">
          <strong class="event-log-source">{{ entry.source }}</strong>
          <span class="event-log-summary">{{ entry.summary }}</span>
          <span v-if="entry.detail" class="event-log-detail">{{ entry.detail }}</span>
        </div>
      </li>
    </ul>
  </aside>
</template>
