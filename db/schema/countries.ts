import {integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/columns.helpers";
import {relations} from "drizzle-orm";
import {shippingRates} from "@/db/schema/shipping";

export const countries = pgTable("countries", {
    id: integer().primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({length: 100}).notNull().unique(),
    code: varchar({length: 10}).notNull().unique(),
    dialCode: varchar({length: 10}).notNull(),
    ...timestamps
})

export const countriesRelations = relations(countries, ({many}) => ({
    shippingRates: many(shippingRates)
}))

