import { Router } from "express";
import { updateProductPrice } from "../controller/product.controller.js";


const router = Router();

router.post("/update-product/:id", updateProductPrice);


export default router;