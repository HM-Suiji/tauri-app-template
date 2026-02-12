import { nanoid } from 'nanoid'

import db from '..'
import { settings } from '../schema'

export const getSettings = async () => {
  const result = await db.select().from(settings)

  return result
}

export const setSettings = async (key: string, value: string) => {
  await db.insert(settings).values({ id: nanoid(), key, value })
}
