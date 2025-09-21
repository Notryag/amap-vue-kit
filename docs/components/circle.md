# `<AmapCircle>`

Render geofenced regions or coverage areas using circles.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `center` | `LngLatLike` | Circle center. |
| `radius` | `number` | Radius in meters. |
| `options` | `Partial<AMap.CircleOptions>` | Extra JSAPI options. |
| `visible` | `boolean` | Controls visibility. |
| `extData` | `any` | Arbitrary metadata. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.Circle` | Fired when the circle is created. |
| `click` | `any` | Click events. |
| `mouseover` | `any` | Pointer enter events. |
| `mouseout` | `any` | Pointer leave events. |

## Usage

```vue
<AmapCircle
  :center="[116.397, 39.908]"
  :radius="500"
  :options="{ strokeColor: '#ff6a00', fillColor: 'rgba(255,106,0,0.1)' }"
/>
```
