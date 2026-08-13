import { describe, it, expect } from 'vitest'
import { generateId } from './generateId'

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(generateId()).toBeTypeOf('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('produces unique ids across many calls', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateId()))
    expect(ids.size).toBe(1000)
  })
})
