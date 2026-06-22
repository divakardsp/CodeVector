CREATE TYPE "public"."category" AS ENUM('Electronics', 'Books', 'Clothing', 'Sports', 'Home', 'Grocery', 'Toys', 'Beauty', 'Other');--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" "category" DEFAULT 'Other' NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
