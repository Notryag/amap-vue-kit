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
      <span>Dataset size</span>
      <select v-model="performanceDatasetId">
        <option v-for="option in performanceDatasetOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="form-field">
      <span>Render mode</span>
      <select v-model="performanceRenderMode">
        <option v-for="option in performanceRenderModeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <div v-if="performanceRenderMode === 'chunked'" class="chunk-progress">
      <progress :value="chunkProgress" max="1" aria-label="Chunked load progress" />
      <span>{{ chunkProgressLabel }}</span>
    </div>

    <p class="dataset-description">
      {{ performanceDescription }}
    </p>

    <dl class="metrics metrics-wide">
      <div>
        <dt>Points</dt>
        <dd>{{ performanceMetrics.pointCount }}</dd>
      </div>
      <div>
        <dt>Lng span</dt>
        <dd>{{ performanceMetrics.lngSpan }}°</dd>
      </div>
      <div>
        <dt>Lat span</dt>
        <dd>{{ performanceMetrics.latSpan }}°</dd>
      </div>
      <div>
        <dt>Avg weight</dt>
        <dd>{{ performanceMetrics.averageWeight }}</dd>
      </div>
      <div>
        <dt>Median weight</dt>
        <dd>{{ performanceMetrics.medianWeight }}</dd>
      </div>
    </dl>

    <div class="dataset-sample">
      <header>
        <h3>Sample points</h3>
        <p>
          First five entries for quick inspection.
        </p>
      </header>
      <ul>
        <li
          v-for="(sample, index) in performanceSamples"
          :key="`${sample.clusterId}-${sample.lng}-${sample.lat}`"
        >
          <span class="sample-index">#{{ index + 1 }}</span>
          <code>{{ sample.lng.toFixed(6) }}, {{ sample.lat.toFixed(6) }}</code>
          <span class="sample-meta">Cluster {{ sample.clusterId + 1 }} · weight {{ sample.weight.toFixed(2) }}</span>
        </li>
      </ul>
    </div>

    <p class="dataset-hint">
      Use the selected dataset with mass markers or heat maps to measure FPS and render latency. Swap sizes to compare
      batching throughput.
    </p>
  </div>
</template>
