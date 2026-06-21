# `<AmapMarkerCluster>`

声明式配置 MarkerCluster 插件，用于聚合密集点数据。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `points` | `MarkerClusterPoint[]` | 用于生成标记的普通点数据数组。 |
| `markers` | `AMap.Marker[]` | 也可以直接提供已创建的标记实例。 |
| `visible` | `boolean` | 控制聚合可见性。 |
| `options` | `Partial<AMap.MarkerClusterOptions>` | 额外 JSAPI 选项，例如 `gridSize` 或自定义渲染器。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.MarkerCluster` | 聚合实例创建完成后触发。 |
| `click` | `any` | 聚合点点击事件。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="11" style="height: 320px">
  <AmapMarkerCluster :points="points" :options="{ gridSize: 80 }" />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <MarkerClusterComponentDemo />
</ClientOnly>

<script setup lang="ts">
import MarkerClusterComponentDemo from '../examples/MarkerClusterComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
