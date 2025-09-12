ALTER TABLE "variants" ADD COLUMN "sku" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_sku_unique" UNIQUE("sku");