declare global {
  namespace AMap {
    type LabelsLayerZooms = [number, number]

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
  }
}

export {}
