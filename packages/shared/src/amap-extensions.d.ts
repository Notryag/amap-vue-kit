declare global {
  namespace AMap {
    type LabelsLayerZooms = [number, number]

    class Bounds {
      constructor(southWest: AMap.LngLat | [number, number], northEast: AMap.LngLat | [number, number])
      contains(lngLat: AMap.LngLat | [number, number]): boolean
      getSouthWest(): AMap.LngLat
      getNorthEast(): AMap.LngLat
    }

    interface ImageLayerOptions {
      url?: string
      bounds?: AMap.Bounds | [AMap.LngLat | [number, number], AMap.LngLat | [number, number]]
      zooms?: LabelsLayerZooms
      opacity?: number
      zIndex?: number
      visible?: boolean
      [key: string]: any
    }

    interface LabelsLayerOptions {
      zooms?: LabelsLayerZooms
      zIndex?: number
      opacity?: number
      visible?: boolean
      collision?: boolean
      allowCollision?: boolean
      declutter?: boolean
      [key: string]: any
    }

    interface LabelMarkerTextOptions {
      content?: string
      direction?: 'top' | 'right' | 'bottom' | 'left' | 'center'
      offset?: AMap.Pixel | [number, number]
      style?: Record<string, any>
    }

    interface LabelMarkerIconOptions {
      image?: string
      imageSize?: { width: number, height: number }
      size?: { width: number, height: number }
      anchor?: AMap.Pixel | [number, number]
      [key: string]: any
    }

    interface LabelMarkerOptions {
      position?: AMap.LngLat | [number, number]
      icon?: LabelMarkerIconOptions
      text?: LabelMarkerTextOptions
      zooms?: LabelsLayerZooms
      opacity?: number
      zIndex?: number
      extData?: any
      visible?: boolean
      collision?: boolean
      [key: string]: any
    }

    class ImageLayer {
      constructor(options?: ImageLayerOptions)
      setMap(map: Map | null): void
      setImageUrl(url: string): void
      setBounds(bounds: Bounds | [AMap.LngLat | [number, number], AMap.LngLat | [number, number]]): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface TextOptions {
      text?: string
      position?: AMap.LngLat | [number, number]
      offset?: AMap.Pixel | [number, number]
      style?: Record<string, any>
      anchor?: AMap.MarkerAnchor
      zIndex?: number
      extData?: any
      visible?: boolean
      draggable?: boolean
      [key: string]: any
    }

    class Text {
      constructor(options?: TextOptions)
      setMap(map: Map | null): void
      setText(text: string): void
      setStyle(style: Record<string, any>): void
      setPosition(position: AMap.LngLat | [number, number]): void
      setOffset(offset: AMap.Pixel | [number, number]): void
      setOptions(options: Partial<TextOptions>): void
      setzIndex(zIndex: number): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class LabelsLayer {
      constructor(options?: LabelsLayerOptions)
      add(markers: LabelMarker | LabelMarker[]): void
      remove(markers: LabelMarker | LabelMarker[]): void
      clear(): void
      setMap(map: Map | null): void
      setOptions(options: Partial<LabelsLayerOptions>): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class LabelMarker {
      constructor(options?: LabelMarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: AMap.LngLat | [number, number]): void
      setIcon(icon: LabelMarkerIconOptions): void
      setText(text: LabelMarkerTextOptions): void
      setZooms(zooms: LabelsLayerZooms): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class OverlayGroup {
      constructor(overlays?: any[])
      addOverlay(overlay: any): void
      addOverlays(overlays: any[]): void
      removeOverlay(overlay: any): void
      removeOverlays(overlays: any[]): void
      clearOverlays(): void
      getOverlays(): any[]
      setMap(map: Map | null): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface HeatMapOptions {
      radius?: number
      gradient?: Record<string, string>
      opacity?: [number, number]
      zooms?: [number, number]
      zIndex?: number
      [key: string]: any
    }

    interface HeatMapDataPoint {
      lng: number
      lat: number
      count: number
    }

    interface HeatMapDataSet {
      data: HeatMapDataPoint[]
      max?: number
    }

    class HeatMap {
      constructor(map: Map, options?: HeatMapOptions)
      setMap(map: Map | null): void
      setOptions(options: Partial<HeatMapOptions>): void
      setDataSet(dataSet: HeatMapDataSet): void
      addDataPoint(lng: number, lat: number, count: number): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface CircleMarkerOptions {
      center?: AMap.LngLat | [number, number]
      radius?: number
      strokeColor?: string
      strokeWeight?: number
      strokeOpacity?: number
      fillColor?: string
      fillOpacity?: number
      zIndex?: number
      visible?: boolean
      cursor?: string
      extData?: any
      [key: string]: any
    }

    class CircleMarker {
      constructor(options?: CircleMarkerOptions)
      setMap(map: Map | null): void
      setCenter(center: AMap.LngLat | [number, number]): void
      setRadius(radius: number): void
      setOptions(options: Partial<CircleMarkerOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface RectangleOptions extends Partial<AMap.PolygonOptions> {
      bounds?: AMap.Bounds | [AMap.LngLat | [number, number], AMap.LngLat | [number, number]]
      visible?: boolean
      extData?: any
      [key: string]: any
    }

    class Rectangle {
      constructor(options?: RectangleOptions)
      setMap(map: Map | null): void
      setBounds(bounds: RectangleOptions['bounds']): void
      setOptions(options: Partial<RectangleOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface EllipseOptions extends Partial<AMap.CircleOptions> {
      radius?: [number, number]
      visible?: boolean
      extData?: any
      [key: string]: any
    }

    class Ellipse {
      constructor(options?: EllipseOptions)
      setMap(map: Map | null): void
      setCenter(center: AMap.LngLat | [number, number]): void
      setRadius(radius: [number, number]): void
      setOptions(options: Partial<EllipseOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface ElasticMarkerIconStyle {
      img?: string
      size?: [number, number]
      anchor?: [number, number]
      imageSize?: [number, number]
    }

    interface ElasticMarkerLabelStyle {
      content?: string
      position?: 'top' | 'right' | 'bottom' | 'left' | 'center'
      offset?: [number, number]
      style?: Record<string, any>
    }

    interface ElasticMarkerStyleDefinition {
      icon?: ElasticMarkerIconStyle
      label?: ElasticMarkerLabelStyle
    }

    type ElasticMarkerStyles = Record<number, ElasticMarkerStyleDefinition>

    interface ElasticMarkerOptions {
      position?: AMap.LngLat | [number, number]
      styles?: ElasticMarkerStyles
      zoomStyleMapping?: Record<number, number>
      extData?: any
      visible?: boolean
      cursor?: string
      draggable?: boolean
      zIndex?: number
      [key: string]: any
    }

    class ElasticMarker {
      constructor(options?: ElasticMarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: AMap.LngLat | [number, number]): void
      setOptions(options: Partial<ElasticMarkerOptions>): void
      setStyles(styles: ElasticMarkerStyles): void
      setZoomStyleMapping(mapping: Record<number, number>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface BezierCurveOptions {
      path?: BezierCurvePath
      extData?: any
      visible?: boolean
      strokeColor?: string
      strokeWeight?: number
      [key: string]: any
    }

    class BezierCurve {
      constructor(options?: BezierCurveOptions)
      setMap(map: Map | null): void
      setPath(path: BezierCurvePath): void
      setOptions(options: Partial<BezierCurveOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface MarkerClusterOptions {
      gridSize?: number
      maxZoom?: number
      averageCenter?: boolean
      styles?: any[]
      renderClusterMarker?: (context: { marker: AMap.Marker, count: number }) => void
      renderMarker?: (context: { marker: AMap.Marker }) => void
      [key: string]: any
    }

    class MarkerCluster {
      constructor(map: Map, markers?: AMap.Marker[] | AMap.Marker, options?: MarkerClusterOptions)
      setMap(map: Map | null): void
      addMarker(marker: AMap.Marker): void
      addMarkers(markers: AMap.Marker[]): void
      removeMarker(marker: AMap.Marker): void
      removeMarkers(markers: AMap.Marker[]): void
      clearMarkers(): void
      setMarkers(markers: AMap.Marker[]): void
      setOptions(options: Partial<MarkerClusterOptions>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface MouseToolDrawOptions {
      [key: string]: any
    }

    class MouseTool {
      constructor(map: Map)
      circle(options?: MouseToolDrawOptions): Circle
      rectangle(options?: MouseToolDrawOptions): Rectangle
      polygon(options?: MouseToolDrawOptions): Polygon
      polyline(options?: MouseToolDrawOptions): Polyline
      bezierCurve(options?: MouseToolDrawOptions): BezierCurve
      ellipse(options?: MouseToolDrawOptions): Ellipse
      close(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    interface ContextMenuOptions {
      width?: number
      isCustom?: boolean
      [key: string]: any
    }

    class ContextMenu {
      constructor(options?: ContextMenuOptions)
      addItem(text: string, handler: (event: any) => void, index?: number): void
      removeItem(text: string, handler: (event: any) => void): void
      open(map: Map, position: AMap.LngLat | [number, number]): void
      close(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    interface CircleEditorOptions {
      [key: string]: any
    }

    class CircleEditor {
      constructor(map: Map, circle: Circle, options?: CircleEditorOptions)
      open(): void
      close(): void
      setTarget(circle: Circle | null): void
      getTarget(): Circle | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface RectangleEditorOptions {
      [key: string]: any
    }

    class RectangleEditor {
      constructor(map: Map, rectangle: Rectangle, options?: RectangleEditorOptions)
      open(): void
      close(): void
      setTarget(rectangle: Rectangle | null): void
      getTarget(): Rectangle | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface EllipseEditorOptions {
      [key: string]: any
    }

    class EllipseEditor {
      constructor(map: Map, ellipse: Ellipse, options?: EllipseEditorOptions)
      open(): void
      close(): void
      setTarget(ellipse: Ellipse | null): void
      getTarget(): Ellipse | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface PolylineEditorOptions {
      [key: string]: any
    }

    class PolylineEditor {
      constructor(map: Map, polyline: Polyline, options?: PolylineEditorOptions)
      open(): void
      close(): void
      setTarget(polyline: Polyline | null): void
      getTarget(): Polyline | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface BezierCurveEditorOptions {
      [key: string]: any
    }

    class BezierCurveEditor {
      constructor(map: Map, curve: BezierCurve, options?: BezierCurveEditorOptions)
      open(): void
      close(): void
      setTarget(curve: BezierCurve | null): void
      getTarget(): BezierCurve | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface PolygonEditorOptions {
      [key: string]: any
    }

    class PolygonEditor {
      constructor(map: Map, polygon: Polygon, options?: PolygonEditorOptions)
      open(): void
      close(): void
      setTarget(polygon: Polygon | null): void
      getTarget(): Polygon | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }
  }
}

export {}
