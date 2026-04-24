<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'
import { infoWindowAnchorOptions } from '../../config/options'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

const { infoWindowState } = props.state
</script>

<template>
  <div class="panel-body">
    <label class="toggle">
      <input v-model="infoWindowState.isOpen" type="checkbox">
      <span>Info window open</span>
    </label>

    <label class="form-field">
      <span>Anchor</span>
      <select v-model="infoWindowState.anchor">
        <option v-for="option in infoWindowAnchorOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>Offset (px)</span>
      <div class="inline-inputs">
        <input v-model.number="infoWindowState.offsetX" type="number" step="1" aria-label="Info window offset X">
        <input v-model.number="infoWindowState.offsetY" type="number" step="1" aria-label="Info window offset Y">
      </div>
    </div>

    <label class="form-field">
      <span>Title</span>
      <input v-model="infoWindowState.title" type="text" placeholder="Window title">
    </label>

    <label class="form-field">
      <span>Body</span>
      <textarea v-model="infoWindowState.body" rows="3" />
    </label>
  </div>
</template>
