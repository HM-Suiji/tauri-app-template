import '@/assets/globals.css'
import { useEffect, useState } from 'react'

import { useCountStore } from '@/store/counter.store'
import { commands } from '@/utils/bindings'

import { getSettings, setSettings } from './db/actions/settings.action'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const { count, increment } = useCountStore()
  const [settings, _setSettings] = useState<Record<string, string | null>>({})

  useEffect(() => {
    ;(async () => {
      const _settings = await getSettings()
      _settings.forEach(setting => {
        _setSettings(prev => ({ ...prev, [setting.key]: setting.value }))
      })
    })()
  }, [])

  async function greet() {
    setGreetMsg(await commands.greet(name))
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={e => {
          e.preventDefault()
          greet()
        }}
      >
        <input
          id="greet-input"
          onChange={e => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      <p>Count: {count}</p>
      <button onClick={() => increment(1)}>Increment</button>

      <form
        onSubmit={e => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setSettings(data.get('key') as string, data.get('value') as string)
        }}
      >
        <input name="key" />
        <input name="value" />
        <button type="submit">Add</button>
      </form>

      <div>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key}>
            <span>{key}: </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
