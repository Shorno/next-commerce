import {boolean, integer, pgEnum, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_roles", ["USER", "SELLER", "ADMIN"]);

export const users = pgTable("users", {
    id: varchar({length: 255}).notNull().primaryKey(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    image: varchar({length: 255}).notNull().unique(),
    role: roleEnum("role").notNull().default("USER"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});


export const categories = pgTable("categories", {
    id : integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull().unique(),
    image: varchar({length: 255}).notNull(),
    slug: varchar({length: 100}).notNull().unique(),
    featured : boolean().default(false),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
})



export type NewUser = typeof users.$inferInsert
export type UserRole = typeof roleEnum.enumValues[number]
export type InsertCategory = typeof categories.$inferInsert
export type Category = typeof categories.$inferSelect