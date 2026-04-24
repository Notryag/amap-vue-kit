import type { ComputedRef } from 'vue'
import type { LngLatTuple, PanelId } from '../types'
import {
  escapeHtml,
  escapeSingleQuotes,
  formatBoolean,
  formatCoordinate,
  formatJson,
  formatLngLatTuple,
  formatTuple,
  indentLines,
} from '../utils/format'

interface SnippetContext {
  center: { value: LngLatTuple }
  zoom: { value: number }
  pitch: { value: number }
  rotation: { value: number }
  viewMode: { value: string }
  resolvedMapStyle: ComputedRef<string | undefined>

  markerState: {
    draggable: boolean
    showLabel: boolean
    labelText: string
    labelDirection: string
    offsetX: number
    offsetY: number
  }

  infoWindowState: {
    isOpen: boolean
    title: string
    body: string
    anchor: string
    offsetX: number
    offsetY: number
  }

  polylineState: {
    visible: boolean
    strokeColor: string
    strokeWeight: number
  }

  polygonState: {
    visible: boolean
    strokeColor: string
    fillColor: string
    fillOpacity: number
  }

  circleState: {
    visible: boolean
    radius: number
    strokeColor: string
    strokeWeight: number
    fillColor: string
    fillOpacity: number
  }

  tileLayerState: {
    visible: boolean
    opacity: number
    tileUrl: string
  }

  trafficState: {
    visible: boolean
    autoRefresh: boolean
    interval: number
    opacity: number
  }

  satelliteState: {
    visible: boolean
    opacity: number
  }

  roadNetState: {
    visible: boolean
    opacity: number
  }

  toolBarState: {
    visible: boolean
    position: string
    offsetX: number
    offsetY: number
  }

  scaleState: {
    visible: boolean
    position: string
    offsetX: number
    offsetY: number
  }

  controlBarState: {
    visible: boolean
    position: string
    offsetX: number
    offsetY: number
    showZoomBar: boolean
    showControlButton: boolean
  }

  mapTypeState: {
    visible: boolean
    position: string
    offsetX: number
    offsetY: number
    defaultType: number
    showTraffic: boolean
    showRoad: boolean
  }

  performanceDataset: {
    value: {
      label: string
      size: number
      samples: Array<{
        lng: number
        lat: number
        clusterId: number
        weight: number
      }>
    }
  }

  polylinePath: LngLatTuple[]
  polygonPath: LngLatTuple[]

  polylineOptions: ComputedRef<Record<string, unknown>>
  polygonOptions: ComputedRef<Record<string, unknown>>
  circleOptions: ComputedRef<Record<string, unknown>>
}

function buildMapTemplate(ctx: SnippetContext, children?: string) {
  const attributes = [
    `:center="${formatLngLatTuple(ctx.center.value)}"`,
    `:zoom="${ctx.zoom.value}"`,
    `:pitch="${ctx.pitch.value}"`,
    `:rotation="${ctx.rotation.value}"`,
    `view-mode="${ctx.viewMode.value}"`,
  ]

  if (ctx.resolvedMapStyle.value)
    attributes.push(`map-style="${ctx.resolvedMapStyle.value}"`)

  const attributeLines = attributes.map(attribute => `    ${attribute}`).join('\n')

  if (!children)
    return `<template>\n  <AmapMap\n${attributeLines}\n  />\n</template>`

  return `<template>\n  <AmapMap\n${attributeLines}\n  >\n${indentLines(children, 4)}\n  </AmapMap>\n</template>`
}

function createSfcSnippet(ctx: SnippetContext, options: {
  components: string[]
  children?: string
  extraImports?: string[]
  declarations?: string[]
}) {
  const template = buildMapTemplate(ctx, options.children)
  const componentOrder = ['AmapMap', ...options.components.filter(component => component !== 'AmapMap')]
  const componentList = Array.from(new Set(componentOrder))

  const imports = [
    `import { ${componentList.join(', ')} } from '@amap-vue/core'`,
    ...(options.extraImports ?? []),
  ]

  const declarations = (options.declarations ?? [])
    .filter(line => line !== undefined && line !== null && line !== '')

  const scriptLines = ['<script setup lang="ts">', ...imports]

  if (declarations.length > 0)
    scriptLines.push('', ...declarations)

  scriptLines.push('<\\/script>')

  return [template, '', scriptLines.join('\n'), ''].join('\n')
}

function renderMarkerTag(ctx: SnippetContext) {
  const lines = [
    '<AmapMarker',
    `  :position="${formatLngLatTuple(ctx.center.value)}"`,
    `  :draggable="${formatBoolean(ctx.markerState.draggable)}"`,
  ]

  if (ctx.markerState.showLabel && ctx.markerState.labelText.trim()) {
    lines.push(
      `  :label="{ content: '${escapeSingleQuotes(ctx.markerState.labelText.trim())}', direction: '${ctx.markerState.labelDirection}' }"`,
    )
  }

  lines.push(`  :offset="${formatTuple([ctx.markerState.offsetX, ctx.markerState.offsetY])}"`)
  lines.push('/>')

  return lines.join('\n')
}

function renderInfoWindowTag(ctx: SnippetContext) {
  const lines = [
    '<AmapInfoWindow',
    `  :position="${formatLngLatTuple(ctx.center.value)}"`,
    `  :is-open="${formatBoolean(ctx.infoWindowState.isOpen)}"`,
    `  anchor="${ctx.infoWindowState.anchor}"`,
    `  :offset="${formatTuple([ctx.infoWindowState.offsetX, ctx.infoWindowState.offsetY])}"`,
    '>',
  ]

  const title = escapeHtml(ctx.infoWindowState.title)
  const body = escapeHtml(ctx.infoWindowState.body).replace(/\n/g, '<br>')

  lines.push('  <div class="info-window">')
  lines.push(`    <h3>${title}</h3>`)
  lines.push(`    <p>${body}</p>`)
  lines.push('  </div>')
  lines.push('</AmapInfoWindow>')

  return lines.join('\n')
}

export function createSnippetGenerators(ctx: SnippetContext): Record<PanelId, () => string> {
  return {
    map: () => createSfcSnippet(ctx, { components: [] }),

    marker: () => createSfcSnippet(ctx, {
      components: ['AmapMarker'],
      children: renderMarkerTag(ctx),
    }),

    infoWindow: () => {
      const sections = [renderMarkerTag(ctx), renderInfoWindowTag(ctx)]

      return createSfcSnippet(ctx, {
        components: ['AmapMarker', 'AmapInfoWindow'],
        children: sections.join('\n\n'),
      })
    },

    polyline: () => {
      const declarations = [
        `const path = ${formatJson(ctx.polylinePath)}`,
        `const options = ${formatJson(ctx.polylineOptions.value)}`,
      ]

      const child = [
        '<AmapPolyline',
        '  :path="path"',
        '  :options="options"',
        `  :visible="${formatBoolean(ctx.polylineState.visible)}"`,
        '/>',
      ].join('\n')

      return createSfcSnippet(ctx, {
        components: ['AmapPolyline'],
        children: child,
        declarations,
      })
    },

    polygon: () => {
      const declarations = [
        `const path = ${formatJson(ctx.polygonPath)}`,
        `const options = ${formatJson(ctx.polygonOptions.value)}`,
      ]

      const child = [
        '<AmapPolygon',
        '  :path="path"',
        '  :options="options"',
        `  :visible="${formatBoolean(ctx.polygonState.visible)}"`,
        '/>',
      ].join('\n')

      return createSfcSnippet(ctx, {
        components: ['AmapPolygon'],
        children: child,
        declarations,
      })
    },

    circle: () => {
      const declarations = [
        `const options = ${formatJson(ctx.circleOptions.value)}`,
      ]

      const child = [
        '<AmapCircle',
        `  :center="${formatLngLatTuple(ctx.center.value)}"`,
        `  :radius="${ctx.circleState.radius}"`,
        '  :options="options"',
        `  :visible="${formatBoolean(ctx.circleState.visible)}"`,
        '/>',
      ].join('\n')

      return createSfcSnippet(ctx, {
        components: ['AmapCircle'],
        children: child,
        declarations,
      })
    },

    tileLayer: () => createSfcSnippet(ctx, {
      components: ['AmapTileLayer'],
      children: [
        '<AmapTileLayer',
        `  :visible="${formatBoolean(ctx.tileLayerState.visible)}"`,
        `  :opacity="${ctx.tileLayerState.opacity}"`,
        `  tile-url="${ctx.tileLayerState.tileUrl}"`,
        '/>',
      ].join('\n'),
    }),

    traffic: () => createSfcSnippet(ctx, {
      components: ['AmapTrafficLayer'],
      children: [
        '<AmapTrafficLayer',
        `  :visible="${formatBoolean(ctx.trafficState.visible)}"`,
        `  :auto-refresh="${formatBoolean(ctx.trafficState.autoRefresh)}"`,
        `  :interval="${ctx.trafficState.interval}"`,
        `  :opacity="${ctx.trafficState.opacity}"`,
        '/>',
      ].join('\n'),
    }),

    satellite: () => createSfcSnippet(ctx, {
      components: ['AmapSatelliteLayer'],
      children: [
        '<AmapSatelliteLayer',
        `  :visible="${formatBoolean(ctx.satelliteState.visible)}"`,
        `  :opacity="${ctx.satelliteState.opacity}"`,
        '/>',
      ].join('\n'),
    }),

    roadNet: () => createSfcSnippet(ctx, {
      components: ['AmapRoadNetLayer'],
      children: [
        '<AmapRoadNetLayer',
        `  :visible="${formatBoolean(ctx.roadNetState.visible)}"`,
        `  :opacity="${ctx.roadNetState.opacity}"`,
        '/>',
      ].join('\n'),
    }),

    toolBar: () => createSfcSnippet(ctx, {
      components: ['AmapToolBar'],
      children: [
        '<AmapToolBar',
        `  :visible="${formatBoolean(ctx.toolBarState.visible)}"`,
        `  position="${ctx.toolBarState.position}"`,
        `  :offset="${formatTuple([ctx.toolBarState.offsetX, ctx.toolBarState.offsetY])}"`,
        '/>',
      ].join('\n'),
    }),

    scale: () => createSfcSnippet(ctx, {
      components: ['AmapScale'],
      children: [
        '<AmapScale',
        `  :visible="${formatBoolean(ctx.scaleState.visible)}"`,
        `  position="${ctx.scaleState.position}"`,
        `  :offset="${formatTuple([ctx.scaleState.offsetX, ctx.scaleState.offsetY])}"`,
        '/>',
      ].join('\n'),
    }),

    controlBar: () => createSfcSnippet(ctx, {
      components: ['AmapControlBar'],
      children: [
        '<AmapControlBar',
        `  :visible="${formatBoolean(ctx.controlBarState.visible)}"`,
        `  position="${ctx.controlBarState.position}"`,
        `  :offset="${formatTuple([ctx.controlBarState.offsetX, ctx.controlBarState.offsetY])}"`,
        `  :show-zoom-bar="${formatBoolean(ctx.controlBarState.showZoomBar)}"`,
        `  :show-control-button="${formatBoolean(ctx.controlBarState.showControlButton)}"`,
        '/>',
      ].join('\n'),
    }),

    mapType: () => createSfcSnippet(ctx, {
      components: ['AmapMapType'],
      children: [
        '<AmapMapType',
        `  :visible="${formatBoolean(ctx.mapTypeState.visible)}"`,
        `  position="${ctx.mapTypeState.position}"`,
        `  :offset="${formatTuple([ctx.mapTypeState.offsetX, ctx.mapTypeState.offsetY])}"`,
        `  :default-type="${ctx.mapTypeState.defaultType}"`,
        `  :show-traffic="${formatBoolean(ctx.mapTypeState.showTraffic)}"`,
        `  :show-road="${formatBoolean(ctx.mapTypeState.showRoad)}"`,
        '/>',
      ].join('\n'),
    }),

    performance: () => {
      const dataset = ctx.performanceDataset.value

      const sampleLines = dataset.samples.map((sample, index) =>
        `  { lnglat: [${formatCoordinate(sample.lng)}, ${formatCoordinate(sample.lat)}], name: 'Point ${index + 1}', style: ${sample.clusterId} }, // weight ${sample.weight.toFixed(2)}`,
      )

      const remaining = dataset.size - dataset.samples.length

      const declarations = [
        `// Selected dataset: ${dataset.label} (${dataset.size.toLocaleString()} points)`,
        [
          'const points: AMap.MassData[] = [',
          ...sampleLines,
          remaining > 0 ? `  // ... ${remaining.toLocaleString()} more points` : undefined,
          ']',
        ].filter(Boolean).join('\n'),
        'const styles = ref<AMap.MassMarkersStyleOptions[]>([])',
      ]

      const child = [
        '<AmapMassMarks',
        '  :data="points"',
        '  :style="styles"',
        '/>',
      ].join('\n')

      return createSfcSnippet(ctx, {
        components: ['AmapMassMarks'],
        children: child,
        extraImports: ['import { ref } from \'vue\''],
        declarations,
      })
    },
  }
}
