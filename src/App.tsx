import '@/assets/globals.css'
import { useState } from 'react'

import { useCountStore } from '@/store/counter.store'
import { commands } from '@/utils/bindings'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const { count, increment } = useCountStore()

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

export default App
