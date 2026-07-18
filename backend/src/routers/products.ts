import express from "express"
import { CustomError ,ErrorStatus, ProductPostSchema, type ProductPost, StoredProcedureName, CustomResponse, type ResponseObjectType, type ProductPostResponseData } from '@sushila/shared';
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


//Todo: Nest admin route/endpoint with products. So its only available under hosturl/admin/products
router.post("/", async (req, res: ResponseObjectType<ProductPostResponseData>, next)=> {
    try {
        //admin route adds true to req.isFromAdminEndpoint
        if(!req.isFromAdminEndpoint) {
            throw new CustomError(ErrorStatus.NoRessourceFound, `Ressource couln't be found!`, `Send your POST-Request to admin/products.`,500)
        }
        const parsedBody: ProductPost = await validateZodScheme(ProductPostSchema,req.body);
        const insertionData = await insert(parsedBody, StoredProcedureName.insert_product_atomic);

        const responseData: ProductPostResponseData = parsedBody;
        const response: CustomResponse<ProductPostResponseData> = new CustomResponse(true, responseData);

        res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB Insert Error`, ` ${err}`,500))
        }
    }   
})

export default router