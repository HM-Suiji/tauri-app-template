import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react'
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
      <Form
        className="flex items-center"
        onSubmit={e => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          setSettings(data.get('key') as string, data.get('value') as string)
        }}
      >
        <TextField isRequired>
          <Label>Key</Label>
          <Input name="key" />
          <FieldError />
        </TextField>
        <TextField isRequired>
          <Label>Value</Label>
          <Input name="value" />
          <FieldError />
        </TextField>
        <Button type="submit">Add</Button>
      </Form>
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
