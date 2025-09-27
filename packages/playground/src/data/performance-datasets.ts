const BASE_CENTER: [number, number] = [116.397428, 39.90923]

interface ClusterConfig {
  id: number
  center: [number, number]
  radiusLng: number
  radiusLat: number
  intensity: number
}

interface RawPoint {
  clusterId: number
  lng: number
  lat: number
  weight: number
}

function createRng(seed: number) {
  let t = seed + 0x6D2B79F5
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toFixed(value: number, precision: number) {
  return Number(value.toFixed(precision))
}

function createClusters(seed: number): ClusterConfig[] {
  const jitter = createRng(seed)
  const [baseLng, baseLat] = BASE_CENTER
  return [
    {
      id: 0,
      center: [baseLng, baseLat],
      radiusLng: 0.12,
      radiusLat: 0.09,
      intensity: 80,
    },
    {
      id: 1,
      center: [baseLng - 0.18 + jitter() * 0.04, baseLat + 0.12 + jitter() * 0.03],
      radiusLng: 0.08,
      radiusLat: 0.07,
      intensity: 110,
    },
    {
      id: 2,
      center: [baseLng + 0.22 + jitter() * 0.03, baseLat - 0.16 + jitter() * 0.02],
      radiusLng: 0.1,
      radiusLat: 0.08,
      intensity: 65,
    },
  ]
}

function generatePoints(count: number, seed: number) {
  const rng = createRng(seed)
  const clusters = createClusters(seed)
  const points: RawPoint[] = []

  for (let index = 0; index < count; index++) {
    const cluster = clusters[Math.floor(rng() * clusters.length)]
    const angle = rng() * Math.PI * 2
    const distance = rng() ** 0.85
    const lng = cluster.center[0] + Math.cos(angle) * cluster.radiusLng * distance
    const lat = cluster.center[1] + Math.sin(angle) * cluster.radiusLat * distance
    const weight = cluster.intensity * (0.6 + rng() * 0.8)

    points.push({
      clusterId: cluster.id,
      lng: toFixed(lng, 6),
      lat: toFixed(lat, 6),
      weight: toFixed(weight, 2),
    })
  }

  return points
}

function summarise(points: RawPoint[]) {
  const lngValues = points.map(point => point.lng)
  const latValues = points.map(point => point.lat)
  const weightValues = points.map(point => point.weight)

  const minLng = Math.min(...lngValues)
  const maxLng = Math.max(...lngValues)
  const minLat = Math.min(...latValues)
  const maxLat = Math.max(...latValues)
  const avgWeight = weightValues.reduce((total, value) => total + value, 0) / weightValues.length
  const sortedWeights = [...weightValues].sort((a, b) => a - b)
  const midIndex = Math.floor(sortedWeights.length / 2)
  const medianWeight = sortedWeights.length % 2 === 0
    ? (sortedWeights[midIndex - 1] + sortedWeights[midIndex]) / 2
    : sortedWeights[midIndex]

  return {
    bounds: {
      minLng,
      minLat,
      maxLng,
      maxLat,
    },
    averages: {
      weight: toFixed(avgWeight, 2),
    },
    medianWeight: toFixed(medianWeight, 2),
  }
}

export interface PerformanceDataset {
  id: 'small' | 'medium' | 'large'
  label: string
  description: string
  size: number
  mass: AMap.MassData[]
  heat: AMap.HeatMapDataPoint[]
  summary: ReturnType<typeof summarise>
  samples: RawPoint[]
}

function createDataset(id: PerformanceDataset['id'], size: number, seed: number): PerformanceDataset {
  const points = generatePoints(size, seed)
  const summary = summarise(points)

  return {
    id,
    label: id === 'small' ? 'Small (100 points)' : id === 'medium' ? 'Medium (3k points)' : 'Large (10k points)',
    description:
      id === 'small'
        ? 'Handy for quick smoke tests or validating prop updates.'
        : id === 'medium'
          ? 'Represents a moderate load when exploring layer styling.'
          : 'Stresses batching logic to profile FPS on powerful devices.',
    size,
    mass: points.map((point, index) => ({
      lnglat: [point.lng, point.lat],
      name: `Point ${index + 1}`,
      style: point.clusterId,
    } satisfies AMap.MassData)),
    heat: points.map(point => ({
      lng: point.lng,
      lat: point.lat,
      count: Math.round(point.weight),
    } satisfies AMap.HeatMapDataPoint)),
    summary,
    samples: points.slice(0, 5),
  }
}

export const performanceDatasets: PerformanceDataset[] = [
  createDataset('small', 100, 42),
  createDataset('medium', 3000, 1337),
  createDataset('large', 10000, 9001),
]

export type PerformanceDatasetId = PerformanceDataset['id']
export type PerformanceDatasetSample = RawPoint
