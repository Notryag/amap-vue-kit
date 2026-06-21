# 自定义瓦片

高德地图支持自定义瓦片图层，适合离线底图、行业专题图或自有瓦片服务。可以在 `ready` 回调里拿到地图实例后手动添加瓦片图层。

```ts
ready((map) => {
  const layer = new AMap.TileLayer({
    tileUrl: 'https://your-tile-server/{z}/{x}/{y}.png',
    zIndex: 10
  })
  layer.setMap(map)
})
```

如果瓦片地址、透明度或显示状态需要响应式切换，可以把图层实例放进 `shallowRef`，再在 watcher 中更新对应参数。

## 在线示例

<ClientOnly>
  <CustomTilesDemo />
</ClientOnly>

<script setup lang="ts">
import CustomTilesDemo from '../examples/advanced/CustomTilesDemo.vue'
</script>

### 说明

- 自定义瓦片建议单独放在一个图层里，方便和高德默认底图做淡入淡出或显隐切换。
- 使用第三方瓦片服务时，确认服务器允许 JSAPI 请求 PNG/JPG 资源，避免 CORS 问题。
- 如果只是切换瓦片服务商，可以配合 `useTileLayer` 和 computed `tileUrl`，无需重建地图。
