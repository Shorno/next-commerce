CREATE TABLE "shipping_rates" (
	"returnPolicy" text,
	"shippingService" varchar(255),
	"shippingCostPerItem" numeric(10, 2),
	"shippingCostAdditionalItem" numeric(10, 2),
	"shippingCostPerKg" numeric(10, 2),
	"shippingCostFixed" numeric(10, 2),
	"minimumDeliveryTime" integer,
	"maximumDeliveryTime" integer,
	"countryId" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_countryId_countries_id_fk" FOREIGN KEY ("countryId") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_shipping_rates_country_id" ON "shipping_rates" USING btree ("countryId");--> statement-breakpoint
ALTER TABLE "countries" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "colors" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "offer_tags" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "product_variant_images" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "sizes" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "specs" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "variants" DROP COLUMN "deleted_at";