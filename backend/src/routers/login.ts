import {Router} from "express"
import { type LoginPost, LoginPostSchema, CustomError, ErrorStatus } from "@sushila/shared";
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { queryUser } from "../utils/db.js";
import * as bcrypt from "bcrypt"

const router = Router();

declare module "express-session" {
    interface SessionData {
        email: string
    }
}

//Todo Login implementieren!
router.post("/", async (req, res, next)=> {
    try {
        //when user is already loged in
        if(req.session.email) {
            return res.json({logedIn: true})
        }

        const parsedData = await validateZodScheme(LoginPostSchema,req.body);
        const {email, password} = parsedData;
        const userQuery = await queryUser(email);
        const plainPassword = password;
        const hashedPassword  = userQuery.data.password;
    
        const userQueryWasSuccessful = userQuery.status === 200;
        const passwordIsCorrect = await bcrypt.compare(plainPassword, hashedPassword);
    
        if(!passwordIsCorrect || !userQueryWasSuccessful) throw new CustomError(ErrorStatus.InvalidCredentials, `Password or Email is wrong!`, 401);
        
        req.session.email = email;
        
        return res.json({...userQuery, passwordIsCorrect})

    } catch (err) {
        if(err instanceof CustomError) next(err);
        else {
            const err2 = new CustomError(ErrorStatus.DatabaseError, `Something went wrong with login process! DB-Get-Query error!`,500);
            next(err2)
        }
    }
})

export default router;