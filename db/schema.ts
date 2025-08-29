import {boolean, index, integer, pgEnum, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

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
    (table) => ({
        categoryIdx: index("idx_subcategories_category_id").on(table.categoryId)
    })
)

export const categoriesRelations = relations(categories, ({many}) => ({
    subcategories: many(categories)
}))

export const subcategoriesRelations = relations(subcategories, ({one}) => ({
    category: one(categories, {
        fields: [subcategories.categoryId],
        references: [categories.id]
    })
}))


export type NewUser = typeof users.$inferInsert
export type UserRole = typeof roleEnum.enumValues[number]
export type Category = typeof categories.$inferSelect
export type Subcategory = typeof subcategories.$inferSelect