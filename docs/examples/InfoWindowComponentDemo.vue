<script setup lang="ts">
import { AmapInfoWindow, AmapMap, AmapMarker } from '@amap-vue/core'
import { computed, ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

const { hasKey } = useDemoLoader()

const position = ref<[number, number]>([116.397, 39.908])
const isOpen = ref(true)
const isCustom = ref(false)
const anchor = ref<AMap.InfoWindowAnchor>('top-center')
const anchors: AMap.InfoWindowAnchor[] = ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']

const anchorLabel = computed(() => anchor.value.replace('-', ' '))

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function cycleAnchor() {
  const index = anchors.indexOf(anchor.value)
  anchor.value = anchors[(index + 1) % anchors.length]
}
</script>

<template>
  <div class="amap-demo">
    <div v-if="!hasKey" class="amap-demo__placeholder">
      Provide <code>VITE_AMAP_KEY</code> to preview the info window.
    </div>
    <template v-else>
      <div class="amap-demo__map">
        <AmapMap :center="position" :zoom="13">
          <AmapMarker :position="position" />
          <AmapInfoWindow
            :position="position"
            :is-open="isOpen"
            :anchor="anchor"
            :is-custom="isCustom"
          >
            <div class="info-window">
              <h4>Forbidden City</h4>
              <p style="margin: 0">
                Imperial palace complex in central Beijing.
              </p>
            </div>
          </AmapInfoWindow>
        </AmapMap>
      </div>
      <div class="amap-demo__toolbar">
        <button type="button" @click="toggleOpen">
          {{ isOpen ? 'Close window' : 'Open window' }}
        </button>
        <label>
          <input v-model="isCustom" type="checkbox">
          Custom chrome
        </label>
        <button type="button" @click="cycleAnchor">
          Anchor: {{ anchorLabel }}
        </button>
      </div>
    </template>
  </div>
</template>
