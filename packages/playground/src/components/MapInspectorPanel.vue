<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import type { useMapInspector } from '../composables/useMapInspector'

defineProps<{
  inspector: ReturnType<typeof useMapInspector>
  centerText: ComputedRef<string>
  zoom: Ref<number>
}>()
</script>

<template>
  <section class="map-inspector" :class="inspector.mapInspectorStatusClass.value" aria-live="polite">
    <header class="map-inspector-header">
      <h2>Map inspector</h2>
      <span class="map-inspector-status" :class="inspector.mapInspectorStatusClass.value">
        {{ inspector.mapInspectorStatusLabel.value }}
      </span>
    </header>
    <dl class="metrics metrics-wide inspector-metrics">
      <div>
        <dt>Center</dt>
        <dd>{{ centerText.value }}</dd>
      </div>
      <div>
        <dt>Zoom</dt>
        <dd>{{ zoom.value }}</dd>
      </div>
      <div>
        <dt>Bounds</dt>
        <dd>{{ inspector.boundsText.value }}</dd>
      </div>
    </dl>
    <div class="inspector-section">
      <h3>Layers ({{ inspector.inspectorLayers.value.length }})</h3>
      <ul v-if="inspector.inspectorLayers.value.length" class="inspector-list">
        <li v-for="layer in inspector.inspectorLayers.value" :key="layer.key">
          {{ layer.label }}
        </li>
      </ul>
      <p v-else class="inspector-empty">
        Base layers only.
      </p>
    </div>
    <div class="inspector-section">
      <h3>Overlays</h3>
      <p class="inspector-count">
        <strong>{{ inspector.overlayStats.total }}</strong> active
      </p>
      <p class="inspector-subtext">
        {{ inspector.overlayStats.added }} added · {{ inspector.overlayStats.removed }} removed
      </p>
    </div>
  </section>
</template>
