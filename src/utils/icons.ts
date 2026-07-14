/**
 * Render a Lucide icon as a Preact VNode (no JSX, works inside HTM templates).
 *
 * Import the icons you need from `lucide` and pass them to `icon()`:
 *
 *   import { Sun } from 'lucide'
 *   html`<button>${icon(Sun, { size: 16 })}</button>`
 *
 * Named imports are tree-shaken, so only the icons you use ship in the bundle.
 */

import { h } from 'preact'
import type { VNode } from 'preact'
import type { IconNode } from 'lucide'

const SVG_DEFAULTS: Record<string, string | number> = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
}

export interface IconProps {
  size?: number
  [attr: string]: unknown
}

export function icon(node: IconNode, props: IconProps = {}): VNode {
  const { size = 18, ...rest } = props
  // Lucide icons are flat `[tag, attrs]` tuples; render each as a child element.
  const parts = node as unknown as Array<[string, Record<string, string>]>
  const children = parts.map(([tag, attrs], index) => h(tag, { key: index, ...attrs }))
  return h('svg', { ...SVG_DEFAULTS, width: size, height: size, ...rest }, children) as VNode
}
