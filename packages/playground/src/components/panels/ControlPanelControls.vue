<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'
import { controlPositionOptions, mapTypeDefaultOptions } from '../../config/options'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

const { activePanel, toolBarState, scaleState, controlBarState, mapTypeState } = props.state
</script>

<template>
  <div v-if="activePanel === 'toolBar'" class="panel-body">
    <label class="toggle">
      <input v-model="toolBarState.visible" type="checkbox">
      <span>Show tool bar</span>
    </label>

    <label class="form-field">
      <span>Position</span>
      <select v-model="toolBarState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="toolBarState.offsetX" type="number" step="1" aria-label="Tool bar offset X">
        <input v-model.number="toolBarState.offsetY" type="number" step="1" aria-label="Tool bar offset Y">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'scale'" class="panel-body">
    <label class="toggle">
      <input v-model="scaleState.visible" type="checkbox">
      <span>Show scale</span>
    </label>

    <label class="form-field">
      <span>Position</span>
      <select v-model="scaleState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="scaleState.offsetX" type="number" step="1" aria-label="Scale offset X">
        <input v-model.number="scaleState.offsetY" type="number" step="1" aria-label="Scale offset Y">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'controlBar'" class="panel-body">
    <label class="toggle">
      <input v-model="controlBarState.visible" type="checkbox">
      <span>Show control bar</span>
    </label>

    <label class="toggle">
      <input v-model="controlBarState.showZoomBar" type="checkbox">
      <span>Show zoom bar</span>
    </label>

    <label class="toggle">
      <input v-model="controlBarState.showControlButton" type="checkbox">
      <span>Show tilt button</span>
    </label>

    <label class="form-field">
      <span>Position</span>
      <select v-model="controlBarState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="controlBarState.offsetX" type="number" step="1" aria-label="Control bar offset X">
        <input v-model.number="controlBarState.offsetY" type="number" step="1" aria-label="Control bar offset Y">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'mapType'" class="panel-body">
    <label class="toggle">
      <input v-model="mapTypeState.visible" type="checkbox">
      <span>Show map type control</span>
    </label>

    <label class="form-field">
      <span>Default type</span>
      <select v-model.number="mapTypeState.defaultType">
        <option v-for="option in mapTypeDefaultOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="toggle">
      <input v-model="mapTypeState.showTraffic" type="checkbox">
      <span>Allow traffic toggle</span>
    </label>

    <label class="toggle">
      <input v-model="mapTypeState.showRoad" type="checkbox">
      <span>Allow road net toggle</span>
    </label>

    <label class="form-field">
      <span>Position</span>
      <select v-model="mapTypeState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="mapTypeState.offsetX" type="number" step="1" aria-label="Map type offset X">
        <input v-model.number="mapTypeState.offsetY" type="number" step="1" aria-label="Map type offset Y">
      </div>
    </div>
  </div>
</template>
