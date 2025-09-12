ALTER TABLE "specs" DROP CONSTRAINT "specs_productId_products_id_fk";
--> statement-breakpoint
DROP INDEX "idx_spec_product_id";--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "isSale" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "specs" DROP COLUMN "productId";