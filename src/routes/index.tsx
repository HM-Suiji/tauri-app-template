import { Button, Form, Input } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'

import { useCounterStore } from '@/store/counter.store'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const { count, increment } = useCounterStore()

  async function greet() {
    setGreetMsg(await invoke('greet', { name })) // invoke the greet command
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <Form
        onSubmit={e => {
          e.preventDefault()
          greet()
        }}
      >
        <Input
          id="greet-input"
          onChange={e => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit">Greet</Button>
      </Form>
      <div>{greetMsg}</div>

      <p>Count: {count}</p>
      <button onClick={() => increment(1)}>Increment</button>
    </main>
  )
}
