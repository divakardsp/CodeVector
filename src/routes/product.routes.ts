import { Router } from "express";
import { getProductsCursorPagination, updateProductPrice } from "../controller/product.controller.js";


const router = Router();

router.post("/update-product/:id", updateProductPrice);
router.get("/get-products", getProductsCursorPagination)


export default router;