import { useState, useEffect } from 'preact/hooks'
import type { StoreApi } from 'zustand/vanilla'

/**
 * Bridge a vanilla Zustand store into a Preact component.
 *
 * Subscribes on mount, mirrors the selected slice into local state, and
 * cleans up on unmount — so components stay declarative and never touch
 * `store.subscribe` directly.
 *
 * @example
 *   const count = useStore(popupStore, (s) => s.count)
 *   const actions = popupStore.getState() // actions are stable
 */
export function useStore<T, S = T>(
  store: StoreApi<T>,
  selector: (state: T) => S = (s) => s as unknown as S
): S {
  const [slice, setSlice] = useState<S>(() => selector(store.getState()))

  useEffect(() => {
    const update = () => setSlice(selector(store.getState()))
    update() // sync any change that happened between render and effect
    return store.subscribe(update)
  }, [])

  return slice
}
