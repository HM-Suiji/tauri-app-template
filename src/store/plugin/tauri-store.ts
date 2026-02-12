import { LazyStore } from '@tauri-apps/plugin-store'
import { StateStorage } from 'zustand/middleware/persist'

const store = new LazyStore('zustand.store.json', {
  autoSave: true,
  defaults: {},
})

export const tauriStorage: StateStorage = {
  setItem: async (name, value) => {
    await store.set(name, value)
  },
  removeItem: async name => {
    await store.delete(name)
  },
  getItem: async name => {
    return (await store.get(name)) || ''
  },
}
