import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { StorageService } from './StorageService'

function makeArea() {
  const data: Record<string, unknown> = {}
  return {
    get: vi.fn(async (keys?: string | string[] | null) => {
      if (keys == null) return { ...data }
      const arr = Array.isArray(keys) ? keys : [keys]
      const out: Record<string, unknown> = {}
      for (const k of arr) if (k in data) out[k] = data[k]
      return out
    }),
    set: vi.fn(async (items: Record<string, unknown>) => {
      Object.assign(data, items)
    }),
    remove: vi.fn(async (keys: string | string[]) => {
      for (const k of Array.isArray(keys) ? keys : [keys]) delete data[k]
    }),
    clear: vi.fn(async () => {
      for (const k of Object.keys(data)) delete data[k]
    }),
  }
}

describe('StorageService', () => {
  beforeEach(() => {
    globalThis.chrome = {
      storage: { local: makeArea(), session: makeArea(), sync: makeArea() },
    } as unknown as typeof chrome
  })

  afterEach(() => {
    globalThis.chrome = undefined as unknown as typeof chrome
  })

  it('round-trips a value through set/get', async () => {
    expect(await StorageService.set('name', 'template')).toBe(true)
    expect(await StorageService.get<string>('name')).toBe('template')
  })

  it('returns null for a missing key', async () => {
    expect(await StorageService.get('missing')).toBeNull()
  })

  it('reads and writes multiple keys', async () => {
    await StorageService.setMultiple({ a: 1, b: 2 })
    expect(await StorageService.getMultiple(['a', 'b'])).toEqual({ a: 1, b: 2 })
  })

  it('removes a key', async () => {
    await StorageService.set('temp', 'x')
    await StorageService.remove('temp')
    expect(await StorageService.get('temp')).toBeNull()
  })

  it('honours the requested storage area', async () => {
    await StorageService.set('token', 'abc', 'sync')
    expect(await StorageService.get('token', 'sync')).toBe('abc')
    expect(await StorageService.get('token', 'local')).toBeNull()
  })

  it('returns a safe fallback when chrome is unavailable', async () => {
    globalThis.chrome = undefined as unknown as typeof chrome
    expect(await StorageService.get('name')).toBeNull()
    expect(await StorageService.set('name', 'x')).toBe(false)
  })
})
