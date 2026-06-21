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
        <dt>中心点</dt>
        <dd>{{ centerText }}</dd>
      </div>
      <div>
        <dt>缩放</dt>
        <dd>{{ zoom }}</dd>
      </div>
      <div>
        <dt>俯仰</dt>
        <dd>{{ pitch }}°</dd>
      </div>
      <div>
        <dt>旋转</dt>
        <dd>{{ rotation }}°</dd>
      </div>
    </dl>

    <div class="button-row">
      <button type="button" @click="$emit('resetView')">
        重置视图
      </button>
      <button type="button" @click="$emit('stepZoom', 1)">
        放大
      </button>
      <button type="button" @click="$emit('stepZoom', -1)">
        缩小
      </button>
    </div>

    <div class="nudge-grid">
      <button type="button" @click="$emit('nudge', 0, 0.01)">
        向北移动
      </button>
      <div class="nudge-center">
        <button type="button" @click="$emit('nudge', -0.01, 0)">
          向西移动
        </button>
        <button type="button" @click="$emit('nudge', 0.01, 0)">
          向东移动
        </button>
      </div>
      <button type="button" @click="$emit('nudge', 0, -0.01)">
        向南移动
      </button>
    </div>

    <div class="form-grid">
      <label class="form-field">
        <span>视图模式</span>
        <select v-model="viewMode">
          <option v-for="option in viewModeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="form-field">
        <span>地图样式</span>
        <select v-model="mapStyle">
          <option v-for="option in mapStyleOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="form-field slider">
        <span>俯仰</span>
        <div class="slider-control">
          <input v-model.number="pitch" type="range" min="0" max="75" step="1">
          <span>{{ pitch }}°</span>
        </div>
      </label>

      <label class="form-field slider">
        <span>旋转</span>
        <div class="slider-control">
          <input v-model.number="rotation" type="range" min="0" max="360" step="1">
          <span>{{ rotation }}°</span>
        </div>
      </label>
    </div>
  </div>
</template>
