# `<AmapCircle>`

使用圆形渲染地理围栏或覆盖范围。

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `center` | `LngLatLike` | 圆心坐标。 |
| `radius` | `number` | 半径，单位为米。 |
| `options` | `Partial<AMap.CircleOptions>` | 额外 JSAPI 配置。 |
| `visible` | `boolean` | 控制可见性。 |
| `extData` | `any` | 任意元数据。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.Circle` | 圆形创建完成后触发。 |
| `click` | `any` | 点击事件。 |
| `mouseover` | `any` | 指针移入事件。 |
| `mouseout` | `any` | 指针移出事件。 |

## 用法

```vue
<AmapCircle
  :center="[116.397, 39.908]"
  :radius="500"
  :options="{ strokeColor: '#ff6a00', fillColor: 'rgba(255,106,0,0.1)' }"
/>
```

## 在线示例

<ClientOnly>
  <CircleComponentDemo />
</ClientOnly>

<script setup lang="ts">
import CircleComponentDemo from '../examples/CircleComponentDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
