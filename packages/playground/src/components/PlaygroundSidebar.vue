<script setup lang="ts">
import type { useAmapKey } from '../composables/useAmapKey'
import type { usePerformanceMarks } from '../composables/usePerformanceMarks'
import type { usePlaygroundState } from '../composables/usePlaygroundState'
import type { PanelDefinition } from '../types'
import { computed } from 'vue'
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
  locateShape: []
  locateGeojson: []
  applyRuntimeKey: []
  clearRuntimeKey: []
}>()

const { activePanel } = props.state

const groupedPanels = computed(() => {
  const groups: Array<{ name: string, panels: readonly PanelDefinition[] }> = []

  props.panels.forEach((panel) => {
    const group = groups.find(item => item.name === panel.group)
    if (group) {
      group.panels = [...group.panels, panel]
      return
    }

    groups.push({ name: panel.group, panels: [panel] })
  })

  return groups
})
</script>

<template>
  <aside class="sidebar">
    <header class="header">
      <h1>AMap Vue Kit Playground</h1>
      <p>Switch between component panels to preview props, events, and runtime behaviour.</p>
    </header>

    <nav class="panel-nav" aria-label="Component panels">
      <section v-for="group in groupedPanels" :key="group.name" class="panel-nav-group">
        <h2 class="panel-nav-heading">
          {{ group.name }}
        </h2>
        <div class="panel-nav-items">
          <button
            v-for="panel in group.panels"
            :key="panel.id"
            type="button"
            class="panel-tab"
            :class="{ active: activePanel === panel.id }"
            @click="activePanel = panel.id"
          >
            {{ panel.label }}
          </button>
        </div>
      </section>
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
      <MarkerPanelControls
        v-else-if="
          activePanel === 'text'
            || activePanel === 'circleMarker'
            || activePanel === 'elasticMarker'
            || activePanel === 'labelsLayer'
            || activePanel === 'markerCluster'
        "
        :state="state"
        @locate-geojson="$emit('locateGeojson')"
      />
      <InfoWindowPanelControls v-else-if="activePanel === 'infoWindow'" :state="state" />
      <ShapePanelControls
        v-else-if="
          activePanel === 'polyline'
            || activePanel === 'polygon'
            || activePanel === 'circle'
            || activePanel === 'rectangle'
            || activePanel === 'ellipse'
            || activePanel === 'bezierCurve'
        "
        :state="state"
        @locate="$emit('locateShape')"
      />
      <LayerPanelControls
        v-else-if="
          activePanel === 'tileLayer'
            || activePanel === 'traffic'
            || activePanel === 'satellite'
            || activePanel === 'roadNet'
            || activePanel === 'imageLayer'
            || activePanel === 'districtLayer'
            || activePanel === 'geoJSONLayer'
            || activePanel === 'heatMap'
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
