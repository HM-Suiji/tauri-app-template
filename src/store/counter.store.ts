import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { tauriStorage } from './plugin/tauri-store'

type State = {
  count: number
}

type Actions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

export const useCounterStore = create<State & Actions>()(
  persist(
    immer(set => ({
      count: 0,
      increment: (qty: number) =>
        set(state => {
          state.count += qty
        }),
      decrement: (qty: number) =>
        set(state => {
          state.count -= qty
        }),
    })),
    {
      name: 'counter-storage',
      storage: createJSONStorage(() => tauriStorage),
    }
  )
)
