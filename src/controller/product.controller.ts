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

        if (product.length === 0) {
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

export const addNewProduct = async (req: Request, res: Response) => {
    try {
        const {name, price, category} = req.body
        if(!name || !price || !category){
            return res.json({
                statusCode: 404,
                message: "Some fields are missing",
                success: false
            })
        }

        const newProduct = await db
                    .insert(productTable)
                    .values({
                        name,price,category
                    })
                    .returning()
        
        return res.json({
            statusCode: 201,
            data: {product: newProduct},
            message: "Product Created",
            success: true
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log(error);
    }
}

export const getProductsCursorPagination = async (
    req: Request,
    res: Response,
) => {
    try {

        const {cursorCreatedAt = null, cursorId = null} = req.query;
        const { limit = 20, category = null } = req.query;


        const conditions = [];

        if (category) {
            conditions.push(eq(productTable.category, category as (typeof productTable.category.enumValues)[number]));
        }

        if (cursorCreatedAt && cursorId) {
            
            const cursorCreatedAtDate = new Date(cursorCreatedAt as string);
            conditions.push(
                or(
                    lt(productTable.createdAt, cursorCreatedAtDate),
                    and(
                        eq(productTable.createdAt, cursorCreatedAtDate),
                        lt(productTable.id, Number(cursorId)),
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
        const nextCursorCreatedAt = products[lastProduct].createdAt;
        const nextCursorId = products[lastProduct].id;
        const nextCursor = { createdAt: nextCursorCreatedAt, id: nextCursorId };

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
            conditions.push(eq(productTable.category, category as (typeof productTable.category.enumValues)[number]))
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
            currentPage: Number(page),
            nextPage: Number(page) + 1,
        })
    
    } catch (error) {
        if(error instanceof Error){
            throw new Error(error.message)
        }
        console.log(error)
    }
}
