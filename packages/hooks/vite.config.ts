import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue', '@amap-vue/shared'],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outputDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
})
