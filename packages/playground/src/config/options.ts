import type {
  ControlPosition,
  InfoWindowAnchor,
  MapStyleKey,
  MarkerLabelDirection,
  PerformanceRenderMode,
  ViewMode,
} from '../types'

export const viewModeOptions: Array<{ label: string, value: ViewMode }> = [
  { label: '3D (default)', value: '3D' },
  { label: '2D', value: '2D' },
]

export const mapStyleOptions: Array<{ label: string, value: MapStyleKey }> = [
  { label: 'Default', value: 'default' },
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
  { label: 'Fresh', value: 'fresh' },
  { label: 'Grey', value: 'grey' },
  { label: 'Whitesmoke', value: 'whitesmoke' },
  { label: 'Macaron', value: 'macaron' },
  { label: 'Blue', value: 'blue' },
  { label: 'Dark Blue', value: 'darkblue' },
]

export const markerDirectionOptions: Array<{ label: string, value: MarkerLabelDirection }> = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Center', value: 'center' },
]

export const infoWindowAnchorOptions: Array<{ label: string, value: InfoWindowAnchor }> = [
  { label: 'Top left', value: 'top-left' },
  { label: 'Top center', value: 'top-center' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Middle left', value: 'middle-left' },
  { label: 'Center', value: 'center' },
  { label: 'Middle right', value: 'middle-right' },
  { label: 'Bottom left', value: 'bottom-left' },
  { label: 'Bottom center', value: 'bottom-center' },
  { label: 'Bottom right', value: 'bottom-right' },
]

export const controlPositionOptions: Array<{ label: string, value: ControlPosition }> = [
  { label: 'Left top', value: 'LT' },
  { label: 'Right top', value: 'RT' },
  { label: 'Left bottom', value: 'LB' },
  { label: 'Right bottom', value: 'RB' },
]

export const performanceRenderModeOptions: Array<{ label: string, value: PerformanceRenderMode }> = [
  { label: 'Immediate (single batch)', value: 'immediate' },
  { label: 'Chunked (progressive)', value: 'chunked' },
]

export const mapTypeDefaultOptions = [
  { label: 'Standard map', value: 0 },
  { label: 'Satellite map', value: 1 },
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
