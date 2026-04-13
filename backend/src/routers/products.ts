import express from "express"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CustomError ,ErrorStatus, ProductPostSchema, type ProductPost, StoredProcedureName } from '@sushila/shared';
import { validateZodScheme } from '../utils/validateZodScheme.js';
import {insert} from "../utils/db.js"

const router = express.Router();

//max 30 newest products
router.get("/", (req, res)=> {
    res.json(
        {
            id: 1,
            name: "mango"
        }
    )
})

//completed
router.post("/", async (req, res, next)=> {
    try {
        const parsedBody: ProductPost = await validateZodScheme(ProductPostSchema,req.body);
        res.status(201).json({response: await insert(parsedBody, StoredProcedureName.insert_product_atomic)})
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `Something went wrong with POST-operation! ${err}`, 500))
        }
    }
    
})

export default router