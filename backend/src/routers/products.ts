import express from "express"
import {type Request, type NextFunction} from "express"
import { CustomError ,ErrorStatus, ProductPostReqSchema, type ProductDbInsert, StoredProcedureName, CustomResponse, type ResponseObjectType, type ProductPostResponse } from '@sushila/shared';
import { validateZodScheme } from '../utils/validateZodScheme.js';
import {insertProduct} from "../utils/db.js"
import {isFromAdminEndpoint} from "../middleware/index.js";

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

//Todo: Test /admin route post role implementation
//Todo: Refactor because of changes in DB-table of Products.
router.post("/", isFromAdminEndpoint, async (req:Request, res: ResponseObjectType<ProductPostResponse>, next:NextFunction)=> {
    try {
        const parsedBody: ProductDbInsert = await validateZodScheme(ProductPostReqSchema,req.body);
        const insertedData:ProductPostResponse = await insertProduct(parsedBody);

        const response: CustomResponse<ProductPostResponse> = new CustomResponse(true, insertedData);

        res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB Insert Error`, ` ${err}`,500))
        }
    }   
})

//Todo: Implement Put
//Todo: Added lastUpdateDate, lastUser and creator-Colums to products table in DB. So adjust all controllers/request-handlers for products-Endpoints.
router.put('/:productId',isFromAdminEndpoint, async (req , res, next) => {
     try {
        /* const parsedBody: ProductPost = await validateZodScheme(ProductPostSchema,req.body);
        const insertionData = await insert(parsedBody, StoredProcedureName.insert_product_atomic);

        const responseData: ProductPostResponseData = parsedBody;
        const response: CustomResponse<ProductPostResponseData> = new CustomResponse(true, responseData); */

        //res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB update Error`, `${err}`,500))
        }
    }   
})

export default router