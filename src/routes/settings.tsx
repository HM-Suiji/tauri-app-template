import { createFileRoute } from '@tanstack/react-router'
import { useState, useLayoutEffect } from 'react'

import { getSettings, setSettings } from '@/db/actions/settings.action'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [settings, _setSettings] = useState<Record<string, string | null>>({})

  useLayoutEffect(() => {
    ;(async () => {
      const _settings = await getSettings()
      _settings.forEach(setting => {
        _setSettings(prev => ({ ...prev, [setting.key]: setting.value }))
      })
    })()
  }, [])
  return (
    <div>
      Hello "/settings"!
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
    </div>
  )
}
