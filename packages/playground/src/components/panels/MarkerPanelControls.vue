<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'
import { markerDirectionOptions } from '../../config/options'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

const { markerState } = props.state
</script>

<template>
  <div class="panel-body">
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
</template>
