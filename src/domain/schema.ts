// src/domain/schema.ts
import { integer, text, sqliteTable, json } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const practitioners = sqliteTable('practitioners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  settings: json('settings'),
});

export const availability = sqliteTable('availability', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  practitionerId: integer('practitioner_id').notNull().references(() => practitioners.id),
  slots: json('slots'),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  practitionerId: integer('practitioner_id').notNull().references(() => practitioners.id),
  clientInfo: text('client_info'),  // encrypted JSON string
  status: text('status').default('pending'),
  intakeResponses: json('intake_responses'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});