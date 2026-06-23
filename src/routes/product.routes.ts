import { Router } from "express";
import { addNewProduct, gerProductsOffsetpagination, getProductsCursorPagination, updateProductPrice } from "../controller/product.controller.js";


const router = Router();

router.patch("/update-product/:id", updateProductPrice);
router.get("/get-products", getProductsCursorPagination)
router.post("/create-product", addNewProduct)
router.get("/get-products-by-offset", gerProductsOffsetpagination)


export default router;