declare global {
  namespace AMap {
    type MapViewMode = '2D' | '3D'
    type MarkerAnchor = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
    type InfoWindowAnchor = MarkerAnchor
    type LabelsLayerZooms = [number, number]
    type LngLatLike = LngLat | [number, number]
    type BoundsLike = Bounds | [LngLatLike, LngLatLike]
    type BezierCurvePath = LngLatLike[][]
    type RouteEndpoint = LngLatLike | string

    interface Evented {
      on: (event: string, handler: (event: any) => void) => void
      off: (event: string, handler: (event: any) => void) => void
    }

    interface Destroyable {
      destroy?: () => void
    }

    interface BaseOptions {
      [key: string]: any
    }

    interface OverlayLike extends Evented, Destroyable {
      setMap: (map: Map | null) => void
      show: () => void
      hide: () => void
    }

    interface MapOptions extends BaseOptions {
      center?: LngLatLike
      zoom?: number
      viewMode?: MapViewMode
      pitch?: number
      rotation?: number
      mapStyle?: string
      theme?: string
    }

    class Map implements Evented {
      constructor(container: string | HTMLElement, options?: MapOptions)
      setCenter(center: LngLatLike): void
      getCenter(): LngLat
      setZoom(zoom: number): void
      getZoom(): number
      zoomIn?(): void
      zoomOut?(): void
      setPitch?(pitch: number): void
      setRotation?(rotation: number): void
      setMapStyle?(style: string): void
      add(overlay: any | any[]): void
      remove(overlay: any | any[]): void
      addLayer?(layer: any): void
      removeLayer?(layer: any): void
      addControl?(control: any): void
      removeControl?(control: any): void
      plugin?(plugins: string | string[], callback: () => void): void
      destroy(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    class LngLat {
      constructor(lng: number, lat: number)
      getLng(): number
      getLat(): number
    }

    class Pixel {
      constructor(x: number, y: number)
      getX(): number
      getY(): number
    }

    class Size {
      constructor(width: number, height: number)
      getWidth(): number
      getHeight(): number
    }

    class Bounds {
      constructor(southWest: LngLatLike, northEast: LngLatLike)
      contains(lngLat: LngLatLike): boolean
      getSouthWest(): LngLat
      getNorthEast(): LngLat
    }

    interface MarkerLabelOptions extends BaseOptions {
      content?: string
      direction?: 'top' | 'right' | 'bottom' | 'left' | 'center'
      offset?: Pixel | [number, number]
    }

    interface MarkerOptions extends BaseOptions {
      position?: LngLatLike
      label?: string | MarkerLabelOptions
      icon?: string | Icon
      offset?: Pixel | [number, number]
      anchor?: MarkerAnchor
      zIndex?: number
      extData?: any
      visible?: boolean
      draggable?: boolean
    }

    class Marker implements OverlayLike {
      constructor(options?: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: LngLatLike): void
      setLabel(label: string | MarkerLabelOptions): void
      setIcon(icon: string | Icon): void
      setOffset(offset: Pixel | [number, number]): void
      setDraggable(draggable: boolean): void
      setzIndex(zIndex: number): void
      setOptions(options: Partial<MarkerOptions>): void
      setExtData(extData: any): void
      moveAlong?(path: LngLatLike[], options?: BaseOptions): void
      pauseMove?(): void
      resumeMove?(): void
      stopMove?(): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface IconOptions extends BaseOptions {
      image?: string
      imageSize?: Size | [number, number]
      size?: Size | [number, number]
    }

    class Icon {
      constructor(options?: IconOptions)
    }

    interface InfoWindowOptions extends BaseOptions {
      content?: string | HTMLElement
      offset?: Pixel | [number, number]
      anchor?: InfoWindowAnchor
      isCustom?: boolean
      closeWhenClickMap?: boolean
      autoMove?: boolean
    }

    class InfoWindow implements Evented, Destroyable {
      constructor(options?: InfoWindowOptions)
      open(map: Map, position?: LngLatLike): void
      close(): void
      setContent(content: string | HTMLElement): void
      setPosition(position: LngLatLike): void
      setOptions(options: Partial<InfoWindowOptions>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface PolylineOptions extends BaseOptions {
      path?: LngLatLike[]
      visible?: boolean
      extData?: any
    }

    class Polyline<TOptions extends PolylineOptions = PolylineOptions> implements OverlayLike {
      constructor(options?: TOptions)
      setMap(map: Map | null): void
      setPath(path: LngLatLike[]): void
      setOptions(options: Partial<PolylineOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface PolygonOptions extends BaseOptions {
      path?: LngLatLike[] | LngLatLike[][]
      visible?: boolean
      extData?: any
    }

    class Polygon<TOptions extends PolygonOptions = PolygonOptions> implements OverlayLike {
      constructor(options?: TOptions)
      setMap(map: Map | null): void
      setPath(path: LngLatLike[] | LngLatLike[][]): void
      getPath(): LngLat[]
      setOptions(options: Partial<PolygonOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface CircleOptions extends BaseOptions {
      center?: LngLatLike
      radius?: number
      visible?: boolean
      extData?: any
    }

    class Circle<TOptions extends CircleOptions = CircleOptions> implements OverlayLike {
      constructor(options?: TOptions)
      setMap(map: Map | null): void
      setCenter(center: LngLatLike): void
      getCenter(): LngLat
      setRadius(radius: number): void
      getRadius(): number
      setOptions(options: Partial<CircleOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface CircleMarkerOptions extends CircleOptions {}

    class CircleMarker<TOptions extends CircleMarkerOptions = CircleMarkerOptions> extends Circle<TOptions> {}

    interface RectangleOptions extends BaseOptions {
      bounds?: BoundsLike
      visible?: boolean
      extData?: any
    }

    class Rectangle<TOptions extends RectangleOptions = RectangleOptions> implements OverlayLike {
      constructor(options?: TOptions)
      setMap(map: Map | null): void
      setBounds(bounds: BoundsLike | undefined): void
      setOptions(options: Partial<RectangleOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface EllipseOptions extends BaseOptions {
      center?: LngLatLike
      radius?: [number, number]
      visible?: boolean
      extData?: any
    }

    class Ellipse<TOptions extends EllipseOptions = EllipseOptions> implements OverlayLike {
      constructor(options?: TOptions)
      setMap(map: Map | null): void
      setCenter(center: LngLatLike): void
      setRadius(radius: [number, number]): void
      setOptions(options: Partial<EllipseOptions>): void
      setExtData(extData: any): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface BezierCurveOptions extends BaseOptions {
      path?: BezierCurvePath
      visible?: boolean
      extData?: any
    }

    class BezierCurve<TOptions extends BezierCurveOptions = BezierCurveOptions> implements OverlayLike {
      constructor(options?: TOptions)
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

    interface TextOptions extends MarkerOptions {
      text?: string
      style?: Record<string, any>
    }

    class Text extends Marker {
      constructor(options?: TextOptions)
      setText(text: string): void
      setStyle(style: Record<string, any>): void
    }

    interface TileLayerOptions extends BaseOptions {
      tileUrl?: string | ((x: number, y: number, z: number) => string)
      getTileUrl?: string | ((x: number, y: number, z: number) => string)
      opacity?: number
      zIndex?: number
      visible?: boolean
    }

    class TileLayer implements OverlayLike {
      constructor(options?: TileLayerOptions)
      setMap(map: Map | null): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      setTileUrl(url: string | ((x: number, y: number, z: number) => string)): void
      reload(): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    namespace TileLayer {
      interface TrafficOptions extends TileLayerOptions {
        autoRefresh?: boolean
        interval?: number
      }
      class Traffic extends TileLayer {
        constructor(options?: TrafficOptions)
      }
      namespace Traffic {
        type Options = TrafficOptions
      }
      class Satellite extends TileLayer {
        constructor(options?: TileLayerOptions)
      }
      class RoadNet extends TileLayer {
        constructor(options?: TileLayerOptions)
      }
    }

    interface ImageLayerOptions extends BaseOptions {
      url?: string
      bounds?: BoundsLike
      zooms?: LabelsLayerZooms
      opacity?: number
      zIndex?: number
      visible?: boolean
    }

    class ImageLayer implements OverlayLike {
      constructor(options?: ImageLayerOptions)
      setMap(map: Map | null): void
      setImageUrl(url: string): void
      setBounds(bounds: BoundsLike): void
      setOpacity(opacity: number): void
      setzIndex(zIndex: number): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    interface LabelsLayerOptions extends BaseOptions {
      zooms?: LabelsLayerZooms
      zIndex?: number
      opacity?: number
      visible?: boolean
      collision?: boolean
      allowCollision?: boolean
      declutter?: boolean
    }

    class LabelsLayer implements OverlayLike {
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

    interface LabelMarkerTextOptions extends BaseOptions {
      content?: string
      direction?: 'top' | 'right' | 'bottom' | 'left' | 'center'
      offset?: Pixel | [number, number]
      style?: Record<string, any>
    }

    interface LabelMarkerIconOptions extends BaseOptions {
      image?: string
      imageSize?: { width: number, height: number } | Size | [number, number]
      size?: { width: number, height: number } | Size | [number, number]
      anchor?: Pixel | [number, number]
    }

    interface LabelMarkerOptions extends BaseOptions {
      position?: LngLatLike
      icon?: LabelMarkerIconOptions
      text?: LabelMarkerTextOptions
      zooms?: LabelsLayerZooms
      opacity?: number
      zIndex?: number
      extData?: any
      visible?: boolean
      collision?: boolean
    }

    class LabelMarker implements OverlayLike {
      constructor(options?: LabelMarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: LngLatLike): void
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

    interface OverlayGroupOptions extends BaseOptions {}

    class OverlayGroup implements OverlayLike {
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

    interface HeatMapOptions extends BaseOptions {
      radius?: number
      gradient?: Record<string, string>
      opacity?: [number, number]
      zooms?: [number, number]
      zIndex?: number
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

    class HeatMap implements OverlayLike {
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

    interface ElasticMarkerOptions extends BaseOptions {
      position?: LngLatLike
      styles?: ElasticMarkerStyles
      zoomStyleMapping?: Record<number, number>
      extData?: any
      visible?: boolean
      cursor?: string
      draggable?: boolean
      zIndex?: number
    }

    class ElasticMarker extends Marker {
      constructor(options?: ElasticMarkerOptions)
      setStyles(styles: ElasticMarkerStyles): void
      setZoomStyleMapping(mapping: Record<number, number>): void
    }

    interface MarkerClusterOptions extends BaseOptions {
      gridSize?: number
      maxZoom?: number
      averageCenter?: boolean
      styles?: any[]
      renderClusterMarker?: (context: { marker: Marker, count: number }) => void
      renderMarker?: (context: { marker: Marker }) => void
    }

    class MarkerCluster implements Evented, Destroyable {
      constructor(map: Map, markers?: Marker[] | Marker, options?: MarkerClusterOptions)
      setMap(map: Map | null): void
      addMarker(marker: Marker): void
      addMarkers(markers: Marker[]): void
      removeMarker(marker: Marker): void
      removeMarkers(markers: Marker[]): void
      clearMarkers(): void
      setMarkers(markers: Marker[]): void
      setOptions(options: Partial<MarkerClusterOptions>): void
      setGridSize?(gridSize: number): void
      setAverageCenter?(averageCenter: boolean): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class MarkerClusterer extends MarkerCluster {}

    interface MassData extends BaseOptions {
      lnglat: LngLatLike
      name?: string
      style?: number
    }

    interface MassMarkersStyleOptions extends BaseOptions {
      url?: string
      anchor?: Pixel | [number, number]
      size?: Size | [number, number]
    }

    interface MassMarkersOptions extends BaseOptions {
      opacity?: number
      zIndex?: number
      cursor?: string
      style?: MassMarkersStyleOptions | MassMarkersStyleOptions[]
    }

    class MassMarks implements Evented, Destroyable {
      constructor(data?: MassData[], options?: MassMarkersOptions)
      setMap(map: Map | null): void
      setData(data: MassData[]): void
      setStyle(style: MassMarkersStyleOptions | MassMarkersStyleOptions[]): void
      setOptions(options: Partial<MassMarkersOptions>): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class Adaptor {
      translate(data: any): any
    }

    interface MouseToolDrawOptions extends BaseOptions {}

    class MouseTool implements Evented {
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

    interface DistrictLayerOptions extends BaseOptions {
      zIndex?: number
      zooms?: [number, number]
      opacity?: number
      depth?: number
      adcode?: string | number | Array<string | number>
      styles?: Record<string, any>
      features?: string[]
      visible?: boolean
    }

    class DistrictLayer implements OverlayLike {
      constructor(options?: DistrictLayerOptions)
      setMap(map: Map | null): void
      setOptions(options: Partial<DistrictLayerOptions>): void
      setStyles(styles: DistrictLayerOptions['styles']): void
      setDistricts(adcode: string | number | Array<string | number>): void
      setZooms(zooms: [number, number]): void
      setzIndex(zIndex: number): void
      show(): void
      hide(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    namespace DistrictLayer {
      class World extends DistrictLayer {}
      class Country extends DistrictLayer {}
      class Province extends DistrictLayer {}
      class City extends DistrictLayer {}
      class District extends DistrictLayer {}
    }

    interface ContextMenuOptions extends BaseOptions {
      width?: number
      isCustom?: boolean
    }

    class ContextMenu implements Evented {
      constructor(options?: ContextMenuOptions)
      addItem(text: string, handler: (event: any) => void, index?: number): void
      removeItem(text: string, handler: (event: any) => void): void
      open(map: Map, position: LngLatLike): void
      close(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    interface EditorOptions extends BaseOptions {}
    type CircleEditorOptions = EditorOptions
    type RectangleEditorOptions = EditorOptions
    type EllipseEditorOptions = EditorOptions
    type PolylineEditorOptions = EditorOptions
    type BezierCurveEditorOptions = EditorOptions
    type PolygonEditorOptions = EditorOptions

    interface Editor<TTarget> extends Evented, Destroyable {
      open: () => void
      close: () => void
      setTarget: (target: TTarget | null) => void
      getTarget: () => TTarget | null
      setOptions: (options: Record<string, any>) => void
      destroy: () => void
    }

    class CircleEditor implements Editor<Circle> {
      constructor(map: Map, circle: Circle, options?: CircleEditorOptions)
      open(): void
      close(): void
      setTarget(target: Circle | null): void
      getTarget(): Circle | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class RectangleEditor implements Editor<Rectangle> {
      constructor(map: Map, rectangle: Rectangle, options?: RectangleEditorOptions)
      open(): void
      close(): void
      setTarget(target: Rectangle | null): void
      getTarget(): Rectangle | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class EllipseEditor implements Editor<Ellipse> {
      constructor(map: Map, ellipse: Ellipse, options?: EllipseEditorOptions)
      open(): void
      close(): void
      setTarget(target: Ellipse | null): void
      getTarget(): Ellipse | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class PolylineEditor implements Editor<Polyline> {
      constructor(map: Map, polyline: Polyline, options?: PolylineEditorOptions)
      open(): void
      close(): void
      setTarget(target: Polyline | null): void
      getTarget(): Polyline | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class BezierCurveEditor implements Editor<BezierCurve> {
      constructor(map: Map, curve: BezierCurve, options?: BezierCurveEditorOptions)
      open(): void
      close(): void
      setTarget(target: BezierCurve | null): void
      getTarget(): BezierCurve | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    class PolygonEditor implements Editor<Polygon> {
      constructor(map: Map, polygon: Polygon, options?: PolygonEditorOptions)
      open(): void
      close(): void
      setTarget(target: Polygon | null): void
      getTarget(): Polygon | null
      setOptions(options: Record<string, any>): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
      destroy(): void
    }

    namespace Autocomplete {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {
        city?: string
        type?: string
        citylimit?: boolean
        lang?: string
        datatype?: string
      }
      interface Tip extends BaseOptions {
        name?: string
        district?: string
        adcode?: string
        address?: string
        city?: any[]
        id?: string
        location?: LngLat
        typecode?: string
      }
      interface SearchResult extends BaseOptions {
        info?: string
        count?: number
        tips?: Tip[]
      }
    }

    class Autocomplete implements Evented {
      constructor(options?: Autocomplete.Options)
      search(keyword: string, callback: (status: Autocomplete.SearchStatus, result: Autocomplete.SearchResult | string) => void): void
      setCity?(city?: string): void
      setType?(type?: string): void
      setCityLimit?(cityLimit: boolean): void
      setLang?(lang?: string): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    class AutoComplete extends Autocomplete {}

    namespace PlaceSearch {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {
        map?: Map | null
        city?: string
        type?: string
        pageIndex?: number
        pageSize?: number
        panel?: string | HTMLElement
      }
      interface Poi extends BaseOptions {
        id?: string
        name?: string
        type?: string
        location?: LngLat | null
        address?: string
        distance?: number
        district?: string
      }
      interface PoiList extends BaseOptions {
        pois: Poi[]
        pageIndex?: number
        pageSize?: number
        count?: number
      }
      interface SearchResult extends BaseOptions {
        info?: string
        poiList?: PoiList
        keywordList?: string[]
        cityList?: any[]
      }
    }

    class PlaceSearch implements Evented {
      constructor(options?: PlaceSearch.Options)
      search(keyword: string, callback: (status: PlaceSearch.SearchStatus, result: string | PlaceSearch.SearchResult) => void): void
      searchNearBy(keyword: string, center: LngLatLike, radius: number, callback: (status: PlaceSearch.SearchStatus, result: string | PlaceSearch.SearchResult) => void): void
      searchInBounds(keyword: string, bounds: Bounds | Polygon, callback: (status: PlaceSearch.SearchStatus, result: string | PlaceSearch.SearchResult) => void): void
      getDetails(id: string, callback: (status: PlaceSearch.SearchStatus, result: string | PlaceSearch.SearchResult) => void): void
      setOptions?(options: Partial<PlaceSearch.Options>): void
      setCity?(city?: string): void
      setType?(type?: string): void
      setPageIndex?(pageIndex?: number): void
      setPageSize?(pageSize?: number): void
      setMap?(map: Map | null): void
      clear?(): void
      on(event: string, handler: (event: any) => void): void
      off(event: string, handler: (event: any) => void): void
    }

    namespace Geocoder {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {
        city?: string
        radius?: number
        extensions?: 'base' | 'all'
      }
      interface GeocodeResult extends BaseOptions {
        geocodes?: any[]
      }
      interface ReGeocodeResult extends BaseOptions {
        regeocode?: any
      }
      interface BatchReGeocodeResult extends BaseOptions {
        regeocodes?: any[]
      }
    }

    class Geocoder {
      constructor(options?: Geocoder.Options)
      getLocation(address: string, callback: (status: Geocoder.SearchStatus, result: string | Geocoder.GeocodeResult) => void): void
      getAddress(position: LngLatLike, callback: (status: Geocoder.SearchStatus, result: string | Geocoder.ReGeocodeResult | Geocoder.BatchReGeocodeResult) => void): void
      setCity(city: string): void
      setOptions?(options: Partial<Geocoder.Options>): void
    }

    namespace Geolocation {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {}
      interface GeolocationResult extends BaseOptions {
        position?: LngLat
      }
      interface CityResult extends BaseOptions {
        city?: string
        province?: string
        adcode?: string
      }
      interface ErrorStatus extends BaseOptions {
        info?: string
        message?: string
      }
    }

    class Geolocation {
      constructor(options?: Geolocation.Options)
      getCurrentPosition(callback: (status: Geolocation.SearchStatus, result: Geolocation.GeolocationResult | Geolocation.ErrorStatus) => void): void
      getCityInfo(callback: (status: Geolocation.SearchStatus, result: Geolocation.CityResult | Geolocation.ErrorStatus) => void): void
      watchPosition?(callback: (status: string, result: Geolocation.GeolocationResult) => void): number
      clearWatch(watchId: number): void
      setOptions?(options: Partial<Geolocation.Options>): void
    }

    namespace Driving {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {
        map?: Map | null
        panel?: string | HTMLElement
      }
      interface SearchResult extends BaseOptions {
        routes?: any[]
      }
    }

    class Driving {
      constructor(options?: Driving.Options)
      search(origin: RouteEndpoint, destination: RouteEndpoint, callback: (status: Driving.SearchStatus, result: string | Driving.SearchResult) => void): void
      search(origin: RouteEndpoint, destination: RouteEndpoint, options: BaseOptions, callback: (status: Driving.SearchStatus, result: string | Driving.SearchResult) => void): void
      setOptions?(options: Partial<Driving.Options>): void
      setMap?(map: Map | null): void
      clear?(): void
    }

    namespace Riding {
      type SearchStatus = 'complete' | 'error' | 'no_data' | string
      interface Options extends BaseOptions {
        map?: Map | null
        panel?: string | HTMLElement
      }
      interface SearchResult extends BaseOptions {
        routes?: any[]
      }
    }

    class Riding {
      constructor(options?: Riding.Options)
      search(origin: RouteEndpoint, destination: RouteEndpoint, callback: (status: Riding.SearchStatus, result: string | Riding.SearchResult) => void): void
      setOptions?(options: Partial<Riding.Options>): void
      setMap?(map: Map | null): void
      clear?(): void
    }

    interface WalkingOptions extends BaseOptions {
      map?: Map | null
      panel?: string | HTMLElement
      hideMarkers?: boolean
    }

    interface WalkingResult extends BaseOptions {
      info?: string
      count?: number
      routes?: any[]
      plans?: any[]
    }

    class Walking {
      constructor(options?: WalkingOptions)
      search(origin: RouteEndpoint, destination: RouteEndpoint, callback: (status: string, result: WalkingResult) => void): void
      setOptions?(options: Partial<WalkingOptions>): void
      setMap?(map: Map | null): void
      clear?(): void
    }

    interface WeatherLiveResult extends BaseOptions {
      city?: string
      province?: string
      adcode?: string
      weather?: string
      temperature?: string
      windDirection?: string
      windPower?: string
      humidity?: string
      reportTime?: string
    }

    interface WeatherForecast extends BaseOptions {
      date: string
      week: string
      dayWeather: string
      nightWeather: string
      dayTemp: string
      nightTemp: string
    }

    interface WeatherForecastResult extends BaseOptions {
      city?: string
      province?: string
      adcode?: string
      forecasts: WeatherForecast[]
    }

    class Weather {
      getLive(city: string, callback: (status: string, result: WeatherLiveResult) => void): void
      getForecast(city: string, callback: (status: string, result: WeatherForecastResult) => void): void
    }

    interface GeoJSONOptions extends BaseOptions {
      geoJSON?: any
      getMarker?: (geojson: any, lnglat: LngLat) => Marker
      getPolyline?: (geojson: any, lnglat: LngLat[]) => Polyline
      getPolygon?: (geojson: any, lnglat: LngLat[]) => Polygon
    }

    class GeoJSON {
      constructor(options?: GeoJSONOptions)
      importData(data: any): void
      toGeoJSON(): any
      setMap(map: Map | null): void
      getOverlays(): any[]
      addOverlay(overlay: any): void
      addOverlays(overlays: any | any[]): void
      removeOverlay(overlay: any): void
      removeOverlays(overlays: any | any[]): void
      clearOverlays(): void
      setOptions(options: Partial<GeoJSONOptions>): void
      show(): void
      hide(): void
    }

    namespace GeoJSON {
      interface Options extends GeoJSONOptions {}
      type GeoJSONObject = any
    }
  }
}

export {}
