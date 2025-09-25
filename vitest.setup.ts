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

class Bounds {
  public southWest: LngLat
  public northEast: LngLat

  constructor(southWest: LngLat | [number, number], northEast: LngLat | [number, number]) {
    this.southWest = southWest instanceof LngLat ? southWest : new LngLat(southWest[0], southWest[1])
    this.northEast = northEast instanceof LngLat ? northEast : new LngLat(northEast[0], northEast[1])
  }

  getSouthWest() {
    return this.southWest
  }

  getNorthEast() {
    return this.northEast
  }

  contains(lngLat: LngLat | [number, number]) {
    const point = lngLat instanceof LngLat ? lngLat : new LngLat(lngLat[0], lngLat[1])
    return point.lng >= this.southWest.lng
      && point.lng <= this.northEast.lng
      && point.lat >= this.southWest.lat
      && point.lat <= this.northEast.lat
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

  setContent(content: any) {
    this.options.content = content
  }

  setAnchor(anchor: any) {
    this.options.anchor = anchor
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

class Text extends EventTarget {
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

  setText(text: any) {
    this.options.text = text
  }

  setStyle(style: any) {
    this.options.style = { ...(this.options.style ?? {}), ...style }
  }

  setPosition(position: any) {
    this.options.position = position
  }

  setOffset(offset: any) {
    this.options.offset = offset
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
  }

  setExtData(extData: any) {
    this.options.extData = extData
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

class LabelMarker extends EventTarget {
  public layer: any = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
  }

  setMap(_map: Map | null) {}

  setPosition(position: any) {
    this.options.position = position
  }

  setIcon(icon: any) {
    this.options.icon = icon
  }

  setText(text: any) {
    this.options.text = text
  }

  setZooms(zooms: [number, number]) {
    this.options.zooms = zooms
  }

  setOpacity(opacity: number) {
    this.options.opacity = opacity
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
  }

  setExtData(extData: any) {
    this.options.extData = extData
  }

  show() {
    this.options.visible = true
  }

  hide() {
    this.options.visible = false
  }

  destroy() {
    this.layer = null
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

class BezierCurve extends EventTarget {
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
    this.options = { visible: true, ...options }
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

class Rectangle extends EventTarget {
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

  setBounds(bounds: any) {
    this.options.bounds = bounds
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setExtData(extData: any) {
    this.options.extData = extData
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

class Ellipse extends EventTarget {
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

  setCenter(center: any) {
    this.options.center = center
  }

  setRadius(radius: [number, number]) {
    this.options.radius = radius
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setExtData(extData: any) {
    this.options.extData = extData
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

class CircleMarker extends EventTarget {
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

  setExtData(extData: any) {
    this.options.extData = extData
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

class ImageLayer extends EventTarget {
  public map: Map | null = null
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { visible: true, ...options }
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setImageUrl(url: string) {
    this.options.url = url
  }

  setBounds(bounds: any) {
    this.options.bounds = bounds
  }

  setOpacity(opacity: number) {
    this.options.opacity = opacity
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
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

class LabelsLayer extends EventTarget {
  public map: Map | null = null
  public options: any
  public markers = new Set<LabelMarker>()

  constructor(options: any = {}) {
    super()
    this.options = { visible: true, ...options }
  }

  setMap(map: Map | null) {
    this.map = map
  }

  add(markers: LabelMarker | LabelMarker[]) {
    const items = Array.isArray(markers) ? markers : [markers]
    items.forEach((marker) => {
      this.markers.add(marker)
      marker.layer = this
      if (this.options.visible === false)
        marker.hide()
      else
        marker.show()
    })
  }

  remove(markers: LabelMarker | LabelMarker[]) {
    const items = Array.isArray(markers) ? markers : [markers]
    items.forEach((marker) => {
      if (this.markers.has(marker)) {
        this.markers.delete(marker)
        marker.layer = null
      }
    })
  }

  clear() {
    for (const marker of Array.from(this.markers))
      marker.layer = null
    this.markers.clear()
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setOpacity(opacity: number) {
    this.options.opacity = opacity
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
  }

  show() {
    this.options.visible = true
    this.markers.forEach(marker => marker.show())
  }

  hide() {
    this.options.visible = false
    this.markers.forEach(marker => marker.hide())
  }

  destroy() {
    this.clear()
    this.map = null
  }
}

class ElasticMarker extends EventTarget {
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

  setPosition(position: any) {
    this.options.position = position
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setStyles(styles: any) {
    this.options.styles = styles
  }

  setZoomStyleMapping(mapping: Record<number, number>) {
    this.options.zoomStyleMapping = mapping
  }

  setExtData(extData: any) {
    this.options.extData = extData
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

class MarkerCluster extends EventTarget {
  public map: Map | null
  public markers: AMap.Marker[]
  public options: any

  constructor(map: Map, markers: AMap.Marker[] | AMap.Marker = [], options: any = {}) {
    super()
    this.map = map
    this.markers = Array.isArray(markers) ? [...markers] : [markers]
    this.options = { ...options }
  }

  setMap(map: Map | null) {
    this.map = map
  }

  addMarker(marker: AMap.Marker) {
    this.markers.push(marker)
  }

  addMarkers(markers: AMap.Marker[]) {
    this.markers.push(...markers)
  }

  removeMarker(marker: AMap.Marker) {
    this.markers = this.markers.filter(item => item !== marker)
  }

  removeMarkers(markers: AMap.Marker[]) {
    markers.forEach(marker => this.removeMarker(marker))
  }

  clearMarkers() {
    this.markers = []
  }

  setMarkers(markers: AMap.Marker[]) {
    this.markers = [...markers]
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  destroy() {
    this.clearMarkers()
    this.map = null
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

class OverlayGroup extends EventTarget {
  public map: Map | null = null
  public overlays: any[]
  public visible = true
  public extData: any

  constructor(overlays: any[] = []) {
    super()
    this.overlays = [...overlays]
  }

  setMap(map: Map | null) {
    this.map = map
  }

  addOverlay(overlay: any) {
    if (overlay == null)
      return
    if (!this.overlays.includes(overlay))
      this.overlays.push(overlay)
  }

  addOverlays(overlays: any[]) {
    overlays?.forEach(overlay => this.addOverlay(overlay))
  }

  removeOverlay(overlay: any) {
    this.overlays = this.overlays.filter(item => item !== overlay)
  }

  removeOverlays(overlays: any[]) {
    overlays?.forEach(overlay => this.removeOverlay(overlay))
  }

  clearOverlays() {
    this.overlays = []
  }

  getOverlays() {
    return [...this.overlays]
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  setExtData(extData: any) {
    this.extData = extData
  }

  destroy() {
    this.clearOverlays()
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

class MouseTool extends EventTarget {
  public map: Map
  public lastOverlay: any

  constructor(map: Map) {
    super()
    this.map = map
  }

  circle(options: any = {}) {
    const overlay = new Circle({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  rectangle(options: any = {}) {
    const overlay = new Rectangle({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  polygon(options: any = {}) {
    const overlay = new Polygon({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  polyline(options: any = {}) {
    const overlay = new Polyline({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  bezierCurve(options: any = {}) {
    const overlay = new BezierCurve({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  ellipse(options: any = {}) {
    const overlay = new Ellipse({ ...options, map: this.map })
    overlay.setMap(this.map)
    this.lastOverlay = overlay
    this.emit('draw', { obj: overlay })
    return overlay
  }

  close() {
    this.lastOverlay = null
  }
}

class ContextMenu extends EventTarget {
  public items: Array<{ text: string, handler: (event: any) => void }>
  public map: Map | null = null
  public position: any
  public opened = false
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
    this.items = []
  }

  addItem(text: string, handler: (event: any) => void, index?: number) {
    const item = { text, handler }
    if (typeof index === 'number')
      this.items.splice(index, 0, item)
    else
      this.items.push(item)
  }

  removeItem(text: string, handler: (event: any) => void) {
    this.items = this.items.filter(item => item.text !== text || item.handler !== handler)
  }

  open(map: Map, position: any) {
    this.map = map
    this.position = position
    this.opened = true
    this.emit('open', { position })
  }

  close() {
    this.opened = false
    this.emit('close', {})
  }
}

class BaseEditor<TTarget> extends EventTarget {
  public map: Map
  public target: TTarget | null
  public options: any
  public active = false

  constructor(map: Map, target: TTarget | null, options: any = {}) {
    super()
    this.map = map
    this.target = target
    this.options = { ...options }
  }

  open() {
    this.active = true
    this.emit('open', { target: this.target })
  }

  close() {
    this.active = false
    this.emit('close', { target: this.target })
  }

  setTarget(target: TTarget | null) {
    this.target = target
  }

  getTarget(): TTarget | null {
    return this.target
  }

  setOptions(options: Record<string, any>) {
    this.options = { ...this.options, ...options }
  }

  destroy() {
    this.close()
    this.target = null
  }
}

class CircleEditor extends BaseEditor<Circle> {}
class RectangleEditor extends BaseEditor<Rectangle> {}
class EllipseEditor extends BaseEditor<Ellipse> {}
class PolylineEditor extends BaseEditor<Polyline> {}
class BezierCurveEditor extends BaseEditor<BezierCurve> {}
class PolygonEditor extends BaseEditor<Polygon> {}

class DistrictLayerBase extends EventTarget {
  public map: Map | null = null
  public options: any
  public visible = true

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
  }

  setMap(map: Map | null) {
    this.map = map
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  setStyles(styles: any) {
    this.options.styles = styles
  }

  setDistricts(adcode: any) {
    this.options.adcode = adcode
  }

  setZooms(zooms: [number, number]) {
    this.options.zooms = zooms
  }

  setzIndex(zIndex: number) {
    this.options.zIndex = zIndex
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  destroy() {
    this.map = null
  }
}

class DistrictLayerWorld extends DistrictLayerBase {}
class DistrictLayerCountry extends DistrictLayerBase {}
class DistrictLayerProvince extends DistrictLayerBase {}
class DistrictLayerCity extends DistrictLayerBase {}
class DistrictLayerDistrict extends DistrictLayerBase {}

class DistrictLayerMain extends DistrictLayerBase {}
;(DistrictLayerMain as any).World = DistrictLayerWorld
;(DistrictLayerMain as any).Country = DistrictLayerCountry
;(DistrictLayerMain as any).Province = DistrictLayerProvince
;(DistrictLayerMain as any).City = DistrictLayerCity
;(DistrictLayerMain as any).District = DistrictLayerDistrict

class GeoJSON extends OverlayGroup {
  public options: any
  public data: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
    this.data = options.geoJSON ?? null
  }

  importData(data: any) {
    this.data = data
  }

  toGeoJSON() {
    if (Array.isArray(this.data))
      return this.data
    if (this.data)
      return [this.data]
    return []
  }
}

class Geocoder extends EventTarget {
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  getLocation(address: string, callback: (status: string, result: any) => void) {
    callback('complete', {
      info: 'OK',
      geocodes: [{ formattedAddress: address, location: new LngLat(116.39, 39.9) }],
    })
  }

  getAddress(lngLat: LngLat, callback: (status: string, result: any) => void) {
    callback('complete', {
      info: 'OK',
      regeocode: {
        formattedAddress: `地址(${lngLat.getLng()}, ${lngLat.getLat()})`,
        addressComponent: {
          province: '北京市',
          city: '北京市',
          district: '东城区',
          streetNumber: { street: '长安街', number: '1号' },
        },
        pois: [
          { id: 'poi-1', name: '天安门广场', location: new LngLat(116.397, 39.908) },
        ],
      },
    })
  }
}

class Geolocation extends EventTarget {
  public options: any
  private counter = 1
  private watchers = new ListenerMap<number, (result: any) => void>()

  constructor(options: any = {}) {
    super()
    this.options = { enableHighAccuracy: true, ...options }
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }

  getCurrentPosition(callback: (status: string, result: any) => void) {
    callback('complete', {
      position: new LngLat(116.39, 39.9),
      accuracy: 10,
      info: 'OK',
    })
  }

  watchPosition(callback: (status: string, result: any) => void) {
    const id = this.counter++
    this.watchers.set(id, result => callback('complete', result))
    callback('complete', {
      position: new LngLat(116.39, 39.9),
      accuracy: 10,
      info: 'OK',
    })
    return id
  }

  clearWatch(id: number) {
    this.watchers.delete(id)
  }

  getCityInfo(callback: (status: string, result: any) => void) {
    callback('complete', {
      city: '北京市',
      province: '北京市',
      citycode: '010',
    })
  }
}

class Weather extends EventTarget {
  getLive(city: string, callback: (status: string, result: any) => void) {
    callback('complete', {
      city,
      province: '北京',
      adcode: '110000',
      weather: '晴',
      temperature: '25',
      windDirection: '东',
      windPower: '3级',
      humidity: '60',
      reportTime: '2024-01-01 10:00:00',
    })
  }

  getForecast(city: string, callback: (status: string, result: any) => void) {
    callback('complete', {
      city,
      province: '北京',
      adcode: '110000',
      forecasts: [
        { date: '2024-01-01', week: '周一', dayWeather: '晴', nightWeather: '多云', dayTemp: '26', nightTemp: '18' },
        { date: '2024-01-02', week: '周二', dayWeather: '多云', nightWeather: '阵雨', dayTemp: '24', nightTemp: '17' },
      ],
    })
  }
}

class AutoComplete extends EventTarget {
  public options: any

  constructor(options: any = {}) {
    super()
    this.options = { ...options }
  }

  search(keyword: string, callback: (status: string, result: any) => void) {
    if (!keyword) {
      callback('no_data', { info: 'NO_DATA', tips: [] })
      return
    }
    const tips = [
      {
        id: `${keyword}-1`,
        name: `${keyword}中心`,
        district: '北京市',
        adcode: '110000',
        address: `${keyword}大街1号`,
        location: new LngLat(116.397, 39.909),
      },
      {
        id: `${keyword}-2`,
        name: `${keyword}地铁站`,
        district: '北京市',
        adcode: '110000',
        address: `${keyword}路`,
        location: new LngLat(116.405, 39.92),
      },
    ]
    callback('complete', { info: 'OK', tips })
  }

  setCity(city: string) {
    this.options.city = city
  }

  setType(type: string) {
    this.options.type = type
  }

  setCityLimit(limit: boolean) {
    this.options.citylimit = limit
  }

  setLanguage(lang: string) {
    this.options.lang = lang
  }

  setDataType(datatype: string) {
    this.options.datatype = datatype
  }

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }
}

class PlaceSearch extends EventTarget {
  public options: any
  public map: Map | null

  constructor(options: any = {}) {
    super()
    this.options = { pageIndex: 1, pageSize: 10, ...options }
    this.map = options.map ?? null
  }

  private buildPois(keyword: string) {
    const baseLng = 116.397
    const baseLat = 39.909
    const count = this.options.pageSize ?? 10
    const startIndex = ((this.options.pageIndex ?? 1) - 1) * count
    return Array.from({ length: count }, (_, index) => {
      const offset = (startIndex + index) * 0.001
      return {
        id: `${keyword}-${startIndex + index + 1}`,
        name: `${keyword} POI ${startIndex + index + 1}`,
        type: '餐饮服务',
        typecode: '050000',
        address: `${keyword}路${startIndex + index + 1}号`,
        district: '北京市',
        adcode: '110000',
        location: new LngLat(baseLng + offset, baseLat + offset),
      }
    })
  }

  search(keyword: string, callback: (status: string, result: any) => void) {
    if (!keyword) {
      callback('no_data', { info: 'NO_DATA', poiList: { count: 0, pageIndex: 1, pageSize: this.options.pageSize ?? 10, pois: [] } })
      return
    }
    const pois = this.buildPois(keyword)
    callback('complete', {
      info: 'OK',
      poiList: {
        count: 50,
        pageIndex: this.options.pageIndex ?? 1,
        pageSize: this.options.pageSize ?? 10,
        pois,
      },
    })
  }

  searchNearBy(keyword: string, _center: any, _radius: number, callback: (status: string, result: any) => void) {
    this.search(keyword, callback)
  }

  searchInBounds(keyword: string, _bounds: any, callback: (status: string, result: any) => void) {
    this.search(keyword, callback)
  }

  getDetails(poiId: string, callback: (status: string, result: any) => void) {
    const poi = {
      id: poiId,
      name: `详情 ${poiId}`,
      address: `${poiId} 地址`,
      district: '北京市',
      adcode: '110000',
      location: new LngLat(116.397, 39.909),
    }
    callback('complete', {
      info: 'OK',
      poiList: {
        count: 1,
        pageIndex: 1,
        pageSize: 1,
        pois: [poi],
      },
    })
  }

  setCity(city: string) {
    this.options.city = city
  }

  setType(type: string) {
    this.options.type = type
  }

  setPageIndex(pageIndex: number) {
    this.options.pageIndex = pageIndex
  }

  setPageSize(pageSize: number) {
    this.options.pageSize = pageSize
  }

  setMap(map: Map | null) {
    this.map = map
  }

  clear() {}

  setOptions(options: any) {
    this.options = { ...this.options, ...options }
  }
}

Object.assign(globalThis, {
  AMap: {
    Map,
    Marker,
    CircleMarker,
    Text,
    LabelMarker,
    InfoWindow,
    Polyline,
    BezierCurve,
    Polygon,
    Circle,
    Rectangle,
    Ellipse,
    TileLayer,
    ImageLayer,
    LabelsLayer,
    ToolBar,
    Scale,
    ControlBar,
    MapType: MapTypeControl,
    OverlayGroup,
    MassMarks,
    MouseTool,
    ContextMenu,
    CircleEditor,
    RectangleEditor,
    EllipseEditor,
    PolylineEditor,
    BezierCurveEditor,
    PolygonEditor,
    DistrictLayer: DistrictLayerMain,
    GeoJSON,
    Geocoder,
    Geolocation,
    Weather,
    AutoComplete,
    PlaceSearch,
    LngLat,
    Pixel,
    Bounds,
    ElasticMarker,
    MarkerCluster,
  },
})

loader.config({ key: 'test-key' })
