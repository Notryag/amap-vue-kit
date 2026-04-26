import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueDevtools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    VueDevtools(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@amap-vue/core': resolve(__dirname, '../core/src'),
      '@amap-vue/hooks': resolve(__dirname, '../hooks/src'),
      '@amap-vue/shared': resolve(__dirname, '../shared/src'),
    },
  },
})
