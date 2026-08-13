import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMessageRouter } from './MessageHandlers'

afterEach(() => {
  globalThis.chrome = undefined as unknown as typeof chrome
})

function invoke(message: Parameters<ReturnType<typeof createMessageRouter>>[0]) {
  return new Promise<{ keepChannelOpen: boolean; response: unknown }>((resolve) => {
    const keepChannelOpen = createMessageRouter()(message, {}, (response) => {
      resolve({ keepChannelOpen, response })
    })
  })
}

describe('createMessageRouter', () => {
  it('keeps the channel open and routes asynchronous messages', async () => {
    await expect(invoke({ action: 'ping' })).resolves.toEqual({
      keepChannelOpen: true,
      response: { success: true, data: 'pong' },
    })
  })

  it('reports notification failures instead of a false positive', async () => {
    globalThis.chrome = {
      storage: { sync: { get: vi.fn((_key, callback) => callback({})) } },
      notifications: { create: vi.fn().mockRejectedValue(new Error('permission denied')) },
    } as unknown as typeof chrome

    await expect(invoke({ action: 'notify', message: 'Hello' })).resolves.toEqual({
      keepChannelOpen: true,
      response: { success: false, error: 'Notification could not be shown' },
    })
  })

  it('rejects messages without an action synchronously', () => {
    const sendResponse = vi.fn()
    expect(createMessageRouter()({} as never, {}, sendResponse)).toBe(false)
    expect(sendResponse).toHaveBeenCalledWith({ success: false, error: 'No action specified' })
  })
})
