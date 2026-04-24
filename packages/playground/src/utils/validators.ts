import type {
  ControlPosition,
  InfoWindowAnchor,
  LngLatTuple,
  MapStyleKey,
  MarkerLabelDirection,
  PanelId,
  PerformanceRenderMode,
  ViewMode,
} from '../types'
import {
  CONTROL_POSITION_VALUES,
  INFO_WINDOW_ANCHORS,
  MAP_STYLE_VALUES,
  MARKER_LABEL_DIRECTIONS,
  VIEW_MODE_VALUES,
} from '../config/options'
import { PANEL_IDS } from '../config/panels'

export function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value))
    return value

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed))
      return parsed
  }

  return undefined
}

export function toBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean')
    return value

  if (typeof value === 'string') {
    if (value === 'true')
      return true
    if (value === 'false')
      return false
  }

  return undefined
}

export function toLngLatTuple(value: unknown): LngLatTuple | undefined {
  if (!Array.isArray(value) || value.length !== 2)
    return undefined

  const [lngValue, latValue] = value
  const lng = toFiniteNumber(lngValue)
  const lat = toFiniteNumber(latValue)

  if (lng == null || lat == null)
    return undefined

  return [lng, lat]
}

export function isPanelId(value: unknown): value is PanelId {
  return typeof value === 'string' && PANEL_IDS.includes(value as PanelId)
}

export function isViewMode(value: unknown): value is ViewMode {
  return typeof value === 'string' && (VIEW_MODE_VALUES as readonly string[]).includes(value)
}

export function isMapStyle(value: unknown): value is MapStyleKey {
  return typeof value === 'string' && (MAP_STYLE_VALUES as readonly string[]).includes(value)
}

export function isMarkerDirection(value: unknown): value is MarkerLabelDirection {
  return typeof value === 'string' && (MARKER_LABEL_DIRECTIONS as readonly string[]).includes(value)
}

export function isInfoWindowAnchor(value: unknown): value is InfoWindowAnchor {
  return typeof value === 'string' && (INFO_WINDOW_ANCHORS as readonly string[]).includes(value)
}

export function isControlPosition(value: unknown): value is ControlPosition {
  return typeof value === 'string' && (CONTROL_POSITION_VALUES as readonly string[]).includes(value)
}

export function isPerformanceRenderMode(value: unknown): value is PerformanceRenderMode {
  return value === 'immediate' || value === 'chunked'
}
