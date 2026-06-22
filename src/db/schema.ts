import {
    index,
    integer,
    pgEnum,
    pgTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { table } from "node:console";

export const categoryEnum = pgEnum("category", [
    "Electronics",
    "Books",
    "Clothing",
    "Sports",
    "Home",
    "Grocery",
    "Toys",
    "Beauty",
    "Other",
]);

export const productTable = pgTable(
    "products",
    {
        id: serial("id").primaryKey(),
        name: varchar("name").notNull(),
        category: categoryEnum("category").default("Other").notNull(),
        price: integer("price").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        updatedIdIdx: index("idx_products_updated_id").on(
            table.updatedAt,
            table.id,
        ),
    }),
);

