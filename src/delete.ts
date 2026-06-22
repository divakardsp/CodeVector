import { db } from "./db/index.js";
import { productTable } from "./db/schema.js";

import { sql } from "drizzle-orm";

await db.execute(
  sql`TRUNCATE TABLE products RESTART IDENTITY`
);