import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { MessageBus } from './MessageBus'

afterEach(() => {
  globalThis.chrome = undefined as unknown as typeof chrome
})

describe('MessageBus.send', () => {
  it('resolves with the callback response', async () => {
    globalThis.chrome = {
      runtime: {
        lastError: undefined,
        sendMessage: vi.fn((_msg, cb) => cb({ success: true, data: 'pong' })),
      },
    } as unknown as typeof chrome
    expect(await MessageBus.send({ action: 'ping' })).toEqual({ success: true, data: 'pong' })
  })

  it('surfaces chrome.runtime.lastError as a failed response', async () => {
    globalThis.chrome = {
      runtime: {
        lastError: { message: 'no receiver' },
        sendMessage: vi.fn((_msg, cb) => cb(undefined)),
      },
    } as unknown as typeof chrome
    expect(await MessageBus.send({ action: 'ping' })).toEqual({
      success: false,
      error: 'no receiver',
    })
  })

  it('fails safely when chrome is unavailable', async () => {
    expect(await MessageBus.send({ action: 'ping' })).toEqual({
      success: false,
      error: 'chrome.runtime not available',
    })
  })
})

describe('MessageBus.onMessage', () => {
  it('registers a listener and returns a working cleanup', () => {
    const addListener = vi.fn()
    const removeListener = vi.fn()
    globalThis.chrome = {
      runtime: { onMessage: { addListener, removeListener } },
    } as unknown as typeof chrome

    const cleanup = MessageBus.onMessage(() => {})
    expect(addListener).toHaveBeenCalledOnce()

    cleanup()
    expect(removeListener).toHaveBeenCalledOnce()
  })
})
