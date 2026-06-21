# `<AmapText>`

`<AmapText>` renders `AMap.Text` overlays, allowing you to display styled labels anchored to geographic points.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike` | Coordinates of the text overlay. |
| `text` | `string` | Text content to display. |
| `textStyle` | `Record<string, any>` | Inline CSS styles applied to the text element. Prefer this prop in templates because Vue reserves `style` for DOM styling. |
| `style` | `Record<string, any>` | Deprecated compatibility alias. Avoid it in templates. |
| `offset` | `AMap.Pixel \| [number, number]` | Pixel offset relative to the anchor. |
| `anchor` | `AMap.MarkerAnchor` | Anchor alignment for the text element. |
| `zIndex` | `number` | Overlay z-index. |
| `extData` | `any` | Arbitrary metadata attached to the overlay. |
| `visible` | `boolean` | Controls visibility. |
| `options` | `Partial<AMap.TextOptions>` | Additional JSAPI options. |

## 事件

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Text` | Fired when the text instance is created. |
| `click` | `any` | Click events on the text element. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |
| `dragend` | `any` | Fired when dragging ends (if enabled). |

## 用法

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="13" style="height: 320px">
  <AmapText
    :position="[116.397, 39.908]"
    text="Chaoyang District"
    :text-style="{ padding: '6px 10px', borderRadius: '12px', background: 'rgba(22, 119, 255, 0.92)', color: '#fff' }"
    :offset="[0, -26]"
    anchor="bottom-center"
  />
</AmapMap>
```

## 在线示例

<ClientOnly>
  <TextComponentDemo />
</ClientOnly>

<script setup lang="ts">
import TextComponentDemo from '../examples/TextComponentDemo.vue'
</script>

### StackBlitz

[在 StackBlitz 打开示例](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
