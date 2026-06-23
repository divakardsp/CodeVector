import express from "express";
import type { Request, Response } from "express";
import productRouter from "./routes/product.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", (req: Request, res: Response) => {
    res.json({healthy: true});
})

app.use("/api/product",productRouter )

export default app;