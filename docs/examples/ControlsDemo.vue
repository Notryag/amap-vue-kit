<script setup lang="ts">
import { loader } from '@amap-vue/shared'
import { computed, ref } from 'vue'

const key = (import.meta as any).env?.VITE_AMAP_KEY as string | undefined
if (key)
  loader.config({ key })

const center: [number, number] = [116.397, 39.908]
const zoom = 12
const hasKey = computed(() => Boolean(key))

const showToolBar = ref(true)
const showScale = ref(true)
const showControlBar = ref(false)
const showMapType = ref(true)
const controlPosition = ref<'LT' | 'RT' | 'LB' | 'RB'>('RT')
const mapTypeDefaultType = ref<0 | 1>(0)
const mapTypeShowTraffic = ref(false)
const mapTypeShowRoad = ref(true)
const showZoomBar = ref(true)
const showControlButton = ref(true)
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to see the live demo.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="zoom">
          <AmapToolBar
            v-if="showToolBar"
            :position="controlPosition"
            :offset="[16, 16]"
          />
          <AmapScale
            v-if="showScale"
            :position="controlPosition"
            :offset="[16, 86]"
          />
          <AmapControlBar
            v-if="showControlBar"
            :position="controlPosition"
            :show-zoom-bar="showZoomBar"
            :show-control-button="showControlButton"
          />
          <AmapMapType
            v-if="showMapType"
            :position="controlPosition"
            :offset="[16, 156]"
            :default-type="mapTypeDefaultType"
            :show-traffic="mapTypeShowTraffic"
            :show-road="mapTypeShowRoad"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          <input v-model="showToolBar" type="checkbox">
          ToolBar
        </label>
        <label>
          <input v-model="showScale" type="checkbox">
          Scale
        </label>
        <label>
          <input v-model="showControlBar" type="checkbox">
          ControlBar
        </label>
        <label>
          <input v-model="showMapType" type="checkbox">
          MapType
        </label>
        <label>
          Position
          <select v-model="controlPosition">
            <option value="LT">Left · Top</option>
            <option value="RT">Right · Top</option>
            <option value="LB">Left · Bottom</option>
            <option value="RB">Right · Bottom</option>
          </select>
        </label>
        <template v-if="showControlBar">
          <label>
            <input v-model="showZoomBar" type="checkbox">
            Zoom bar
          </label>
          <label>
            <input v-model="showControlButton" type="checkbox">
            Rotate/tilt button
          </label>
        </template>
        <template v-if="showMapType">
          <label>
            Default layer
            <select v-model.number="mapTypeDefaultType">
              <option :value="0">Standard</option>
              <option :value="1">Satellite</option>
            </select>
          </label>
          <label>
            <input v-model="mapTypeShowTraffic" type="checkbox">
            Toggle traffic
          </label>
          <label>
            <input v-model="mapTypeShowRoad" type="checkbox">
            Toggle road net
          </label>
        </template>
      </div>
    </template>
  </div>
</template>
