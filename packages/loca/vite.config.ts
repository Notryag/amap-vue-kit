import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: 'vue',
      entryRoot: 'src',
      outputDir: 'dist',
      insertTypesEntry: true,
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@amap-vue/shared'],
    },
  },
})
