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
      <span>显示工具条</span>
    </label>

    <label class="form-field">
      <span>位置</span>
      <select v-model="toolBarState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="toolBarState.offsetX" type="number" step="1" aria-label="工具条 X 偏移">
        <input v-model.number="toolBarState.offsetY" type="number" step="1" aria-label="工具条 Y 偏移">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'scale'" class="panel-body">
    <label class="toggle">
      <input v-model="scaleState.visible" type="checkbox">
      <span>显示比例尺</span>
    </label>

    <label class="form-field">
      <span>位置</span>
      <select v-model="scaleState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="scaleState.offsetX" type="number" step="1" aria-label="比例尺 X 偏移">
        <input v-model.number="scaleState.offsetY" type="number" step="1" aria-label="比例尺 Y 偏移">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'controlBar'" class="panel-body">
    <label class="toggle">
      <input v-model="controlBarState.visible" type="checkbox">
      <span>显示控制条</span>
    </label>

    <label class="toggle">
      <input v-model="controlBarState.showZoomBar" type="checkbox">
      <span>显示缩放条</span>
    </label>

    <label class="toggle">
      <input v-model="controlBarState.showControlButton" type="checkbox">
      <span>显示俯仰按钮</span>
    </label>

    <label class="form-field">
      <span>位置</span>
      <select v-model="controlBarState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="controlBarState.offsetX" type="number" step="1" aria-label="控制条 X 偏移">
        <input v-model.number="controlBarState.offsetY" type="number" step="1" aria-label="控制条 Y 偏移">
      </div>
    </div>
  </div>

  <div v-else-if="activePanel === 'mapType'" class="panel-body">
    <label class="toggle">
      <input v-model="mapTypeState.visible" type="checkbox">
      <span>显示图层切换控件</span>
    </label>

    <label class="form-field">
      <span>默认类型</span>
      <select v-model.number="mapTypeState.defaultType">
        <option v-for="option in mapTypeDefaultOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="toggle">
      <input v-model="mapTypeState.showTraffic" type="checkbox">
      <span>允许切换路况</span>
    </label>

    <label class="toggle">
      <input v-model="mapTypeState.showRoad" type="checkbox">
      <span>允许切换路网</span>
    </label>

    <label class="form-field">
      <span>位置</span>
      <select v-model="mapTypeState.position">
        <option v-for="option in controlPositionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="mapTypeState.offsetX" type="number" step="1" aria-label="图层切换控件 X 偏移">
        <input v-model.number="mapTypeState.offsetY" type="number" step="1" aria-label="图层切换控件 Y 偏移">
      </div>
    </div>
  </div>
</template>
