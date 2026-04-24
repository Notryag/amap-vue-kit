<script setup lang="ts">
import type { useAmapKey } from '../composables/useAmapKey'
import type { usePerformanceMarks } from '../composables/usePerformanceMarks'
import type { usePlaygroundState } from '../composables/usePlaygroundState'
import type { PanelDefinition } from '../types'
import ApiKeyPanel from './ApiKeyPanel.vue'
import ControlPanelControls from './panels/ControlPanelControls.vue'
import InfoWindowPanelControls from './panels/InfoWindowPanelControls.vue'
import LayerPanelControls from './panels/LayerPanelControls.vue'
import MapPanelControls from './panels/MapPanelControls.vue'
import MarkerPanelControls from './panels/MarkerPanelControls.vue'
import PerformancePanelControls from './panels/PerformancePanelControls.vue'
import ShapePanelControls from './panels/ShapePanelControls.vue'

const props = defineProps<{
  panels: readonly PanelDefinition[]
  activePanelMeta: PanelDefinition
  state: ReturnType<typeof usePlaygroundState>
  keyState: ReturnType<typeof useAmapKey>
  performance: ReturnType<typeof usePerformanceMarks>
}>()

defineEmits<{
  resetView: []
  stepZoom: [delta: number]
  nudge: [lngDelta: number, latDelta: number]
  applyRuntimeKey: []
  clearRuntimeKey: []
}>()

const { activePanel } = props.state
</script>

<template>
  <aside class="sidebar">
    <header class="header">
      <h1>AMap Vue Kit Playground</h1>
      <p>Switch between component panels to preview props, events, and runtime behaviour.</p>
    </header>

    <nav class="panel-nav" aria-label="Component panels">
      <button
        v-for="panel in panels"
        :key="panel.id"
        type="button"
        class="panel-tab"
        :class="{ active: activePanel === panel.id }"
        @click="activePanel = panel.id"
      >
        {{ panel.label }}
      </button>
    </nav>

    <section class="card">
      <header class="panel-header">
        <h2>{{ activePanelMeta.label }}</h2>
        <p>{{ activePanelMeta.description }}</p>
      </header>

      <MapPanelControls
        v-if="activePanel === 'map'"
        :state="state"
        @reset-view="$emit('resetView')"
        @step-zoom="$emit('stepZoom', $event)"
        @nudge="(lngDelta, latDelta) => $emit('nudge', lngDelta, latDelta)"
      />
      <MarkerPanelControls v-else-if="activePanel === 'marker'" :state="state" />
      <InfoWindowPanelControls v-else-if="activePanel === 'infoWindow'" :state="state" />
      <ShapePanelControls
        v-else-if="activePanel === 'polyline' || activePanel === 'polygon' || activePanel === 'circle'"
        :state="state"
      />
      <LayerPanelControls
        v-else-if="
          activePanel === 'tileLayer'
            || activePanel === 'traffic'
            || activePanel === 'satellite'
            || activePanel === 'roadNet'
        "
        :state="state"
      />
      <ControlPanelControls
        v-else-if="
          activePanel === 'toolBar'
            || activePanel === 'scale'
            || activePanel === 'controlBar'
            || activePanel === 'mapType'
        "
        :state="state"
      />
      <PerformancePanelControls v-else-if="activePanel === 'performance'" :performance="performance" />
    </section>

    <ApiKeyPanel
      :key-state="keyState"
      @apply-runtime-key="$emit('applyRuntimeKey')"
      @clear-runtime-key="$emit('clearRuntimeKey')"
    />
  </aside>
</template>
