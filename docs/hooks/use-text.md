# `useText`

以命令式方式创建并管理 `AMap.Text` 覆盖物。

```ts
const textOverlay = useText(() => map.value, () => ({
  position: [116.397, 39.908],
  text: '你好，北京',
  style: {
    padding: '6px 10px',
    borderRadius: '12px',
    background: 'rgba(22, 119, 255, 0.92)',
    color: '#fff',
  },
  anchor: 'bottom-center',
  offset: [0, -26],
}))

textOverlay.on('click', () => {
  console.log('点击文本')
})
```

## 返回值

| 字段 | 说明 |
| --- | --- |
| `overlay` | `ShallowRef<AMap.Text \| null>`，指向文本覆盖物。 |
| `setPosition`, `setOffset`, `setText`, `setStyle`, `setZIndex`, `setExtData`, `setOptions` | 对应 JSAPI 方法的命令式 setter。 |
| `show` / `hide` | 切换可见性。 |
| `on` / `off` | 订阅或取消订阅事件。 |
| `destroy` | 移除覆盖物。 |

## 在线示例

<ClientOnly>
  <UseTextHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseTextHookDemo from '../examples/hooks/UseTextHookDemo.vue'
</script>

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
