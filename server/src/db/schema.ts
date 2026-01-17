import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* =======================
   Users
======================= */
export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =======================
   Message Sessions (Chats)
======================= */
export const messageSession = pgTable("message_session", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }), // optional: "Chat with AI"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =======================
   Messages
======================= */
export const message = pgTable("message", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  sessionId: integer("session_id")
    .notNull()
    .references(() => messageSession.id, { onDelete: "cascade" }),

  role: varchar("role", { length: 20 }) // "user" | "assistant"
    .notNull(),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
