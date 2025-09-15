ALTER TABLE "shipping_rates" ADD COLUMN "storeId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_storeId_stores_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_shipping_rates_store_id" ON "shipping_rates" USING btree ("storeId");