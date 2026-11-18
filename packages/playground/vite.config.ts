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
      '@': resolve(import.meta.dirname, 'src'),
      '@amap-vue/core': resolve(import.meta.dirname, '../core/src'),
      '@amap-vue/hooks': resolve(import.meta.dirname, '../hooks/src'),
      '@amap-vue/shared': resolve(import.meta.dirname, '../shared/src'),
    },
  },
})
