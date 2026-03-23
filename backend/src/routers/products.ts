import express from "express"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CustomError ,ErrorStatus, ProductPostSchema, type ProductPost } from 'shared/dist/types.js';
import * as zod from "zod";
import { validateZodScheme } from '../utils/validateZodScheme.js';
import { getTimeStampNowLocal } from "../utils/getTimeStampNowLocal.js";


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

//error-management completed
async function db() {
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if(!supabaseUrl || !supabaseKey) { 
        throw new CustomError(ErrorStatus.NotFoundInEnv, `Supabase variables are missing in the .env!`,500)
    }
 
    try{
        const supabase = createClient(supabaseUrl, supabaseKey);
        return supabase;
    } catch (err) {
        throw new CustomError(ErrorStatus.DatabaseError, `Couldn't connect to the database! Check the correctness of the variables in the .env file. ${JSON.stringify(err)}`,500)
    } 
}

//error-management completed
 async function insert(dataToInsert: ProductPost) {
    try {
        const database = await db();
        const {data, error} = await database.rpc("insert_product_atomic", {
            creationdate: dataToInsert.creationDate, 
            name:dataToInsert.name,
            imgurls:dataToInsert.imgUrls,
            description: dataToInsert.description,
            ingredients: dataToInsert.ingredients,
            weight: dataToInsert.weight,
            price: dataToInsert.price,
            discountprice: dataToInsert.price,
            isavailable: dataToInsert.isAvailable,
            specialfeatures: dataToInsert.specialFeatures,
            categories: dataToInsert.categories
        });
        if(error) {
            const errorMessage = error.message;
            const errorDetails = error.details;
            const errorCause = error.cause;
            throw new CustomError(ErrorStatus.DatabaseError, `Something went wrong with inserting in DB! ${errorMessage} ${errorDetails} ${errorCause}`,500)
        }
    return {data}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,500)
        }
    }
}

//completed
router.post("/", async (req, res, next)=> {
    try {
        const parsedBody = validateZodScheme(ProductPostSchema,req.body);
        res.status(201).json({response: await insert(parsedBody)})
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `Something went wrong with POST-operation! ${err}`, 500))
        }
    }
    
})

export default router