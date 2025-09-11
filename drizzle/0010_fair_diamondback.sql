CREATE TABLE "offer_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "offer_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"url" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "offer_tags_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "specs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "specs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"productId" integer,
	"variantId" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "offerTagId" integer;--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "saleEndDate" varchar(50);--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "weight" numeric(8, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "specs" ADD CONSTRAINT "specs_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "specs" ADD CONSTRAINT "specs_variantId_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_spec_product_id" ON "specs" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "idx_spec_variant_id" ON "specs" USING btree ("variantId");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_offerTagId_offer_tags_id_fk" FOREIGN KEY ("offerTagId") REFERENCES "public"."offer_tags"("id") ON DELETE set null ON UPDATE no action;