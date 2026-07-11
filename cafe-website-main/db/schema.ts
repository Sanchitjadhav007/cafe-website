import { integer, pgTable, varchar, text } from 'drizzle-orm/pg-core';

export const reviews = pgTable('reviews', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull(),
    rating: integer().notNull(),
    content: text().notNull()
});