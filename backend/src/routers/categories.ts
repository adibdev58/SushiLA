import {Router} from "express"
import { CustomError ,ErrorStatus, CategoriesSchema, type CategoriesPost } from '@sushila/shared';
 
const router = Router();

router.post("/", (req,res,next)=> {
    try {
        const parsedBody = CategoriesSchema.parse(req.body);
        res.json(parsedBody)
    } catch(err) {
        if( err instanceof CustomError) {
            throw err
        } else {
            throw new CustomError(ErrorStatus.ServerError,`Something went wrong with inserting in DB! ${err}`,500)
        }
       
    }
})

export default router;