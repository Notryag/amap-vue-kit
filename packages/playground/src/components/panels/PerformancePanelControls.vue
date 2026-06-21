<script setup lang="ts">
import type { usePerformanceMarks } from '../../composables/usePerformanceMarks'
import { performanceRenderModeOptions } from '../../config/options'

const props = defineProps<{
  performance: ReturnType<typeof usePerformanceMarks>
}>()

const {
  performanceDatasetId,
  performanceRenderMode,
  performanceDatasetOptions,
  performanceMetrics,
  performanceSamples,
  performanceDescription,
  chunkProgress,
  chunkProgressLabel,
} = props.performance
</script>

<template>
  <div class="panel-body">
    <label class="form-field">
      <span>数据集大小</span>
      <select v-model="performanceDatasetId">
        <option v-for="option in performanceDatasetOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="form-field">
      <span>渲染模式</span>
      <select v-model="performanceRenderMode">
        <option v-for="option in performanceRenderModeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div v-if="performanceRenderMode === 'chunked'" class="chunk-progress">
      <progress :value="chunkProgress" max="1" aria-label="分块加载进度" />
      <span>{{ chunkProgressLabel }}</span>
    </div>

    <p class="dataset-description">
      {{ performanceDescription }}
    </p>

    <dl class="metrics metrics-wide">
      <div>
        <dt>点数</dt>
        <dd>{{ performanceMetrics.pointCount }}</dd>
      </div>
      <div>
        <dt>经度跨度</dt>
        <dd>{{ performanceMetrics.lngSpan }}°</dd>
      </div>
      <div>
        <dt>纬度跨度</dt>
        <dd>{{ performanceMetrics.latSpan }}°</dd>
      </div>
      <div>
        <dt>平均权重</dt>
        <dd>{{ performanceMetrics.averageWeight }}</dd>
      </div>
      <div>
        <dt>权重中位数</dt>
        <dd>{{ performanceMetrics.medianWeight }}</dd>
      </div>
    </dl>

    <div class="dataset-sample">
      <header>
        <h3>样本点</h3>
        <p>
          前五条数据用于快速检查。
        </p>
      </header>
      <ul>
        <li
          v-for="(sample, index) in performanceSamples"
          :key="`${sample.clusterId}-${sample.lng}-${sample.lat}`"
        >
          <span class="sample-index">#{{ index + 1 }}</span>
          <code>{{ sample.lng.toFixed(6) }}, {{ sample.lat.toFixed(6) }}</code>
          <span class="sample-meta">簇 {{ sample.clusterId + 1 }} · 权重 {{ sample.weight.toFixed(2) }}</span>
        </li>
      </ul>
    </div>

    <p class="dataset-hint">
      将所选数据集用于海量点或热力图，可测量 FPS 与渲染延迟。切换规模可比较批处理吞吐量。
    </p>
  </div>
</template>
