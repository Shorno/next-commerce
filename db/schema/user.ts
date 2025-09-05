import { pgEnum, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {stores} from "@/db/schema/store";

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

export const usersRelations = relations(users, ({many}) => ({
    stores: many(stores)
}))

export type User = typeof users.$inferInsert
export type UserRole = typeof roleEnum.enumValues[number]
