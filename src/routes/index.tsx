import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

import { getSettings, setSettings } from '@/db/actions/settings.action'
import { useCounterStore } from '@/store/counter.store'
import { commands } from '@/utils/bindings'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const { count, increment } = useCounterStore()

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
    </main>
  )
}
