import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outputDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AmapVueCore',
      fileName: () => 'index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@amap-vue/hooks', '@amap-vue/shared'],
    },
  },
})
