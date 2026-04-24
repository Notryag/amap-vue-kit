<script setup lang="ts">
import type { useMapInspector } from '../composables/useMapInspector'
import type { usePerformanceMarks } from '../composables/usePerformanceMarks'
import type { usePlaygroundState } from '../composables/usePlaygroundState'
import type { useSnippetCopy } from '../composables/useSnippetCopy'
import type { EventLogEntry, LngLatTuple } from '../types'
import EventLogPanel from './EventLogPanel.vue'
import MapCanvas from './MapCanvas.vue'
import MapInspectorPanel from './MapInspectorPanel.vue'

defineProps<{
  state: ReturnType<typeof usePlaygroundState>
  inspector: ReturnType<typeof useMapInspector>
  performance: ReturnType<typeof usePerformanceMarks>
  snippetCopy: ReturnType<typeof useSnippetCopy>
  eventLog: EventLogEntry[]
  eventLogLimit: number
  hasKey: boolean
  showPerformanceMassMarks: boolean
  polylinePath: LngLatTuple[]
  polygonPath: LngLatTuple[]
}>()

defineEmits<{
  mapReady: [map: AMap.Map]
  mapClick: [event: any]
  mapMoveend: [event: any]
  markerClick: []
  markerDragend: [event: any]
  infoWindowOpen: []
  infoWindowClose: []
}>()
</script>

<template>
  <section class="map-container">
    <div class="map-toolbar">
      <MapInspectorPanel
        :inspector="inspector"
        :center-text="state.centerText"
        :zoom="state.zoom"
      />
      <button
        type="button"
        class="copy-button"
        :class="snippetCopy.copyButtonStateClass.value"
        :disabled="!snippetCopy.hasSnippet.value"
        :title="snippetCopy.copyStatusMessage.value"
        @click="snippetCopy.copySnippet"
      >
        {{ snippetCopy.copyButtonLabel.value }}
      </button>
      <p class="copy-feedback" aria-live="polite">
        {{ snippetCopy.copyStatusMessage.value }}
      </p>
    </div>

    <MapCanvas
      :state="state"
      :performance="performance"
      :has-key="hasKey"
      :show-performance-mass-marks="showPerformanceMassMarks"
      :polyline-path="polylinePath"
      :polygon-path="polygonPath"
      @ready="$emit('mapReady', $event)"
      @click="$emit('mapClick', $event)"
      @moveend="$emit('mapMoveend', $event)"
      @marker-click="$emit('markerClick')"
      @marker-dragend="$emit('markerDragend', $event)"
      @info-window-open="$emit('infoWindowOpen')"
      @info-window-close="$emit('infoWindowClose')"
    />

    <EventLogPanel :event-log="eventLog" :limit="eventLogLimit" />
  </section>
</template>
