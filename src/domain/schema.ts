// src/domain/schema.ts  (replace entire content)
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const practitioners = sqliteTable('practitioners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  settings: text('settings', { mode: 'json' }),  // ← changed to text + mode 'json'
});

export const availability = sqliteTable('availability', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  practitionerId: integer('practitioner_id').notNull().references(() => practitioners.id),
  slots: text('slots', { mode: 'json' }),  // ← changed
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  practitionerId: integer('practitioner_id').notNull().references(() => practitioners.id),
  clientInfo: text('client_info'),  // we'll encrypt this manually as string
  status: text('status').default('pending'),
  intakeResponses: text('intake_responses', { mode: 'json' }),  // ← changed
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});