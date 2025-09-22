# `<AmapText>`

`<AmapText>` renders `AMap.Text` overlays, allowing you to display styled labels anchored to geographic points.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike` | Coordinates of the text overlay. |
| `text` | `string` | Text content to display. |
| `style` | `Record<string, any>` | Inline CSS styles applied to the text element. |
| `offset` | `AMap.Pixel \| [number, number]` | Pixel offset relative to the anchor. |
| `anchor` | `AMap.MarkerAnchor` | Anchor alignment for the text element. |
| `zIndex` | `number` | Overlay z-index. |
| `extData` | `any` | Arbitrary metadata attached to the overlay. |
| `visible` | `boolean` | Controls visibility. |
| `options` | `Partial<AMap.TextOptions>` | Additional JSAPI options. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Text` | Fired when the text instance is created. |
| `click` | `any` | Click events on the text element. |
| `mouseover` | `any` | Hover enter events. |
| `mouseout` | `any` | Hover leave events. |
| `dragend` | `any` | Fired when dragging ends (if enabled). |

## Usage

```vue
<AmapMap :center="[116.397, 39.908]" :zoom="13" style="height: 320px">
  <AmapText
    :position="[116.397, 39.908]"
    text="Chaoyang District"
    :style="{ padding: '6px 10px', borderRadius: '12px', background: 'rgba(22, 119, 255, 0.92)', color: '#fff' }"
    :offset="[0, -26]"
    anchor="bottom-center"
  />
</AmapMap>
```

## Live example

<ClientOnly>
  <TextComponentDemo />
</ClientOnly>

<script setup lang="ts">
import TextComponentDemo from '../examples/TextComponentDemo.vue'
</script>

### StackBlitz

[Open the example project](https://stackblitz.com/github/your-org/amap-vue-kit/tree/main/examples/basic)
