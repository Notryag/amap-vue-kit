<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'
import { markerDirectionOptions } from '../../config/options'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

const {
  activePanel,
  markerState,
  textState,
  circleMarkerState,
  elasticMarkerState,
  labelsLayerState,
  markerClusterState,
} = props.state
</script>

<template>
  <div v-if="activePanel === 'marker'" class="panel-body">
    <label class="toggle">
      <input v-model="markerState.draggable" type="checkbox">
      <span>Marker is draggable</span>
    </label>
    <label class="toggle">
      <input v-model="markerState.showLabel" type="checkbox">
      <span>Show label</span>
    </label>

    <label class="form-field">
      <span>Label text</span>
      <input v-model="markerState.labelText" type="text" placeholder="Marker label">
    </label>

    <label class="form-field">
      <span>Label direction</span>
      <select v-model="markerState.labelDirection">
        <option v-for="option in markerDirectionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="markerState.offsetX" type="number" step="1" aria-label="Marker offset X">
        <input v-model.number="markerState.offsetY" type="number" step="1" aria-label="Marker offset Y">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'text'" class="panel-body">
    <label class="toggle">
      <input v-model="textState.visible" type="checkbox">
      <span>Show text overlay</span>
    </label>

    <label class="form-field">
      <span>Text</span>
      <input v-model="textState.text" type="text" placeholder="Text overlay">
    </label>

    <label class="form-field">
      <span>Text colour</span>
      <input v-model="textState.color" type="color">
    </label>
  </div>

  <div v-else-if="activePanel === 'circleMarker'" class="panel-body">
    <label class="toggle">
      <input v-model="circleMarkerState.visible" type="checkbox">
      <span>Show circle marker</span>
    </label>

    <label class="form-field slider">
      <span>Radius</span>
      <div class="slider-control">
        <input v-model.number="circleMarkerState.radius" type="range" min="4" max="36" step="1">
        <span>{{ circleMarkerState.radius }} px</span>
      </div>
    </label>

    <label class="form-field">
      <span>Fill colour</span>
      <input v-model="circleMarkerState.fillColor" type="color">
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="circleMarkerState.strokeColor" type="color">
    </label>
  </div>

  <div v-else-if="activePanel === 'elasticMarker'" class="panel-body">
    <label class="toggle">
      <input v-model="elasticMarkerState.visible" type="checkbox">
      <span>Show elastic marker</span>
    </label>

    <p class="field-hint">
      Zoom the map to switch between the configured icon sizes.
    </p>
  </div>

  <div v-else-if="activePanel === 'labelsLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="labelsLayerState.visible" type="checkbox">
      <span>Show labels layer</span>
    </label>

    <label class="toggle">
      <input v-model="labelsLayerState.collision" type="checkbox">
      <span>Enable collision detection</span>
    </label>

    <label class="toggle">
      <input v-model="labelsLayerState.allowCollision" type="checkbox">
      <span>Allow marker overlap</span>
    </label>
  </div>

  <div v-else-if="activePanel === 'markerCluster'" class="panel-body">
    <label class="toggle">
      <input v-model="markerClusterState.visible" type="checkbox">
      <span>Show marker cluster</span>
    </label>

    <label class="form-field slider">
      <span>Grid size</span>
      <div class="slider-control">
        <input v-model.number="markerClusterState.gridSize" type="range" min="40" max="140" step="10">
        <span>{{ markerClusterState.gridSize }} px</span>
      </div>
    </label>
  </div>
</template>
