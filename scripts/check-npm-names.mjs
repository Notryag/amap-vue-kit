import { spawn } from 'node:child_process'
import process from 'node:process'

const packages = [
  '@amap-vue/shared',
  '@amap-vue/hooks',
  '@amap-vue/core',
  '@amap-vue/loca',
]

function npmView(packageName) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['view', packageName, 'name', 'version', '--json'], {
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    child.stdout.on('data', chunk => stdout += chunk)
    child.stderr.on('data', chunk => stderr += chunk)
    child.on('exit', code => resolve({ code, stdout, stderr }))
  })
}

async function main() {
  let hasConflict = false

  for (const packageName of packages) {
    const result = await npmView(packageName)

    if (result.code === 0) {
      hasConflict = true
      const detail = result.stdout.trim() || packageName
      console.error(`[taken] ${detail}`)
      continue
    }

    if (result.stderr.includes('E404') || result.stdout.includes('E404')) {
      console.log(`[available] ${packageName}`)
      continue
    }

    hasConflict = true
    console.error(`[unknown] ${packageName}`)
    console.error((result.stderr || result.stdout).trim())
  }

  if (hasConflict)
    process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
