import { loader } from '@amap-vue/shared'

const ListenerMap = globalThis.Map
const ListenerSet = globalThis.Set

class EventTarget {
  private listeners = new ListenerMap<string, Set<(event: any) => void>>()

  on(event: string, handler: (event: any) => void) {
    if (!this.listeners.has(event))
      this.listeners.set(event, new ListenerSet())
    this.listeners.get(event)!.add(handler)
  }

  off(event: string, handler: (event: any) => void) {
    this.listeners.get(event)?.delete(handler)
  }

  emit(event: string, payload: any) {
    this.listeners.get(event)?.forEach(handler => handler(payload))
  }
}

class LngLat {
  constructor(public lng: number, public lat: number) {}
  getLng() {
    return this.lng
  }

  getLat() {
    return this.lat
  }
}

class Pixel {
  constructor(public x: number, public y: number) {}
  getX() {
    return this.x
  }

  getY() {
    return this.y
  }
}

class Map extends EventTarget {
  public options: any
  public status: Record<string, any> = {}
  public destroyed = false
  public controls = new Set<any>()

  constructor(public container: HTMLElement, options: any = {}) {
    super()
    this.options = { ...options }
  }

  setCenter(value: any) {
    if (value && typeof value.getLng === 'function' && typeof value.getLat === 'function')
      this.options.center = [value.getLng(), value.getLat()]
    else
      this.options.center = value
  }

  setZoom(value: number) {
    this.options.zoom = value
  }

  setPitch(value: number) {
    this.options.pitch = value
  }

  setRotation(value: number) {
    this.options.rotation = value
  }

  setMapStyle(value: string) {
    this.options.mapStyle = value
  }

  setTheme(value: string) {
    this.options.theme = value
  }

  setStatus(status: Record<string, any>) {
    this.status = { ...this.status, ...status }
  }

  addControl(control: any) {
    this.controls.add(control)
    control.setMap?.(this)
  }

  removeControl(control: any) {
    if (this.controls.has(control)) {
      this.controls.delete(control)
      control.setMap?.(null)
    }
  }

  destroy() {
    this.destroyed = true
  }
}

class Marker extends EventTarget {
  public map: Map | null
  public options: any

  constructor(options: any = {}) {
    super()
    this.map = options.map ?? null
    this.options = { ...options }
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setPosition(position: any) {
    if (position && typeof position.getLng === 'function' && typeof position.getLat === 'function')
      this.options.position = [position.getLng(), position.getLat()]
    else
      this.options.position = position
  }

  setIcon(icon: any) {
    this.options.icon = icon
  }

  setLabel(label: any) {
    this.options.label = label
  }

  setExtData(extData: any) {
    this.options.extData = extData
  }

  setDraggable(draggable: boolean) {
    this.options.draggable = draggable
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
  }

  setOffset(offset: any) {
    this.options.offset = offset
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.map = null
  }
}

class InfoWindow {
  public content: any
  public offset: any
  public opened = false
  public position: any
  public map: Map | null = null

  constructor(options: any = {}) {
    this.content = options.content
    this.offset = options.offset
  }

  setContent(content: any) {
    this.content = content
  }

  setOffset(offset: any) {
    this.offset = offset
  }

  setPosition(position: any) {
    this.position = position
  }

  open(map: Map, position: any) {
    this.map = map
    this.position = position
    this.opened = true
  }

  close() {
    this.opened = false
    this.map = null
  }
}

class Polyline extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setPath(path: any) {
    this.options.path = path
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.map = null
  }
}

class Polygon extends Polyline {}

class Circle extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setCenter(center: any) {
    this.options.center = center
  }

  setRadius(radius: number) {
    this.options.radius = radius
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.map = null
  }
}

class TileLayer extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { visible: true, ...options }
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setOpacity(alpha: number) {
    this.options.opacity = alpha
  }

  setzIndex(index: number) {
    this.options.zIndex = index
  }

  setTileUrl(url: any) {
    this.options.tileUrl = url
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  reload() {
    this.options.reloaded = (this.options.reloaded ?? 0) + 1
  }

  destroy() {
    this.map = null
  }
}

TileLayer.Satellite = class SatelliteTileLayer extends TileLayer {}
TileLayer.RoadNet = class RoadNetTileLayer extends TileLayer {}
TileLayer.Traffic = class TrafficTileLayer extends TileLayer {
  constructor(options: any = {}) {
    super(options)
  }
}

class ToolBar extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { visible: true, ...options }
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setOffset(offset: any) {
    this.options.offset = offset
  }

  setPosition(position: any) {
    this.options.position = position
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.map = null
  }
}

class Scale extends ToolBar {}

class ControlBar extends ToolBar {}

class MapTypeControl extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { visible: true, ...options }
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.map = null
  }
}

class MassMarks extends EventTarget {
  public map: Map | null = null
  public data: any
  public style: any

  constructor(data: any[] = [], options: any = {}) {
    super()
    this.data = data
    this.style = options.style
    this.map = options.map ?? null
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setData(data: any[]) {
    this.data = data
  }

  setStyle(style: any) {
    this.style = style
  }

  destroy() {
    this.map = null
  }
}

Object.assign(globalThis, {
  AMap: {
    Map,
    Marker,
    InfoWindow,
    Polyline,
    Polygon,
    Circle,
    TileLayer,
    ToolBar,
    Scale,
    ControlBar,
    MapType: MapTypeControl,
    MassMarks,
    LngLat,
    Pixel,
  },
})

loader.config({ key: 'test-key' })
