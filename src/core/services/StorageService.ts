/**
 * StorageService — typed, promisified access to chrome.storage.
 *
 * Works across the `local`, `session`, and `sync` areas and returns sensible
 * fallbacks instead of throwing, so surface code stays simple.
 */

export type StorageArea = 'local' | 'session' | 'sync'

export class StorageService {
  /** Get a single value, or `null` if it is not set. */
  static async get<T>(key: string, area: StorageArea = 'local'): Promise<T | null> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return null
      const result = await storage.get([key])
      return (result[key] as T) ?? null
    } catch (error) {
      console.error(`StorageService.get failed for "${key}":`, error)
      return null
    }
  }

  /** Get several values at once. */
  static async getMultiple<T extends Record<string, unknown>>(
    keys: string[],
    area: StorageArea = 'local'
  ): Promise<Partial<T>> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return {}
      return (await storage.get(keys)) as Partial<T>
    } catch (error) {
      console.error('StorageService.getMultiple failed:', error)
      return {}
    }
  }

  /** Store a single value. Returns `true` on success. */
  static async set<T>(key: string, value: T, area: StorageArea = 'local'): Promise<boolean> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return false
      await storage.set({ [key]: value })
      return true
    } catch (error) {
      console.error(`StorageService.set failed for "${key}":`, error)
      return false
    }
  }

  /** Store several values at once. */
  static async setMultiple(
    items: Record<string, unknown>,
    area: StorageArea = 'local'
  ): Promise<boolean> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return false
      await storage.set(items)
      return true
    } catch (error) {
      console.error('StorageService.setMultiple failed:', error)
      return false
    }
  }

  /** Remove a single key. */
  static async remove(key: string, area: StorageArea = 'local'): Promise<void> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return
      await storage.remove([key])
    } catch (error) {
      console.error(`StorageService.remove failed for "${key}":`, error)
    }
  }

  /** Remove several keys at once. */
  static async removeMultiple(keys: string[], area: StorageArea = 'local'): Promise<void> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return
      await storage.remove(keys)
    } catch (error) {
      console.error('StorageService.removeMultiple failed:', error)
    }
  }

  /** Clear an entire storage area. Use with care. */
  static async clear(area: StorageArea = 'local'): Promise<void> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return
      await storage.clear()
    } catch (error) {
      console.error(`StorageService.clear failed for "${area}":`, error)
    }
  }

  /** Get everything stored in an area. */
  static async getAll(area: StorageArea = 'local'): Promise<Record<string, unknown>> {
    try {
      const storage = this.getStorage(area)
      if (!storage) return {}
      return await storage.get()
    } catch (error) {
      console.error('StorageService.getAll failed:', error)
      return {}
    }
  }

  private static getStorage(area: StorageArea): chrome.storage.StorageArea | null {
    if (typeof chrome === 'undefined' || !chrome.storage) return null
    switch (area) {
      case 'session':
        return chrome.storage.session
      case 'sync':
        return chrome.storage.sync
      default:
        return chrome.storage.local
    }
  }
}
