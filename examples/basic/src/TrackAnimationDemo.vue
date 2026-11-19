<script setup lang="ts">
import type { LngLatLike } from '@amap-vue/shared'
import { AmapMap, AmapMarker, AmapPolyline } from '@amap-vue/core'
import { useMoveAnimation } from '@amap-vue/hooks'
import { ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const path: [number, number][] = [
  [116.397, 39.908],
  [116.405, 39.912],
  [116.417, 39.908],
  [116.423, 39.915],
]
const center: [number, number] = [116.41, 39.9115]
const marker = shallowRef<AMap.Marker | null>(null)
const passedPath = shallowRef<LngLatLike[]>([])
const phase = ref<'idle' | 'starting' | 'playing' | 'paused' | 'complete' | 'failed'>('idle')
const status = {
  idle: '待播放',
  starting: '正在加载动画',
  playing: '播放中',
  paused: '已暂停',
  complete: '已到达终点',
  failed: '动画启动失败',
}

const animation = useMoveAnimation(marker, {
  onMoving: event => passedPath.value = event.passedPath.slice(),
  onMoveAlong: () => phase.value = 'complete',
})

async function start() {
  marker.value?.setPosition(path[0])
  passedPath.value = []
  phase.value = 'starting'
  const started = await animation.moveAlong(path, { duration: 1500, autoRotation: false })
  if (phase.value === 'starting')
    phase.value = started ? 'playing' : 'failed'
}

function pause() {
  animation.pause()
  phase.value = 'paused'
}

function resume() {
  animation.resume()
  phase.value = 'playing'
}

function reset() {
  animation.stop()
  marker.value?.setPosition(path[0])
  passedPath.value = []
  phase.value = 'idle'
}
</script>

<template>
  <div v-if="props.enabled">
    <div class="track-actions">
      <button type="button" :disabled="!marker || phase === 'starting' || phase === 'playing' || phase === 'paused'" @click="start">
        开始
      </button>
      <button type="button" :disabled="phase !== 'playing'" @click="pause">
        暂停
      </button>
      <button type="button" :disabled="phase !== 'paused'" @click="resume">
        继续
      </button>
      <button type="button" :disabled="!marker || phase === 'idle' || phase === 'starting'" @click="reset">
        停止并重置
      </button>
      <span role="status">{{ status[phase] }}</span>
    </div>
    <AmapMap class="track-map" :center="center" :zoom="14">
      <AmapPolyline :path="path" stroke-color="#64748b" :stroke-weight="6" />
      <AmapPolyline v-if="passedPath.length > 1" :path="passedPath" stroke-color="#0891b2" :stroke-weight="6" :z-index="60" />
      <AmapMarker :position="path[0]" @ready="marker = $event" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览轨迹动画。
  </p>
</template>

<style scoped>
.track-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.track-actions button {
  border: 1px solid currentColor;
  border-radius: 6px;
  padding: 4px 10px;
}

.track-actions button:disabled {
  opacity: 0.5;
}

.track-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
