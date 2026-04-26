<script setup lang="ts">
import type { usePlaygroundState } from '../../composables/usePlaygroundState'

const props = defineProps<{
  state: ReturnType<typeof usePlaygroundState>
}>()

defineEmits<{
  locate: []
}>()

const {
  activePanel,
  polylineState,
  polygonState,
  circleState,
  rectangleState,
  ellipseState,
  bezierCurveState,
} = props.state
</script>

<template>
  <div v-if="activePanel === 'polyline'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

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
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

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
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

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

  <div v-else-if="activePanel === 'rectangle'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

    <label class="toggle">
      <input v-model="rectangleState.visible" type="checkbox">
      <span>Show rectangle</span>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="rectangleState.strokeColor" type="color">
    </label>

    <label class="form-field">
      <span>Fill colour</span>
      <input v-model="rectangleState.fillColor" type="color">
    </label>

    <label class="form-field slider">
      <span>Fill opacity</span>
      <div class="slider-control">
        <input v-model.number="rectangleState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(rectangleState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'ellipse'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

    <label class="toggle">
      <input v-model="ellipseState.visible" type="checkbox">
      <span>Show ellipse</span>
    </label>

    <label class="form-field slider">
      <span>Horizontal radius</span>
      <div class="slider-control">
        <input v-model.number="ellipseState.radiusX" type="range" min="200" max="1800" step="50">
        <span>{{ ellipseState.radiusX }} m</span>
      </div>
    </label>

    <label class="form-field slider">
      <span>Vertical radius</span>
      <div class="slider-control">
        <input v-model.number="ellipseState.radiusY" type="range" min="200" max="1200" step="50">
        <span>{{ ellipseState.radiusY }} m</span>
      </div>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="ellipseState.strokeColor" type="color">
    </label>

    <label class="form-field">
      <span>Fill colour</span>
      <input v-model="ellipseState.fillColor" type="color">
    </label>

    <label class="form-field slider">
      <span>Fill opacity</span>
      <div class="slider-control">
        <input v-model.number="ellipseState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(ellipseState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'bezierCurve'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locate')">
        Locate shape
      </button>
    </div>

    <label class="toggle">
      <input v-model="bezierCurveState.visible" type="checkbox">
      <span>Show bezier curve</span>
    </label>

    <label class="form-field slider">
      <span>Stroke weight</span>
      <div class="slider-control">
        <input v-model.number="bezierCurveState.strokeWeight" type="range" min="1" max="12" step="1">
        <span>{{ bezierCurveState.strokeWeight }} px</span>
      </div>
    </label>

    <label class="form-field">
      <span>Stroke colour</span>
      <input v-model="bezierCurveState.strokeColor" type="color">
    </label>
  </div>
</template>
