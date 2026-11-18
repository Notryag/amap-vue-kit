<script setup lang="ts">
import { AmapMap, AmapRangingTool } from '@amap-vue/core'
import { ref } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const distance = ref<number | null>(null)
function handleResult(event: AMap.RangingToolResult) {
  distance.value = event.distance
}
</script>

<template>
  <AmapMap v-if="props.enabled" class="ranging-map" :center="[116.397, 39.909]" :zoom="13">
    <AmapRangingTool v-slot="{ tool, active, start, stop }" @end="handleResult" @removenode="handleResult">
      <div class="ranging-actions">
        <button type="button" :disabled="!tool || active" @click="start()">
          开始测距
        </button>
        <button type="button" :disabled="!active" @click="stop()">
          停止
        </button>
        <button type="button" :disabled="!tool" @click="stop(true); distance = null">
          清除
        </button>
        <span v-if="active">单击添加测点，双击结束一段测量。</span>
        <output v-if="distance !== null">总距离 {{ distance.toFixed(1) }} 米</output>
      </div>
    </AmapRangingTool>
  </AmapMap>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可测距。
  </p>
</template>

<style scoped>
.ranging-map {
  width: 100%;
  height: clamp(300px, 45vw, 420px);
}

.ranging-actions {
  position: absolute;
  inset: 12px 12px auto;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: var(--vp-c-bg, white);
  color: var(--vp-c-text-1, #1f2937);
}

.ranging-actions button {
  padding: 3px 8px;
  border: 1px solid currentColor;
  border-radius: 4px;
}

.ranging-actions button:disabled {
  opacity: 0.5;
}
</style>
