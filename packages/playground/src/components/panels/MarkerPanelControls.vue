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
      <span>标记可拖拽</span>
    </label>
    <label class="toggle">
      <input v-model="markerState.showLabel" type="checkbox">
      <span>显示标签</span>
    </label>

    <label class="form-field">
      <span>标签文本</span>
      <input v-model="markerState.labelText" type="text" placeholder="标记标签">
    </label>

    <label class="form-field">
      <span>标签方向</span>
      <select v-model="markerState.labelDirection">
        <option v-for="option in markerDirectionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="markerState.offsetX" type="number" step="1" aria-label="标记 X 偏移">
        <input v-model.number="markerState.offsetY" type="number" step="1" aria-label="标记 Y 偏移">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'text'" class="panel-body">
    <label class="toggle">
      <input v-model="textState.visible" type="checkbox">
      <span>显示文本覆盖物</span>
    </label>

    <label class="form-field">
      <span>文本</span>
      <input v-model="textState.text" type="text" placeholder="文本覆盖物">
    </label>

    <label class="form-field">
      <span>文本颜色</span>
      <input v-model="textState.color" type="color">
    </label>
  </div>

  <div v-else-if="activePanel === 'circleMarker'" class="panel-body">
    <label class="toggle">
      <input v-model="circleMarkerState.visible" type="checkbox">
      <span>显示圆点标记</span>
    </label>

    <label class="form-field slider">
      <span>半径</span>
      <div class="slider-control">
        <input v-model.number="circleMarkerState.radius" type="range" min="4" max="36" step="1">
        <span>{{ circleMarkerState.radius }} px</span>
      </div>
    </label>

    <label class="form-field">
      <span>填充颜色</span>
      <input v-model="circleMarkerState.fillColor" type="color">
    </label>

    <label class="form-field">
      <span>描边颜色</span>
      <input v-model="circleMarkerState.strokeColor" type="color">
    </label>
  </div>

  <div v-else-if="activePanel === 'elasticMarker'" class="panel-body">
    <label class="toggle">
      <input v-model="elasticMarkerState.visible" type="checkbox">
      <span>显示灵活点标记</span>
    </label>

    <p class="field-hint">
      缩放地图可在配置好的图标尺寸之间切换。
    </p>
  </div>

  <div v-else-if="activePanel === 'labelsLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="labelsLayerState.visible" type="checkbox">
      <span>显示标签图层</span>
    </label>

    <label class="toggle">
      <input v-model="labelsLayerState.collision" type="checkbox">
      <span>启用碰撞检测</span>
    </label>

    <label class="toggle">
      <input v-model="labelsLayerState.allowCollision" type="checkbox">
      <span>允许标记重叠</span>
    </label>
  </div>

  <div v-else-if="activePanel === 'markerCluster'" class="panel-body">
    <label class="toggle">
      <input v-model="markerClusterState.visible" type="checkbox">
      <span>显示点聚合</span>
    </label>

    <label class="form-field slider">
      <span>网格大小</span>
      <div class="slider-control">
        <input v-model.number="markerClusterState.gridSize" type="range" min="40" max="140" step="10">
        <span>{{ markerClusterState.gridSize }} px</span>
      </div>
    </label>
  </div>
</template>
