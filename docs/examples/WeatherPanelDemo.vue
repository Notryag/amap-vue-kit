<script setup lang="ts">
import { AmapWeatherPanel } from '@amap-vue/core'
import { ref } from 'vue'
import { useDemoLoader } from './useDemoLoader'

useDemoLoader({ plugins: ['AMap.Weather'] })

const city = ref('北京')
const cities = ['北京', '上海', '广州', '深圳', '成都']

function handleError(message: string) {
  console.warn('Weather error', message)
}
</script>

<template>
  <div class="amap-demo amap-demo--centered">
    <AmapWeatherPanel v-model="city" :cities="cities" @error="handleError" />
  </div>
</template>
