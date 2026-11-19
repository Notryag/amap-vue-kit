<script setup lang="ts">
import type { GLCustomLayerContext, UseGLCustomLayerOptions } from '@amap-vue/hooks'
import { AmapGLCustomLayer, AmapMap } from '@amap-vue/core'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ enabled?: boolean }>(), {
  enabled: Boolean(import.meta.env.VITE_AMAP_KEY),
})

const center: [number, number] = [116.3975, 39.9115]
const layer = ref<InstanceType<typeof AmapGLCustomLayer> | null>(null)
const size = ref(30)
const visible = ref(true)
let program: WebGLProgram | null = null
let point: WebGLUniformLocation | null = null
let diameter: WebGLUniformLocation | null = null

function init({ gl }: GLCustomLayerContext) {
  const created = gl.createProgram()
  if (!created)
    return

  const shaders: WebGLShader[] = []
  const sources = [
    [gl.VERTEX_SHADER, 'uniform vec2 point; uniform float diameter; void main() { gl_Position = vec4(point, -1.0, 1.0); gl_PointSize = diameter; }'],
    [gl.FRAGMENT_SHADER, 'precision mediump float; void main() { if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard; gl_FragColor = vec4(0.75, 0.1, 0.85, 1.0); }'],
  ] as const
  try {
    for (const [type, source] of sources) {
      const shader = gl.createShader(type)
      if (!shader)
        throw new Error('WebGL shader allocation failed.')
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader) || 'WebGL shader compilation failed.')
      gl.attachShader(created, shader)
    }
    gl.linkProgram(created)
    if (!gl.getProgramParameter(created, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(created) || 'WebGL program linking failed.')
    point = gl.getUniformLocation(created, 'point')
    diameter = gl.getUniformLocation(created, 'diameter')
    program = created
  }
  catch (error) {
    gl.deleteProgram(created)
    throw error
  }
  finally {
    for (const shader of shaders)
      gl.deleteShader(shader)
  }

  return () => {
    gl.deleteProgram(created)
    program = null
  }
}

const draw: UseGLCustomLayerOptions['render'] = ({ gl, map }) => {
  if (!program)
    return
  const viewport = map.getSize()
  const pixel = map.lngLatToContainer(center)
  const previous = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null
  gl.useProgram(program)
  try {
    gl.uniform2f(point, 2 * pixel.getX() / viewport.getWidth() - 1, 1 - 2 * pixel.getY() / viewport.getHeight())
    gl.uniform1f(diameter, size.value * window.devicePixelRatio)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
  finally {
    gl.useProgram(previous)
  }
}

watch(size, () => layer.value?.redraw())
</script>

<template>
  <div v-if="props.enabled">
    <div class="gl-actions">
      <label>圆点直径 {{ size }} px <input v-model.number="size" type="range" min="10" max="60"></label>
      <label><input v-model="visible" type="checkbox"> 显示圆点</label>
    </div>
    <AmapMap class="gl-map" :center="center" :zoom="13" :pitch="25" view-mode="3D">
      <AmapGLCustomLayer ref="layer" :init="init" :render="draw" :visible="visible" />
    </AmapMap>
  </div>
  <p v-else>
    配置 <code>VITE_AMAP_KEY</code> 后即可预览 WebGL 自定义图层。
  </p>
</template>

<style scoped>
.gl-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.gl-map {
  width: 100%;
  height: clamp(300px, 48vw, 440px);
}
</style>
