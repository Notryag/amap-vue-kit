import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@amap-vue/core': resolve(__dirname, 'packages/core/src'),
      '@amap-vue/hooks': resolve(__dirname, 'packages/hooks/src'),
      '@amap-vue/shared': resolve(__dirname, 'packages/shared/src'),
      '@amap-vue/loca': resolve(__dirname, 'packages/loca/src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    globals: true,
  },
})
