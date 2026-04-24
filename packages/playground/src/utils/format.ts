import type { LngLatTuple } from '../types'

export function indentLines(text: string, spaces: number) {
  const padding = ' '.repeat(spaces)

  return text
    .split('\n')
    .map(line => (line.length > 0 ? `${padding}${line}` : line))
    .join('\n')
}

export function formatNumber(value: number) {
  if (Number.isInteger(value))
    return value.toString()

  return value.toFixed(2).replace(/\.0+$/, '').replace(/(\.[1-9]*)0+$/, '$1')
}

export function formatCoordinate(value: number) {
  return value.toFixed(6)
}

export function formatLngLatTuple(tuple: LngLatTuple) {
  return `[${tuple.map(formatCoordinate).join(', ')}]`
}

export function formatTuple(values: number[]) {
  return `[${values.map(formatNumber).join(', ')}]`
}

export function formatBoolean(value: boolean) {
  return value ? 'true' : 'false'
}

export function escapeSingleQuotes(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}
