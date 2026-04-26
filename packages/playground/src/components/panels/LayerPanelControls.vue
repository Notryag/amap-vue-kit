<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

defineEmits<{
  locateGeojson: []
}>()

const {
  activePanel,
  tileLayerState,
  trafficState,
  satelliteState,
  roadNetState,
  imageLayerState,
  districtLayerState,
  geoJSONLayerState,
  heatMapState,
} = props.state
</script>

<template>
  <div v-if="activePanel === 'tileLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="tileLayerState.visible" type="checkbox">
      <span>Show tile layer</span>
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="tileLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(tileLayerState.opacity * 100) }}%</span>
      </div>
    </label>

    <label class="form-field">
      <span>Tile URL template</span>
      <input v-model="tileLayerState.tileUrl" type="text" spellcheck="false">
      <small class="field-hint">Supports [x], [y], [z] placeholders.</small>
    </label>
  </div>

  <div v-else-if="activePanel === 'traffic'" class="panel-body">
    <label class="toggle">
      <input v-model="trafficState.visible" type="checkbox">
      <span>Show traffic layer</span>
    </label>

    <label class="toggle">
      <input v-model="trafficState.autoRefresh" type="checkbox">
      <span>Auto refresh</span>
    </label>

    <label class="form-field">
      <span>Refresh interval (s)</span>
      <input v-model.number="trafficState.interval" type="number" min="15" max="300" step="15">
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="trafficState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(trafficState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'satellite'" class="panel-body">
    <label class="toggle">
      <input v-model="satelliteState.visible" type="checkbox">
      <span>Show satellite imagery</span>
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="satelliteState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(satelliteState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'roadNet'" class="panel-body">
    <label class="toggle">
      <input v-model="roadNetState.visible" type="checkbox">
      <span>Show road network</span>
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="roadNetState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(roadNetState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'imageLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="imageLayerState.visible" type="checkbox">
      <span>Show image layer</span>
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="imageLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(imageLayerState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'districtLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="districtLayerState.visible" type="checkbox">
      <span>Show district layer</span>
    </label>

    <label class="form-field">
      <span>Adcode</span>
      <input v-model="districtLayerState.adcode" type="text" spellcheck="false">
      <small class="field-hint">Example: 110000 for Beijing.</small>
    </label>

    <label class="form-field slider">
      <span>Opacity</span>
      <div class="slider-control">
        <input v-model.number="districtLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(districtLayerState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'geoJSONLayer'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locateGeojson')">
        Locate GeoJSON
      </button>
    </div>

    <label class="toggle">
      <input v-model="geoJSONLayerState.visible" type="checkbox">
      <span>Show GeoJSON layer</span>
    </label>

    <label class="form-field slider">
      <span>Fill opacity</span>
      <div class="slider-control">
        <input v-model.number="geoJSONLayerState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(geoJSONLayerState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'heatMap'" class="panel-body">
    <label class="toggle">
      <input v-model="heatMapState.visible" type="checkbox">
      <span>Show heat map</span>
    </label>

    <label class="form-field slider">
      <span>Radius</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.radius" type="range" min="10" max="60" step="2">
        <span>{{ heatMapState.radius }} px</span>
      </div>
    </label>

    <label class="form-field slider">
      <span>Min opacity</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.opacityStart" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(heatMapState.opacityStart * 100) }}%</span>
      </div>
    </label>

    <label class="form-field slider">
      <span>Max opacity</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.opacityEnd" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(heatMapState.opacityEnd * 100) }}%</span>
      </div>
    </label>
  </div>
</template>
