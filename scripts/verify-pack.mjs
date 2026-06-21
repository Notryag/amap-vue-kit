import { spawn } from 'node:child_process'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const tempRoot = join(root, '.temp', 'pack-consumer')
const packDir = join(tempRoot, 'tarballs')
const consumerDir = join(tempRoot, 'consumer')

const packageDirs = [
  'packages/shared',
  'packages/hooks',
  'packages/core',
  'packages/loca',
]

const forbiddenPackagePatterns = [
  {
    pattern: /workspace:\*/u,
    reason: 'workspace protocol leaked into packed package',
  },
  {
    pattern: /@amap\/amap-jsapi-types|@types\/amap-js-api/u,
    reason: 'external AMap type package leaked into published surface',
  },
  {
    pattern: /[A-Z]:[\\/][^\s"']+/u,
    reason: 'absolute Windows path leaked into packed package',
  },
]

function run(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0)
        resolveRun()
      else
        reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory())
      files.push(...await listFiles(path))
    else if (entry.isFile())
      files.push(path)
  }

  return files
}

async function auditPackedPackages() {
  const extractRoot = join(tempRoot, 'audit')
  await rm(extractRoot, { recursive: true, force: true })
  await mkdir(extractRoot, { recursive: true })

  for (const { tarballName } of await getPackages()) {
    const packageRoot = join(extractRoot, tarballName.replace(/\.tgz$/u, ''))
    await mkdir(packageRoot, { recursive: true })
    await run('tar', ['-xzf', join(packDir, tarballName), '-C', packageRoot])

    const files = await listFiles(packageRoot)
    for (const file of files) {
      if (!/\.(?:json|js|mjs|cjs|ts|d\.ts|css|md)$/u.test(file))
        continue

      const content = await readFile(file, 'utf8')
      for (const { pattern, reason } of forbiddenPackagePatterns) {
        if (pattern.test(content))
          throw new Error(`${reason}: ${file}`)
      }
    }
  }
}

function tarballNameForPackage(packageJson) {
  const name = packageJson.name
    .replace(/^@/u, '')
    .replace(/\//gu, '-')

  return `${name}-${packageJson.version}.tgz`
}

async function getPackages() {
  return Promise.all(packageDirs.map(async (packageDir) => {
    const packageJson = JSON.parse(await readFile(join(root, packageDir, 'package.json'), 'utf8'))

    return {
      dir: packageDir,
      name: packageJson.name,
      tarballName: tarballNameForPackage(packageJson),
    }
  }))
}

function getTarballPath(packages, packageName) {
  const matchedPackage = packages.find(pkg => pkg.name === packageName)

  if (!matchedPackage)
    throw new Error(`Package ${packageName} is not configured for pack verification`)

  return `file:${join(packDir, matchedPackage.tarballName)}`
}

async function main() {
  await rm(tempRoot, { recursive: true, force: true })
  await mkdir(packDir, { recursive: true })
  await mkdir(join(consumerDir, 'src'), { recursive: true })

  await run('pnpm', ['-s', 'build'])

  const packages = await getPackages()

  for (const { dir } of packages)
    await run('npm', ['pack', '--pack-destination', packDir], { cwd: join(root, dir) })

  await auditPackedPackages()

  await writeFile(join(consumerDir, 'package.json'), JSON.stringify({
    name: 'amap-vue-kit-pack-consumer',
    private: true,
    type: 'module',
    scripts: {
      build: 'vite build',
      typecheck: 'vue-tsc --noEmit',
    },
    dependencies: {
      '@amap-vue/core': getTarballPath(packages, '@amap-vue/core'),
      '@amap-vue/hooks': getTarballPath(packages, '@amap-vue/hooks'),
      '@amap-vue/loca': getTarballPath(packages, '@amap-vue/loca'),
      '@amap-vue/shared': getTarballPath(packages, '@amap-vue/shared'),
      '@vitejs/plugin-vue': '^6.0.1',
      'typescript': '^5.9.3',
      'vite': '^7.1.9',
      'vue': '^3.5.22',
      'vue-tsc': '^3.1.1',
    },
    pnpm: {
      overrides: {
        '@amap-vue/hooks': getTarballPath(packages, '@amap-vue/hooks'),
        '@amap-vue/shared': getTarballPath(packages, '@amap-vue/shared'),
      },
    },
  }, null, 2))
  await writeFile(join(consumerDir, 'pnpm-workspace.yaml'), 'packages:\n  - .\n')

  await writeFile(join(consumerDir, 'index.html'), '<div id="app"></div><script type="module" src="/src/main.ts"></script>\n')
  await writeFile(join(consumerDir, 'vite.config.ts'), `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
})
`)
  await writeFile(join(consumerDir, 'src', 'main.ts'), `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`)
  await writeFile(join(consumerDir, 'src', 'App.vue'), `<script setup lang="ts">
import { AmapMap, AmapMarker, AmapToolBar } from '@amap-vue/core'
import { useMap, useMarker } from '@amap-vue/hooks'
import { AmapLocaPointLayer, AmapLocaProvider } from '@amap-vue/loca'
import { loader } from '@amap-vue/shared'
import { computed, shallowRef } from 'vue'
import '@amap-vue/core/style.css'

loader.config({ key: 'test-key', version: '2.0' })

const center: [number, number] = [116.397428, 39.90923]
const mapRef = shallowRef<AMap.Map | null>(null)
const hasMap = computed(() => Boolean(mapRef.value))
const manualMap = useMap({ center, zoom: 12, immediate: false })
const manualMarker = useMarker(() => manualMap.map.value, () => ({ position: center }))
const locaData = [{ lng: center[0], lat: center[1], count: 1 }]
</script>

<template>
  <AmapMap :center="center" :zoom="12" @ready="mapRef = $event">
    <AmapToolBar />
    <AmapMarker :position="center" label="天安门" />
    <AmapLocaProvider v-if="hasMap" :map="mapRef">
      <AmapLocaPointLayer :data="locaData" />
    </AmapLocaProvider>
  </AmapMap>
  <p>{{ manualMarker.marker.value ? 'marker-ready' : 'marker-pending' }}</p>
</template>
`)

  try {
    await run('pnpm', ['install'], { cwd: consumerDir })
    await run('pnpm', ['run', 'typecheck'], { cwd: consumerDir })
    await run('pnpm', ['run', 'build'], { cwd: consumerDir })
  }
  finally {
    await rm(tempRoot, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
