<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'
import { mapStyleOptions, viewModeOptions } from '../../config/options'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

defineEmits<{
  resetView: []
  stepZoom: [delta: number]
  nudge: [lngDelta: number, latDelta: number]
}>()

const { centerText, zoom, pitch, rotation, viewMode, mapStyle } = props.state
</script>

<template>
  <div class="panel-body">
    <dl class="metrics">
      <div>
        <dt>Center</dt>
        <dd>{{ centerText }}</dd>
      </div>
      <div>
        <dt>Zoom</dt>
        <dd>{{ zoom }}</dd>
      </div>
      <div>
        <dt>Pitch</dt>
        <dd>{{ pitch }}°</dd>
      </div>
      <div>
        <dt>Rotation</dt>
        <dd>{{ rotation }}°</dd>
      </div>
    </dl>

    <div class="button-row">
      <button type="button" @click="$emit('resetView')">
        Reset view
      </button>
      <button type="button" @click="$emit('stepZoom', 1)">
        Zoom in
      </button>
      <button type="button" @click="$emit('stepZoom', -1)">
        Zoom out
      </button>
    </div>

    <div class="nudge-grid">
      <button type="button" @click="$emit('nudge', 0, 0.01)">
        Move north
      </button>
      <div class="nudge-center">
        <button type="button" @click="$emit('nudge', -0.01, 0)">
          Move west
        </button>
        <button type="button" @click="$emit('nudge', 0.01, 0)">
          Move east
        </button>
      </div>
      <button type="button" @click="$emit('nudge', 0, -0.01)">
        Move south
      </button>
    </div>

    <div class="form-grid">
      <label class="form-field">
        <span>View mode</span>
        <select v-model="viewMode">
          <option v-for="option in viewModeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="form-field">
        <span>Map style</span>
        <select v-model="mapStyle">
          <option v-for="option in mapStyleOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="form-field slider">
        <span>Pitch</span>
        <div class="slider-control">
          <input v-model.number="pitch" type="range" min="0" max="75" step="1">
          <span>{{ pitch }}°</span>
        </div>
      </label>

      <label class="form-field slider">
        <span>Rotation</span>
        <div class="slider-control">
          <input v-model.number="rotation" type="range" min="0" max="360" step="1">
          <span>{{ rotation }}°</span>
        </div>
      </label>
    </div>
  </div>
</template>
