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
      <span>显示瓦片图层</span>
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="tileLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(tileLayerState.opacity * 100) }}%</span>
      </div>
    </label>

    <label class="form-field">
      <span>瓦片 URL 模板</span>
      <input v-model="tileLayerState.tileUrl" type="text" spellcheck="false">
      <small class="field-hint">支持 [x]、[y]、[z] 占位符。</small>
    </label>
  </div>

  <div v-else-if="activePanel === 'traffic'" class="panel-body">
    <label class="toggle">
      <input v-model="trafficState.visible" type="checkbox">
      <span>显示实时路况图层</span>
    </label>

    <label class="toggle">
      <input v-model="trafficState.autoRefresh" type="checkbox">
      <span>自动刷新</span>
    </label>

    <label class="form-field">
      <span>刷新间隔（秒）</span>
      <input v-model.number="trafficState.interval" type="number" min="15" max="300" step="15">
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="trafficState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(trafficState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'satellite'" class="panel-body">
    <label class="toggle">
      <input v-model="satelliteState.visible" type="checkbox">
      <span>显示卫星影像</span>
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="satelliteState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(satelliteState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'roadNet'" class="panel-body">
    <label class="toggle">
      <input v-model="roadNetState.visible" type="checkbox">
      <span>显示路网</span>
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="roadNetState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(roadNetState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'imageLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="imageLayerState.visible" type="checkbox">
      <span>显示图片图层</span>
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="imageLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(imageLayerState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'districtLayer'" class="panel-body">
    <label class="toggle">
      <input v-model="districtLayerState.visible" type="checkbox">
      <span>显示行政区图层</span>
    </label>

    <label class="form-field">
      <span>Adcode</span>
      <input v-model="districtLayerState.adcode" type="text" spellcheck="false">
      <small class="field-hint">示例：北京为 110000。</small>
    </label>

    <label class="form-field slider">
      <span>透明度</span>
      <div class="slider-control">
        <input v-model.number="districtLayerState.opacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(districtLayerState.opacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'geoJSONLayer'" class="panel-body">
    <div class="button-row">
      <button type="button" @click="$emit('locateGeojson')">
        定位 GeoJSON
      </button>
    </div>

    <label class="toggle">
      <input v-model="geoJSONLayerState.visible" type="checkbox">
      <span>显示 GeoJSON 图层</span>
    </label>

    <label class="form-field slider">
      <span>填充透明度</span>
      <div class="slider-control">
        <input v-model.number="geoJSONLayerState.fillOpacity" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(geoJSONLayerState.fillOpacity * 100) }}%</span>
      </div>
    </label>
  </div>

  <div v-else-if="activePanel === 'heatMap'" class="panel-body">
    <label class="toggle">
      <input v-model="heatMapState.visible" type="checkbox">
      <span>显示热力图</span>
    </label>

    <label class="form-field slider">
      <span>半径</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.radius" type="range" min="10" max="60" step="2">
        <span>{{ heatMapState.radius }} px</span>
      </div>
    </label>

    <label class="form-field slider">
      <span>最小透明度</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.opacityStart" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(heatMapState.opacityStart * 100) }}%</span>
      </div>
    </label>

    <label class="form-field slider">
      <span>最大透明度</span>
      <div class="slider-control">
        <input v-model.number="heatMapState.opacityEnd" type="range" min="0" max="1" step="0.05">
        <span>{{ Math.round(heatMapState.opacityEnd * 100) }}%</span>
      </div>
    </label>
  </div>
</template>
