import type { PerformanceDatasetId, PlaygroundMassData } from '../data/performance-datasets'
import type { PerformanceRenderMode } from '../types'
import { computed, ref, shallowRef, watch } from 'vue'
import { performanceDatasets } from '../data/performance-datasets'

const MASS_CHUNK_SIZE = 800

export function usePerformanceMarks(logEvent: (source: 'Dataset', summary: string, detail?: string) => void) {
  const performanceDatasetId = ref<PerformanceDatasetId>('small')
  const performanceRenderMode = ref<PerformanceRenderMode>('immediate')

  const performanceDatasetOptions = performanceDatasets.map(dataset => ({
    label: dataset.label,
    value: dataset.id,
  }))

  const performanceDataset = computed(() =>
    performanceDatasets.find(dataset => dataset.id === performanceDatasetId.value) ?? performanceDatasets[0],
  )

  const performanceMetrics = computed(() => {
    const dataset = performanceDataset.value
    const { bounds, averages, medianWeight } = dataset.summary

    return {
      pointCount: dataset.size.toLocaleString(),
      lngSpan: (bounds.maxLng - bounds.minLng).toFixed(3),
      latSpan: (bounds.maxLat - bounds.minLat).toFixed(3),
      averageWeight: averages.weight.toFixed(2),
      medianWeight: medianWeight.toFixed(2),
    }
  })

  const performanceSamples = computed(() => performanceDataset.value.samples)
  const performanceMassData = computed(() => performanceDataset.value.mass)
  const performanceDescription = computed(() => performanceDataset.value.description)

  const performanceMassRenderData = shallowRef<PlaygroundMassData[]>(performanceMassData.value)
  const massMarkerStyles = ref<AMap.MassMarkersStyleOptions[]>([])

  let massRenderFrame: number | null = null

  function cancelMassRenderTask() {
    if (massRenderFrame != null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(massRenderFrame)
      massRenderFrame = null
    }
  }

  function hydratePerformanceData() {
    cancelMassRenderTask()

    const data = performanceMassData.value

    if (
      performanceRenderMode.value !== 'chunked'
      || typeof window === 'undefined'
      || data.length <= MASS_CHUNK_SIZE
    ) {
      performanceMassRenderData.value = data
      return
    }

    performanceMassRenderData.value = []

    if (data.length === 0)
      return

    let index = 0

    const step = () => {
      index = Math.min(index + MASS_CHUNK_SIZE, data.length)
      performanceMassRenderData.value = data.slice(0, index)

      if (index < data.length)
        massRenderFrame = window.requestAnimationFrame(step)
      else
        massRenderFrame = null
    }

    massRenderFrame = window.requestAnimationFrame(step)
  }

  const chunkProgress = computed(() => {
    const total = performanceMassData.value.length
    if (total === 0)
      return 1

    return Math.min(1, performanceMassRenderData.value.length / total)
  })

  const chunkProgressLabel = computed(() => {
    const total = performanceMassData.value.length

    if (total === 0)
      return '0 points loaded'

    const loaded = performanceMassRenderData.value.length
    const percentage = Math.round(chunkProgress.value * 100)

    return `${percentage}% · ${loaded.toLocaleString()} / ${total.toLocaleString()} points`
  })

  function createMassStyle(amap: typeof AMap, color: string): AMap.MassMarkersStyleOptions {
    const size = new amap.Size(10, 10)
    const anchor = new amap.Pixel(5, 5)

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="${color}" fill-opacity="0.9"/><circle cx="6" cy="6" r="2.5" fill="#ffffff" fill-opacity="0.55"/></svg>`

    return {
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      size,
      anchor,
      rotation: 0,
    }
  }

  function ensureMassMarkerStyles() {
    if (massMarkerStyles.value.length > 0 || typeof window === 'undefined')
      return

    const AMapGlobal = (window as typeof window & { AMap?: typeof AMap }).AMap

    if (!AMapGlobal)
      return

    massMarkerStyles.value = [
      createMassStyle(AMapGlobal, '#2563eb'),
      createMassStyle(AMapGlobal, '#f97316'),
      createMassStyle(AMapGlobal, '#16a34a'),
    ]
  }

  watch(performanceDatasetId, (datasetId) => {
    const dataset = performanceDatasets.find(item => item.id === datasetId)

    if (dataset)
      logEvent('Dataset', 'switch', `${dataset.label} · ${dataset.size.toLocaleString()} points`)
  })

  watch([performanceMassData, performanceRenderMode], () => {
    hydratePerformanceData()
  }, { immediate: true })

  watch(performanceRenderMode, (mode, previous) => {
    if (!previous || mode === previous)
      return

    const summary = mode === 'chunked'
      ? 'Chunked updates · progressive hydration'
      : 'Immediate updates · single batch'

    logEvent('Dataset', 'render mode', summary)
  })

  watch(performanceMassRenderData, (value, previous) => {
    if (performanceRenderMode.value !== 'chunked')
      return

    const total = performanceMassData.value.length

    if (total === 0)
      return

    if (value.length === total && (previous?.length ?? 0) !== total)
      logEvent('Dataset', 'chunked ready', `${total.toLocaleString()} points hydrated`)
  })

  return {
    performanceDatasetId,
    performanceRenderMode,
    performanceDatasetOptions,
    performanceDataset,
    performanceMetrics,
    performanceSamples,
    performanceMassData,
    performanceDescription,
    performanceMassRenderData,
    massMarkerStyles,
    chunkProgress,
    chunkProgressLabel,
    hydratePerformanceData,
    cancelMassRenderTask,
    ensureMassMarkerStyles,
  }
}
