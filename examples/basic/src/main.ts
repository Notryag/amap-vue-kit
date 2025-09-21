import { createApp } from 'vue'
import App from './App.vue'
import Core from '@amap-vue/core'
import { loader } from '@amap-vue/shared'

const key = import.meta.env.VITE_AMAP_KEY
if (key)
  loader.config({ key })

createApp(App).use(Core).mount('#app')
