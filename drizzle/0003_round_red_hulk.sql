DROP INDEX "idx_products_updated_id";--> statement-breakpoint
CREATE INDEX "idx_products_created_id" ON "products" USING btree ("created_at","id");