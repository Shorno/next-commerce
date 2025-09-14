ALTER TABLE "stores" ADD COLUMN "defaultShippingCostPerItem" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "defaultShippingCostAdditionalItem" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "defaultShippingCostPerKg" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "defaultShippingCostFixed" numeric(10, 2) DEFAULT '0';