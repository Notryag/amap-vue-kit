# `useBezierCurve`

以命令式方式管理贝塞尔曲线。

```ts
const curve = useBezierCurve(() => map.value, () => ({
  path: [
    [[116.35, 39.9], [116.36, 39.94], [116.38, 39.96], [116.41, 39.97]],
  ],
  strokeColor: '#13c2c2',
}))

curve.on('click', (event) => {
  console.log('点击贝塞尔曲线', event)
})
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.BezierCurve \| null>`，指向曲线实例。 |
| `setPath`, `setOptions`, `setExtData` | 命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 监听曲线事件。 |
| `destroy` | 移除覆盖物。 |

## 在线示例

<ClientOnly>
  <UseBezierCurveHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseBezierCurveHookDemo from '../examples/hooks/UseBezierCurveHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
