import { resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
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
      external: ['vue'],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outputDir: 'dist',
      insertTypesEntry: true,
      copyDtsFiles: true,
      afterBuild() {
        const indexPath = resolve(__dirname, 'dist/index.d.ts')
        const indexTypes = readFileSync(indexPath, 'utf8')
        writeFileSync(
          indexPath,
          `/// <reference types="@amap/amap-jsapi-types" />\n/// <reference types="amap-js-api-autocomplete" />\n/// <reference types="amap-js-api-place-search" />\n/// <reference types="amap-js-api-driving" />\n/// <reference types="amap-js-api-riding" />\n/// <reference types="amap-js-api-geocoder" />\n/// <reference types="amap-js-api-geolocation" />\n/// <reference types="amap-js-api-district-search" />\n/// <reference types="amap-js-api-transfer" />\nimport './amap-extensions';\n${indexTypes}`,
        )
      },
    }),
  ],
})
