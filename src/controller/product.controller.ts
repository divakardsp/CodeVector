import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { productTable } from "../db/schema.js";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const updateProductPrice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { price } = req.body;

        if (!id) {
            return res.json({
                statusCode: 401,
                message: "Id is missing",
                success: false,
            });
        }

        const product = await db
            .select()
            .from(productTable)
            .where(eq(productTable.id, Number(id)));

        if (!product) {
            return res.json({
                statusCode: 404,
                message: "Product with this id does not exist",
                success: false,
            });
        }

        const updatedProduct = await db
            .update(productTable)
            .set({
                price,
            })
            .where(eq(productTable.id, Number(id)))
            .returning();

        return res.json({
            statusCode: 201,
            message: "Product Updated",
            data: updatedProduct,
            success: true,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log(error);
    }
};

export const getProductsCursorPagination = async (
    req: Request,
    res: Response,
) => {
    try {

        const cursor = req.body?.cursor || {};
        const { limit = 20, category = null } = req.query;

        const keysLengthOfCursor = Object.keys(cursor).length;

        const conditions = [];

        if (category) {
            conditions.push(eq(productTable.category, category));
        }

        if (keysLengthOfCursor !== 0) {
            const cursorCreatedAtDate = new Date(cursor.createdAt);
            conditions.push(
                or(
                    lt(productTable.createdAt, cursorCreatedAtDate),
                    and(
                        eq(productTable.createdAt, cursorCreatedAtDate),
                        lt(productTable.id, cursor.id),
                    ),
                ),
            );
        }

        const products = await db
            .select()
            .from(productTable)
            .where(conditions.length ? and(...conditions) : undefined)
            .orderBy(desc(productTable.createdAt), desc(productTable.id))
            .limit(Number(limit));

        const lastProduct = Number(limit) - 1;
        const cursorCreatedAt = products[lastProduct].createdAt;
        const cursorId = products[lastProduct].id;
        const nextCursor = { createdAt: cursorCreatedAt, id: cursorId };

        return res.json({
            statusCode: 201,
            data: { products },
            success: true,
            cursor: nextCursor,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        console.log(error);
    }
};

export const gerProductsOffsetpagination = async (req: Request, res: Response) => {
    try {
        const {page = 1, limit = 20, category = null} = req.query;
    
        const conditions = [];
    
        if(category){
            conditions.push(eq(productTable.category, category))
        }
    
        const offset = (Number(page)-1) * Number(limit)
    
        const products = await db
                .select()
                .from(productTable)
                .where(conditions.length ? and(...conditions) : undefined)
                .orderBy(
                    desc(productTable.createdAt),
                    desc(productTable.id)
                )
                .limit(Number(limit))
                .offset(offset)
    
        return res.json({
            statusCode: 201,
            data: {products},
            success: true,
            previousPage: Number(page)-1 === 0 ? null : Number(page)-1,
            nextPage: Number(page) + 1,
        })
    
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
        console.log(error)
    }
}
