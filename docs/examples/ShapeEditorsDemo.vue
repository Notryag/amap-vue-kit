<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'

type TargetMode = 'instance' | 'id'

type EditablePolyline = AMap.Polyline | null

type EditableBezier = AMap.BezierCurve | null

type EditablePolygon = AMap.Polygon | null

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const hasKey = computed(() => Boolean(key))
const center: [number, number] = [116.397, 39.908]

const circleEditing = ref(false)
const rectangleEditing = ref(false)
const ellipseEditing = ref(false)
const polylineEditing = ref(false)
const bezierEditing = ref(false)
const polygonEditing = ref(false)

const rectangle = shallowRef<AMap.Rectangle | null>(null)
const ellipse = shallowRef<AMap.Ellipse | null>(null)
const polyline = shallowRef<EditablePolyline>(null)
const bezier = shallowRef<EditableBezier>(null)
const polygon = shallowRef<EditablePolygon>(null)

const rectangleTargetMode = ref<TargetMode>('instance')
const ellipseTargetMode = ref<TargetMode>('id')
const eventLog = ref<string[]>([])

function record(label: string) {
  const time = new Date().toLocaleTimeString()
  eventLog.value = [`${time} · ${label}`, ...eventLog.value].slice(0, 5)
}

async function handleReady(map: AMap.Map) {
  if (!key)
    return
  const AMapInstance = await loader.load({ plugins: ['AMap.BezierCurve'] })

  const rect = new AMapInstance.Rectangle({
    bounds: new AMapInstance.Bounds([116.36, 39.9], [116.41, 39.94]),
    strokeColor: '#20c997',
    strokeWeight: 2,
    fillColor: 'rgba(32, 201, 151, 0.35)',
    extData: { id: 'demo-rectangle' },
  })
  rect.setMap(map)
  rectangle.value = rect

  const ell = new AMapInstance.Ellipse({
    center: [116.406, 39.912],
    radius: [900, 420],
    strokeColor: '#fd7e14',
    strokeWeight: 2,
    fillColor: 'rgba(253, 126, 20, 0.3)',
    extData: { id: 'demo-ellipse' },
  })
  ell.setMap(map)
  ellipse.value = ell

  const line = new AMapInstance.Polyline({
    path: [
      [116.35, 39.9],
      [116.38, 39.92],
      [116.41, 39.91],
    ],
    strokeColor: '#722ed1',
    strokeWeight: 4,
    extData: { id: 'demo-polyline' },
  })
  line.setMap(map)
  polyline.value = line

  const curve = new (AMapInstance as any).BezierCurve({
    path: [
      [
        [116.36, 39.88],
        [116.38, 39.92],
        [116.4, 39.94],
        [116.42, 39.91],
      ],
    ],
    strokeColor: '#13c2c2',
    strokeWeight: 4,
    extData: { id: 'demo-bezier' },
  }) as AMap.BezierCurve
  curve.setMap(map)
  bezier.value = curve

  const polygonOverlay = new AMapInstance.Polygon({
    path: [
      [116.37, 39.9],
      [116.41, 39.9],
      [116.42, 39.93],
      [116.38, 39.94],
    ],
    strokeColor: '#fa8c16',
    strokeWeight: 3,
    fillColor: 'rgba(250, 140, 22, 0.25)',
    extData: { id: 'demo-polygon' },
  })
  polygonOverlay.setMap(map)
  polygon.value = polygonOverlay
}

const rectangleTarget = computed(() =>
  rectangleTargetMode.value === 'instance' ? rectangle.value : 'demo-rectangle',
)
const ellipseTarget = computed(() =>
  ellipseTargetMode.value === 'instance' ? ellipse.value : 'demo-ellipse',
)

onBeforeUnmount(() => {
  ;(rectangle.value as any)?.destroy?.()
  ;(ellipse.value as any)?.destroy?.()
  ;(polyline.value as any)?.destroy?.()
  ;(bezier.value as any)?.destroy?.()
  ;(polygon.value as any)?.destroy?.()
})
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      配置 <code>VITE_AMAP_KEY</code> 后体验在线编辑器。
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="12" @ready="handleReady">
          <AmapCircle
            :center="center"
            :radius="600"
            :ext-data="{ id: 'demo-circle' }"
            :options="{ strokeColor: '#4b8bff', fillColor: 'rgba(75, 139, 255, 0.18)', strokeWeight: 2 }"
          />

          <AmapCircleEditor target="demo-circle" :active="circleEditing" @end="record('Circle edited')" />
          <AmapRectangleEditor :target="rectangleTarget" :active="rectangleEditing" @end="record('矩形已编辑')" />
          <AmapEllipseEditor :target="ellipseTarget" :active="ellipseEditing" @end="record('椭圆已编辑')" />
          <AmapPolylineEditor :target="polyline" :active="polylineEditing" @end="record('折线已编辑')" />
          <AmapBezierCurveEditor :target="bezier" :active="bezierEditing" @end="record('贝塞尔曲线已编辑')" />
          <AmapPolygonEditor :target="polygon" :active="polygonEditing" @end="record('多边形已编辑')" />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="circleEditing" type="checkbox">
          编辑圆形
        </label>
        <label>
          <input v-model="rectangleEditing" type="checkbox">
          编辑矩形
        </label>
        <label>
          矩形目标
          <select v-model="rectangleTargetMode">
            <option value="instance">覆盖物实例</option>
            <option value="id">ExtData ID</option>
          </select>
        </label>
        <label>
          <input v-model="ellipseEditing" type="checkbox">
          编辑椭圆
        </label>
        <label>
          椭圆目标
          <select v-model="ellipseTargetMode">
            <option value="id">ExtData ID</option>
            <option value="instance">覆盖物实例</option>
          </select>
        </label>
        <label>
          <input v-model="polylineEditing" type="checkbox">
          编辑折线
        </label>
        <label>
          <input v-model="bezierEditing" type="checkbox">
          编辑贝塞尔曲线
        </label>
        <label>
          <input v-model="polygonEditing" type="checkbox">
          编辑多边形
        </label>
      </div>
      <ul class="amap-demo__log">
        <li v-if="!eventLog.length" class="muted">
          拖动顶点并松开后会记录事件。
        </li>
        <li v-for="(message, index) in eventLog" :key="index">
          {{ message }}
        </li>
      </ul>
    </template>
  </div>
</template>
