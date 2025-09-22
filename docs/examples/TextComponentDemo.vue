<script setup lang="ts">
import { AmapMap, AmapText } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const center = ref<[number, number]>([116.397, 39.908])
const message = ref('Welcome to Chaoyang District')
const showShadow = ref(true)

const textStyle = computed(() => ({
  padding: '6px 10px',
  borderRadius: '12px',
  background: 'rgba(22, 119, 255, 0.92)',
  color: '#fff',
  fontSize: '13px',
  boxShadow: showShadow.value ? '0 10px 24px rgba(22, 119, 255, 0.35)' : 'none',
}))
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Set <code>VITE_AMAP_KEY</code> to preview <code>&lt;AmapText&gt;</code>.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="center" :zoom="14">
          <AmapText
            :position="center"
            :text="message"
            :style="textStyle"
            :offset="[0, -26]"
            anchor="bottom-center"
          />
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <label>
          Message
          <input v-model="message" type="text" placeholder="Enter text">
        </label>
        <label>
          <input v-model="showShadow" type="checkbox">
          Drop shadow
        </label>
      </div>
    </template>
  </div>
</template>
