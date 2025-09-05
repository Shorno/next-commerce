CREATE TYPE "public"."store_status" AS ENUM('ACTIVE', 'PENDING', 'BANNED', 'DISABLED');--> statement-breakpoint
CREATE TABLE "stores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "stores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"image" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"logo" varchar(255) NOT NULL,
	"cover" varchar(255) NOT NULL,
	"status" "store_status" DEFAULT 'PENDING' NOT NULL,
	"averageRating" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false,
	"returnPolicy" text DEFAULT '',
	"defaultShippingService" varchar(255) DEFAULT '',
	"defaultShippingCost" numeric(10, 2) DEFAULT '0',
	"minimumDeliveryTime" integer DEFAULT 0,
	"maximumDeliveryTime" integer DEFAULT 0,
	"ownerId" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "stores_name_unique" UNIQUE("name"),
	CONSTRAINT "stores_email_unique" UNIQUE("email"),
	CONSTRAINT "stores_phone_unique" UNIQUE("phone"),
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_stores_owner_id" ON "stores" USING btree ("ownerId");