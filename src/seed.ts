import { db } from "./db/index.js";
import { productTable } from "./db/schema.js";

const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Sports",
    "Home",
    "Grocery",
    "Toys",
    "Beauty",
] as const

 async function bulkInsert() {
    const TOTAL_PRODUCTS = 200000;
    const BATCH_SIZE = 5000;
    const n = TOTAL_PRODUCTS / BATCH_SIZE;

    for (let i = 0; i < n; i++) {
        const products = [];
        for (let j = 0; j < BATCH_SIZE; j++) {
            const name = `Product-${i * BATCH_SIZE + j}`;
            const randomCategoryIndex = Math.floor(
                Math.random() * categories.length,
            );
            const category = categories[randomCategoryIndex]
            const price = Math.ceil(Math.random() * 100000);
            const now = Date.now();
            const createdAt = new Date(
                now - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
            );

            const updatedAt = new Date(
                createdAt.getTime() +
                    Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
            );

            products.push({ name, category, price, createdAt, updatedAt });
        }

        await db.insert(productTable).values(products)

    }
}
await bulkInsert();
