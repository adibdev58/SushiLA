import express from "express"
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CustomError ,ErrorStatus } from 'shared/types.js';
import * as zod from "zod";
import { validateZodScheme } from '../../utils/validateZodScheme.js';
import { getTimeStampNowLocal } from "../../utils/getTimeStampNowLocal.js";


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
 async function insert(data?: any) {
    try {
        const database = await db();
        const {data, error} = await database.from('products')
        .insert({})
        if(error) {
            const errorMessage = error.message;
            throw new CustomError(ErrorStatus.DatabaseError, `Something went wrong with inserting in DB! ${errorMessage}`,500)
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



//error-management completed
router.post("/", async (req, res, next)=> {
    try {

        const Products = zod.object({
          name: zod.string().trim().min(1).max(99),
          imgUrls: zod.array(
            zod.object({ id: zod.int().nonnegative(), url: zod.string().trim().min(1).max(1000) }),
          ),
          description: zod.string().trim().min(1).max(2000),
          ingredients: zod.array(zod.string().trim().min(1).max(50)),
          weight: zod.int().min(1).max(9999),
          price: zod.float32().min(0).max(999.999),
          discountPrice: zod.float32().min(0).max(999.999),
          is_available: zod.boolean(),
          specialFeatures: zod.array(
            zod.object({ id: zod.int().nonnegative(), name: zod.string().trim().min(1).max(1000) }),
          ),
          categories: zod.array(
            zod.object({ id: zod.int().nonnegative(), name: zod.string().trim().min(1).max(1000) }),
          ),
        }).transform(
            (val)=> {
                return {
                    creationDate: getTimeStampNowLocal(),
                    ...val
                }
            }
        );

        const parsedBody = validateZodScheme(Products,req.body);
  
        res.status(201).json({response: parsedBody})
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.DatabaseError, `Something went wrong with DB! ${err}`, 500))
        }
    }
    
})

export default router