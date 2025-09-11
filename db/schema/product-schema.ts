import {boolean, decimal, index, integer, pgTable, text, varchar} from "drizzle-orm/pg-core";
import {timestamps} from "@/db/columns.helpers";
import {stores} from "@/db/schema/store";
import {categories, subcategories} from "@/db/schema/categories";
import {relations} from "drizzle-orm";

export const products = pgTable("products", {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar({length: 255}).notNull(),
        description: text().notNull(),
        slug: varchar({length: 100}).notNull().unique(),
        brand: varchar({length: 100}).notNull(),
        rating: decimal({precision: 2, scale: 1}).notNull().default("0.0"),
        image: varchar({length: 255}).notNull(),

        offerTagId: integer().references(() => offerTags.id, {onDelete: "set null"}),

        storeId: integer().notNull().references(() => stores.id, {onDelete: "cascade"}),
        categoryId: integer().notNull().references(() => categories.id, {onDelete: "restrict"}),
        subcategoryId: integer().references(() => subcategories.id, {onDelete: "set null"}),

        ...timestamps,

    }, (table) => [
        index("idx_product_store_id").on(table.storeId),
        index("idx_product_category_id").on(table.categoryId),
        index("idx_product_subcategory_id").on(table.subcategoryId),
    ]
)

export const variants = pgTable("variants", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    variantName: varchar({length: 100}).notNull(),
    variantDescription: text().notNull(),
    price: decimal({precision: 10, scale: 2}),
    slug: varchar({length: 100}).notNull().unique(),
    isSale: boolean().default(false),
    saleEndDate: varchar({length: 50}),
    weight: decimal({precision: 8, scale: 2}).notNull(),


    keywords: text().notNull(),
    sku: varchar({length: 100}).notNull().unique(),

    productId: integer().notNull().references(() => products.id, {onDelete: "cascade"}),

    ...timestamps,
}, (table) => [
    index("idx_variant_product_id").on(table.productId)
])

export const sizes = pgTable("sizes", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    size: varchar({length: 50}).notNull(),
    quantity: integer().notNull().default(0),
    price: decimal({precision: 10, scale: 2}).notNull(),
    discount: decimal({precision: 5, scale: 2}).notNull().default("0.00"),
    variantId: integer().notNull().references(() => variants.id, {onDelete: "cascade"}),

    ...timestamps,
}, (table) => [
    index("idx_size_variant_id").on(table.variantId)
])

export const productVariantImages = pgTable("product_variant_images", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: varchar({length: 255}).notNull(),
    altText: varchar({length: 150}).notNull().default("Product Image"),
    variantId: integer().notNull().references(() => variants.id, {onDelete: "cascade"}),

    ...timestamps,
}, (table) => [
    index("idx_image_variant_id").on(table.variantId)
])

export const colors = pgTable("colors", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    hexCode: varchar({length: 7}),
    variantId: integer().notNull().references(() => variants.id, {onDelete: "cascade"}),

    ...timestamps,
}, (table) => [
    index("idx_color_variant_id").on(table.variantId)
])

export const offerTags = pgTable("offer_tags", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 100}).notNull(),
    url: varchar({length: 255}).notNull().unique(),
    ...timestamps,
})

export const specs = pgTable("specs", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 100}).notNull(),
    value: text().notNull(),
    productId: integer().references(() => products.id, {onDelete: "cascade"}),
    variantId: integer().references(() => variants.id, {onDelete: "cascade"}),
    ...timestamps,
}, (table) => [
    index("idx_spec_product_id").on(table.productId),
    index("idx_spec_variant_id").on(table.variantId)
])

export const productsRelations = relations(products, ({one, many}) => ({
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id]
    }),
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
    }),
    subcategory: one(subcategories, {
        fields: [products.subcategoryId],
        references: [subcategories.id]
    }),
    variants: many(variants)
}))

export const variantsRelations = relations(variants, ({one, many}) => ({
    product: one(products, {
        fields: [variants.productId],
        references: [products.id]
    }),
    sizes: many(sizes),
    images: many(productVariantImages),
    colors: many(colors)
}))

export const sizesRelations = relations(sizes, ({one}) => ({
    variant: one(variants, {
        fields: [sizes.variantId],
        references: [variants.id]
    })
}))

export const productVariantImagesRelations = relations(productVariantImages, ({one}) => ({
    variant: one(variants, {
        fields: [productVariantImages.variantId],
        references: [variants.id]
    })
}))

export const colorsRelations = relations(colors, ({one}) => ({
    variant: one(variants, {
        fields: [colors.variantId],
        references: [variants.id]
    })
}))

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Variant = typeof variants.$inferSelect;
export type NewVariant = typeof variants.$inferInsert;
export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;
export type ProductVariantImage = typeof productVariantImages.$inferSelect;
export type NewProductVariantImage = typeof productVariantImages.$inferInsert;
export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;