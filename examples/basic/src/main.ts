import Core from '@amap-vue/core'
import { loader } from '@amap-vue/shared'
import { createApp } from 'vue'
import App from './App.vue'

const key = import.meta.env.VITE_AMAP_KEY
const securityJsCode = import.meta.env.VITE_AMAP_SECURITY_CODE

if (key) {
  loader.config({
    key,
    version: '2.0',
    securityJsCode,
  })
}

createApp(App).use(Core).mount('#app')
