import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@amap-vue/core': resolve(__dirname, 'packages/core/src'),
      '@amap-vue/hooks': resolve(__dirname, 'packages/hooks/src'),
      '@amap-vue/shared': resolve(__dirname, 'packages/shared/src')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    globals: true
  }
})
