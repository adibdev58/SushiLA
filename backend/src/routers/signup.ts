import {Router} from "express"
import * as zod from "zod"
import {CustomError, ErrorStatus, SignupPostSchema, type SignupPost, StoredProcedureName} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { insert } from "../utils/db.js";

const router = Router();



//Todo: Andere procedure funktionen in supabase refactoren, sodass sie die eingefügten Daten zurücksenden. (ps: keien Passwörter zurücksenden!)
//Todo: Passwort erst hashen und in den Datenbank einfügen
router.post("/", async (req, res, next)=> {
    try {
        const parsedData: SignupPost = validateZodScheme(SignupPostSchema,req.body);
        const result = await insert(parsedData,StoredProcedureName.insert_user);
        res.status(201).json(result);
    } catch (err) {
        if(err instanceof CustomError) {
            throw err
        }
        else {
            throw new CustomError(ErrorStatus.ServerError, `Something went wrong with POST-operation! ${err}`,500)
        }
    }

    
})

export default router;