import {index, integer, numeric, pgTable, text, uniqueIndex, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/columns.helpers";
import {countries} from "@/db/schema/countries";
import {relations} from "drizzle-orm";
import {stores} from "@/db/schema/store";

export const shippingRates = pgTable("shipping_rates", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    returnPolicy: text(),
    shippingService: varchar({length: 255}),
    shippingCostPerItem: numeric({precision: 10, scale: 2}),
    shippingCostAdditionalItem: numeric({precision: 10, scale: 2}),
    shippingCostPerKg: numeric({precision: 10, scale: 2}),
    shippingCostFixed: numeric({precision: 10, scale: 2}),
    minimumDeliveryTime: integer(),
    maximumDeliveryTime: integer(),
    countryId: integer().references(() => countries.id, {onDelete: "cascade"}).notNull(),
    storeId: integer().references(() => stores.id, {onDelete: "cascade"}).notNull(),
    ...timestamps
}, (table) => [
    index("idx_shipping_rates_country_id").on(table.countryId),
    index("idx_shipping_rates_store_id").on(table.storeId),
    uniqueIndex("shipping_rates_store_country").on(table.storeId, table.countryId)
])


export const shippingRatesRelations = relations(shippingRates, ({one}) => ({
    country: one(countries, {
        fields: [shippingRates.countryId],
        references: [countries.id]
    }),
    store : one(stores, {
        fields: [shippingRates.storeId],
        references: [stores.id]
    })
}))


export type ShippingRate = typeof shippingRates.$inferSelect
export type NewShippingRate = typeof shippingRates.$inferInsert