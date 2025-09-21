# `<AmapInfoWindow>`

Display contextual information anchored to a map position. The component renders its default slot content inside the JSAPI info window.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `position` | `LngLatLike \| undefined` | Coordinates where the window opens. |
| `isOpen` | `boolean` | Controls whether the window is open. |
| `offset` | `AMap.Pixel \| [number, number]` | Pixel offset from the anchor. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `ready` | `AMap.InfoWindow` | Fired when the info window is created. |

## Usage

```vue
<AmapInfoWindow :position="[116.397, 39.908]" :is-open="showWindow">
  <div class="popup">
    <h4>Forbidden City</h4>
    <p>Explore the imperial palace complex in central Beijing.</p>
  </div>
</AmapInfoWindow>
```

Toggle the `isOpen` prop or call `infoWindow.open(map, position)` on the exposed instance for imperative control.
