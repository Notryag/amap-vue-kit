# `<AmapContextMenu>`

为地图右键交互添加上下文操作。`<AmapContextMenu>` 封装 `AMap.ContextMenu`，保持菜单项响应式，并通过 `ref` 暴露命令式辅助方法。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `ContextMenuItem[]` | `[]` | 按顺序渲染的菜单项。每项定义 `text`、`handler` 和可选插入位置 `index`。 |
| `options` | `Partial<AMap.ContextMenuOptions>` | `{}` | 额外 JSAPI 配置，例如 `width` 或 `isCustom`。 |
| `bindMapRightClick` | `boolean` | `true` | 自动监听地图 `rightclick` 事件并打开菜单；需要手动控制时可关闭。 |
| `loadOptions` | `MaybeRefOrGetter<Partial<LoaderOptions> \| undefined>` | – | 实例化菜单时使用的自定义 loader 配置，例如插件或安全密钥。 |

## 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `ready` | `AMap.ContextMenu` | 右键菜单创建后触发一次。 |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="12" class="map-shell" @ready="map => (mapRef = map)">
  <AmapContextMenu
    ref="menuRef"
    :items="[
      { text: '放大', handler: () => mapRef?.zoomIn?.() },
      { text: '移动到这里', handler: event => mapRef?.setCenter?.(event.lnglat) },
    ]"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <ContextMenuComponentDemo />
</ClientOnly>

<script setup lang="ts">
import ContextMenuComponentDemo from '../examples/ContextMenuComponentDemo.vue'
</script>

### TypeScript 签名

```ts
export interface ContextMenuItem {
  text: string
  handler: (event: any) => void
  index?: number
}

export interface ContextMenuProps {
  items?: ContextMenuItem[]
  options?: Partial<AMap.ContextMenuOptions>
  bindMapRightClick?: boolean
  loadOptions?: MaybeRefOrGetter<Partial<LoaderOptions> | undefined>
}
```

### 常见错误

- `bindMapRightClick` 为 `true` 时组件会自动绑定监听器；请确保菜单被销毁或地图被卸载，避免重复处理。
- 菜单会惰性创建；调用 `open` 等命令式方法前，请使用 `ref` + `onMounted` 或等待 `ready` 事件。
- 为菜单项处理函数提供稳定引用，方便响应式 diff 正确更新。

### 在线示例

[在 StackBlitz 打开示例](https://stackblitz.com/github/Notryag/amap-vue-kit/tree/main/examples/basic)
