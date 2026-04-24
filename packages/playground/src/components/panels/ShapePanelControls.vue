<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

const { activePanel, polylineState, polygonState, circleState } = props.state
</script>

<template>
  <div v-if="activePanel === 'polyline'" class="panel-body">
    <label class="toggle">
      <input v-model="polylineState.visible" type="checkbox">
      <span>Show polyline</span>
    </label>

    <label class="form-field slider">
      <span>Stroke weight</span>
      <div class="slider-control">
        <input v-model.number="polylineState.strokeWeight" type="range" min="1" max="12" step="1">
        <span>{{ polylineState.strokeWeight }} px</span>
      </div>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="polylineState.strokeColor" type="color">
    </label>
  </div>

  <div v-else-if="activePanel === 'polygon'" class="panel-body">
    <label class="toggle">
      <input v-model="polygonState.visible" type="checkbox">
      <span>Show polygon</span>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="polygonState.strokeColor" type="color">
    </label>

    <label class="form-field">
      <span>Fill colour</span>
      <input v-model="polygonState.fillColor" type="color">
    </label>

    <label class="form-field slider">
      <span>Fill opacity</span>
      <div class="slider-control">
        <input v-model.number="polygonState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(polygonState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'circle'" class="panel-body">
    <label class="toggle">
      <input v-model="circleState.visible" type="checkbox">
      <span>Show circle</span>
    </label>

    <label class="form-field slider">
      <span>Radius</span>
      <div class="slider-control">
        <input v-model.number="circleState.radius" type="range" min="100" max="2000" step="50">
        <span>{{ circleState.radius }} m</span>
      </div>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="circleState.strokeColor" type="color">
    </label>

    <label class="form-field">
      <span>Fill colour</span>
      <input v-model="circleState.fillColor" type="color">
    </label>

    <label class="form-field slider">
      <span>Fill opacity</span>
      <div class="slider-control">
        <input v-model.number="circleState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(circleState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>
</template>
