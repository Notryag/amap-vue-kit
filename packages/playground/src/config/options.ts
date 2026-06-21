import type {
  ControlPosition,
  InfoWindowAnchor,
  MapStyleKey,
  MarkerLabelDirection,
  PerformanceRenderMode,
  ViewMode,
} from '../types'

export const viewModeOptions: Array<{ label: string, value: ViewMode }> = [
  { label: '3D（默认）', value: '3D' },
  { label: '2D', value: '2D' },
]

export const mapStyleOptions: Array<{ label: string, value: MapStyleKey }> = [
  { label: '默认', value: 'default' },
  { label: '深色', value: 'dark' },
  { label: '浅色', value: 'light' },
  { label: '清新', value: 'fresh' },
  { label: '灰色', value: 'grey' },
  { label: '白烟', value: 'whitesmoke' },
  { label: '马卡龙', value: 'macaron' },
  { label: '蓝色', value: 'blue' },
  { label: '深蓝', value: 'darkblue' },
]

export const markerDirectionOptions: Array<{ label: string, value: MarkerLabelDirection }> = [
  { label: '上', value: 'top' },
  { label: '下', value: 'bottom' },
  { label: '左', value: 'left' },
  { label: '右', value: 'right' },
  { label: '居中', value: 'center' },
]

export const infoWindowAnchorOptions: Array<{ label: string, value: InfoWindowAnchor }> = [
  { label: '左上', value: 'top-left' },
  { label: '上方居中', value: 'top-center' },
  { label: '右上', value: 'top-right' },
  { label: '左侧居中', value: 'middle-left' },
  { label: '居中', value: 'center' },
  { label: '右侧居中', value: 'middle-right' },
  { label: '左下', value: 'bottom-left' },
  { label: '下方居中', value: 'bottom-center' },
  { label: '右下', value: 'bottom-right' },
]

export const controlPositionOptions: Array<{ label: string, value: ControlPosition }> = [
  { label: '左上', value: 'LT' },
  { label: '右上', value: 'RT' },
  { label: '左下', value: 'LB' },
  { label: '右下', value: 'RB' },
]

export const performanceRenderModeOptions: Array<{ label: string, value: PerformanceRenderMode }> = [
  { label: '立即渲染（单批次）', value: 'immediate' },
  { label: '分块渲染（渐进）', value: 'chunked' },
]

export const mapTypeDefaultOptions = [
  { label: '标准地图', value: 0 },
  { label: '卫星地图', value: 1 },
]

export const CONTROL_POSITION_VALUES: readonly ControlPosition[] = ['LT', 'RT', 'LB', 'RB']
export const MARKER_LABEL_DIRECTIONS: readonly MarkerLabelDirection[] = ['top', 'bottom', 'left', 'right', 'center']
export const VIEW_MODE_VALUES: readonly ViewMode[] = ['2D', '3D']
export const MAP_STYLE_VALUES = mapStyleOptions.map(option => option.value)

export const INFO_WINDOW_ANCHORS: readonly InfoWindowAnchor[] = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]
