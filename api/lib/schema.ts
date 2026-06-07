import { pgTable, uuid, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title'),
  confession: text('confession').notNull(),
  duration: integer('duration').notNull(),
  tone: text('tone').notNull(),
  contentOptions: jsonb('content_options'),
  speakerName: text('speaker_name'),
  days: jsonb('days').notNull(),
  quotes: jsonb('quotes'),
  createdAt: timestamp('created_at').defaultNow(),
});
