import {boolean, index, integer, numeric, pgEnum, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/user";
import {relations} from "drizzle-orm";
import {timestamps} from "@/db/columns.helpers";

export const storeStatusEnum = pgEnum("store_status", ["ACTIVE", "PENDING", "BANNED", "DISABLED"]);


export const stores = pgTable("stores", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull().unique(),
    description: text().notNull(),
    email: varchar({length: 100}).notNull().unique(),
    phone: varchar({length: 15}).notNull().unique(),
    slug: varchar({length: 100}).notNull().unique(),
    logo: varchar({length: 255}).notNull(),
    cover: varchar({length: 255}).notNull(),
    status: storeStatusEnum("status").notNull().default("PENDING"),
    averageRating: integer().notNull().default(0),
    featured: boolean().default(false).notNull(),
    returnPolicy: text().default(""),
    defaultShippingService: varchar({length: 255}).default(""),
    defaultShippingCost: numeric({precision: 10, scale: 2}).default("0"),
    minimumDeliveryTime: integer().default(0),
    maximumDeliveryTime: integer().default(0),
    ownerId: varchar({length: 255}).notNull().references(() => users.id, {onDelete: "cascade"}),
    ...timestamps

}, (table) => [
    index("idx_stores_owner_id").on(table.ownerId)
])


export const storesRelations = relations(stores, ({one}) => ({
    owner: one(users, {
        fields: [stores.ownerId],
        references: [users.id]
    })
}))

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;


