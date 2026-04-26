import type { PerformanceDatasetId, PlaygroundMassData } from '../data/performance-datasets'
import type { PerformanceRenderMode } from '../types'
import { computed, ref, shallowRef, watch } from 'vue'
import { performanceDatasets } from '../data/performance-datasets'

const MASS_CHUNK_SIZE = 800
const MASS_MARK_ICON_URLS = [
  'https://webapi.amap.com/images/mass/mass0.png',
  'https://webapi.amap.com/images/mass/mass1.png',
  'https://webapi.amap.com/images/mass/mass2.png',
]
const MASS_MARKER_STYLES: AMap.MassMarkersStyleOptions[] = [
  {
    url: MASS_MARK_ICON_URLS[0],
    size: [11, 11],
    anchor: [6, 6],
    zIndex: 3,
  },
  {
    url: MASS_MARK_ICON_URLS[1],
    size: [7, 7],
    anchor: [4, 4],
    zIndex: 2,
  },
  {
    url: MASS_MARK_ICON_URLS[2],
    size: [5, 5],
    anchor: [3, 3],
    zIndex: 1,
  },
]

export function usePerformanceMarks(logEvent: (source: 'Dataset', summary: string, detail?: string) => void) {
  const performanceDatasetId = ref<PerformanceDatasetId>('official')
  const performanceRenderMode = ref<PerformanceRenderMode>('immediate')

  function getOfficialCitys() {
    if (typeof window === 'undefined')
      return []

    const globalCitys = (window as typeof window & { citys?: PlaygroundMassData[] }).citys
    return Array.isArray(globalCitys) ? globalCitys : []
  }

  const officialCitys = shallowRef<PlaygroundMassData[]>(getOfficialCitys())

  const performanceDatasetOptions = computed(() => [
    {
      label: `Official citys (${officialCitys.value.length.toLocaleString()} points)`,
      value: 'official' as const,
    },
    ...performanceDatasets.map(dataset => ({
      label: dataset.label,
      value: dataset.id,
    })),
  ])

  const officialDataset = computed(() => {
    const data = officialCitys.value
    const lngValues = data.map(point => point.lnglat[0])
    const latValues = data.map(point => point.lnglat[1])
    const hasData = data.length > 0

    return {
      id: 'official' as const,
      label: `Official citys (${data.length.toLocaleString()} points)`,
      description: 'Official AMap MassMarks demo dataset loaded from citys.js.',
      size: data.length,
      mass: data,
      heat: [],
      summary: {
        bounds: {
          minLng: hasData ? Math.min(...lngValues) : 0,
          minLat: hasData ? Math.min(...latValues) : 0,
          maxLng: hasData ? Math.max(...lngValues) : 0,
          maxLat: hasData ? Math.max(...latValues) : 0,
        },
        averages: {
          weight: 0,
        },
        medianWeight: 0,
      },
      samples: data.slice(0, 5).map(point => ({
        clusterId: point.style,
        lng: point.lnglat[0],
        lat: point.lnglat[1],
        weight: 0,
      })),
    }
  })

  const performanceDataset = computed(() =>
    performanceDatasetId.value === 'official'
      ? officialDataset.value
      : performanceDatasets.find(dataset => dataset.id === performanceDatasetId.value) ?? performanceDatasets[0],
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
  const massMarkerStyles = ref<AMap.MassMarkersStyleOptions[]>(MASS_MARKER_STYLES)

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

  function ensureMassMarkerStyles() {
    massMarkerStyles.value = MASS_MARKER_STYLES
  }

  watch(performanceDatasetId, () => {
    const dataset = performanceDataset.value

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
