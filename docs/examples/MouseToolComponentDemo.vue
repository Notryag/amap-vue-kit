<script setup lang="ts">
import { AmapMap, AmapMouseTool } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

useDemoLoader({ plugins: ['AMap.MouseTool'] })

type DrawMode = 'none' | 'circle' | 'rectangle' | 'polygon' | 'polyline' | 'bezierCurve' | 'ellipse'

const mode = ref<DrawMode>('none')
const lastShape = ref<string>('')

function handleDraw(event: any) {
  const type = event?.obj?.CLASS_NAME ?? 'Overlay'
  lastShape.value = type.split('.').pop() ?? type
}
</script>

<template>
  <div class="amap-demo">
    <div class="amap-demo__map">
      <AmapMap :center="[116.397, 39.909]" :zoom="13">
        <AmapMouseTool v-model:mode="mode" @draw="handleDraw" />
      </AmapMap>
    </div>
    <div class="amap-demo__toolbar">
      <button type="button" @click="mode = 'circle'">
        Draw circle
      </button>
      <button type="button" @click="mode = 'rectangle'">
        Draw rectangle
      </button>
      <button type="button" @click="mode = 'polygon'">
        Draw polygon
      </button>
      <button type="button" @click="mode = 'polyline'">
        Draw polyline
      </button>
      <button type="button" @click="mode = 'none'">
        Cancel
      </button>
      <div v-if="lastShape">
        Last overlay: {{ lastShape }}
      </div>
    </div>
  </div>
</template>
