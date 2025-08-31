import {boolean, index, integer, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const categories = pgTable("categories", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull().unique(),
    image: varchar({length: 255}).notNull(),
    slug: varchar({length: 100}).notNull().unique(),
    featured: boolean().default(false),


    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
})


export const subcategories = pgTable("subcategories", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        categoryId: integer().notNull().references(() => categories.id, {onDelete: "cascade"}),
        name: varchar({length: 255}).notNull(),
        image: varchar({length: 255}).notNull(),
        slug: varchar({length: 100}).notNull().unique(),
        featured: boolean().default(false),

        createdAt: timestamp().notNull().defaultNow(),
        updatedAt: timestamp().notNull().defaultNow(),
    },
    (table) => [
        index("idx_subcategories_category_id").on(table.categoryId)
    ]
)

export const categoriesRelations = relations(categories, ({many}) => ({
    subcategories: many(subcategories)
}))

export const subcategoriesRelations = relations(subcategories, ({one}) => ({
    category: one(categories, {
        fields: [subcategories.categoryId],
        references: [categories.id]
    })
}))

export type Category = typeof categories.$inferSelect
export type Subcategory = typeof subcategories.$inferSelect