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
      <span>信息窗体打开</span>
    </label>

    <label class="form-field">
      <span>锚点</span>
      <select v-model="infoWindowState.anchor">
        <option v-for="option in infoWindowAnchorOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div class="form-field inline">
      <span>偏移（px）</span>
      <div class="inline-inputs">
        <input v-model.number="infoWindowState.offsetX" type="number" step="1" aria-label="信息窗体 X 偏移">
        <input v-model.number="infoWindowState.offsetY" type="number" step="1" aria-label="信息窗体 Y 偏移">
      </div>
    </div>

    <label class="form-field">
      <span>标题</span>
      <input v-model="infoWindowState.title" type="text" placeholder="窗体标题">
    </label>

    <label class="form-field">
      <span>正文</span>
      <textarea v-model="infoWindowState.body" rows="3" />
    </label>
  </div>
</template>
