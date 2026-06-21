# `useContextMenu`

在 setup 代码中控制 JSAPI 右键菜单。该组合式函数会惰性加载 `AMap.ContextMenu`，保持菜单项响应式，并暴露 `open`/`close` 方法用于命令式触发。

```ts
import { useContextMenu } from '@amap-vue/hooks'

const menu = useContextMenu(() => map.value, () => ({
  items: [
    { text: '放大', handler: () => map.value?.zoomIn?.() },
    { text: '放置标记', handler: ({ lnglat }) => console.log(lnglat) },
  ],
}))

map.value?.on('rightclick', event => menu.open(event.lnglat))
```

## 参数

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `items` | `ContextMenuItem[]` | 菜单定义。每项包含 `text`、`handler` 和可选 `index`。 |
| `options` | `Partial<AMap.ContextMenuOptions>` | 额外 JSAPI 配置。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | 创建菜单时使用的 loader 配置。 |

## 返回值

| 字段 | 说明 |
| --- | --- |
| `menu` | `ShallowRef<AMap.ContextMenu \| null>`，指向菜单实例。 |
| `open(position)` | 在 `LngLatLike` 位置打开菜单，会自动把数组坐标转换为原生 `LngLat`。 |
| `close()` | 隐藏菜单。 |
| `addItem(item)` / `removeItem(item)` | 运行时修改菜单项。 |
| `destroy()` | 销毁菜单并解绑监听器。 |
| `on(event, handler)` / `off(event, handler)` | 订阅 JSAPI 菜单事件。 |

## 在线示例

<ClientOnly>
  <UseContextMenuHookDemo />
</ClientOnly>

<script setup lang="ts">
import UseContextMenuHookDemo from '../examples/hooks/UseContextMenuHookDemo.vue'
</script>

### 使用提示

- 使用地图右键事件时，记得在 `onBeforeUnmount` 中移除监听器，或调用 `destroy()`。
- 当菜单需要使用不同 CDN 或与主地图不同的安全参数加载时，可以使用 `loadOptions`。
- 调用 `addItem`/`removeItem` 时传入稳定对象引用，可以让内部 diff 更干净。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
