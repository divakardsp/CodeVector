import express from "express";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/health", (req: Request, res: Response) => {
    res.json({healthy: true});
})

export default app;