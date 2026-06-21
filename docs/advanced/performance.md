# 性能指南

1. **批量更新**：优先通过响应式 props 和 watcher 更新状态，避免在循环里频繁直接操作覆盖物。组件内部会把更新排进微任务。
2. **复用 loader**：在应用启动时调用一次 `loader.config`，不要在每张地图里传入相互冲突的插件数组，避免重复网络请求。
3. **优先使用海量点能力**：超过 1,000 个点时优先使用 `useMassMarkers` 或点聚合，普通 Marker 更适合小批量覆盖物。
4. **启用 WebGL 能力**：需要 3D 或可视化效果时设置 `viewMode="3D"`，并按需配置 `pitch` 和 `rotation`。
5. **正确销毁实例**：组件和 hooks 会自动清理；如果你手动创建原生 JSAPI 实例，请在离开页面时调用 `destroy`，避免内存泄漏。

## 在线示例

<ClientOnly>
  <PerformancePlaygroundDemo />
</ClientOnly>

<script setup lang="ts">
import PerformancePlaygroundDemo from '../examples/advanced/PerformancePlaygroundDemo.vue'
</script>
