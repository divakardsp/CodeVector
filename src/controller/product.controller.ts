import type { Request, Response } from "express"
import { db } from "../db/index.js";
import { productTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const updateProductPrice = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {price} = req.body;

    if(!id){
        return res.json({
            statusCode: 401,
            message: "Id is missing",
            success: false,
        })
    }

    const product = await db
        .select()
        .from(productTable)
        .where(eq(productTable.id, Number(id)))

    if(!product){
        return res.json({
            statusCode: 404,
            message: "Product with this id does not exist",
            success: false,
        })
    }

    const updatedProduct = await db    
        .update(productTable)
        .set({
            price
        })
        .where(eq(productTable.id, Number(id)))
        .returning();

    return res.json({
        statusCode: 201,
        message: "Product Updated",
        data: updatedProduct,
        success: true,
    })
}

