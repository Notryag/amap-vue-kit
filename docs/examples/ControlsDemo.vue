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
      配置 <code>VITE_AMAP_KEY</code> 后查看在线示例。
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
          工具条
        </label>
        <label>
          <input v-model="showScale" type="checkbox">
          比例尺
        </label>
        <label>
          <input v-model="showControlBar" type="checkbox">
          控制条
        </label>
        <label>
          <input v-model="showMapType" type="checkbox">
          地图类型
        </label>
        <label>
          位置
          <select v-model="controlPosition">
            <option value="LT">左上</option>
            <option value="RT">右上</option>
            <option value="LB">左下</option>
            <option value="RB">右下</option>
          </select>
        </label>
        <template v-if="showControlBar">
          <label>
            <input v-model="showZoomBar" type="checkbox">
            缩放条
          </label>
          <label>
            <input v-model="showControlButton" type="checkbox">
            旋转/俯仰按钮
          </label>
        </template>
        <template v-if="showMapType">
          <label>
            默认图层
            <select v-model.number="mapTypeDefaultType">
              <option :value="0">标准</option>
              <option :value="1">卫星</option>
            </select>
          </label>
          <label>
            <input v-model="mapTypeShowTraffic" type="checkbox">
            显示路况
          </label>
          <label>
            <input v-model="mapTypeShowRoad" type="checkbox">
            显示路网
          </label>
        </template>
      </div>
    </template>
  </div>
</template>
