import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const settings = sqliteTable('settings', {
  id: text().primaryKey(),
  key: text().notNull().unique(),
  value: text(),
})
