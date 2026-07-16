import {Router, type Response} from "express"
import {LoginPostSchema, CustomResponse, type ResponseObjectType, CustomError, ErrorStatus, type LoginPostResponseData } from "@sushila/shared";
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { queryUser } from "../utils/db.js";
import * as bcrypt from "bcrypt"

const router = Router();

declare module "express-session" {
    interface SessionData {
        email: string,
        forename: string,
        lastname: string
    }
}

//Completed
router.post("/", async (req, res: ResponseObjectType<LoginPostResponseData>, next)=> {
    try {
        const parsedData = await validateZodScheme(LoginPostSchema,req.body);
        const {email, password} = parsedData;
        const userQuery = await queryUser(email);
        const plainPassword = password;
        const hashedPassword  = userQuery.data.password;
        const forename = userQuery.data.forename;
        const lastname = userQuery.data.lastname;
        const userId = userQuery.data.id;

        const passwordIsCorrect =  await bcrypt.compare(plainPassword, hashedPassword);
    
        if(!passwordIsCorrect) throw new CustomError(ErrorStatus.InvalidCredentials, `Invalid credentials`,`The provided email address ${email} or password does not match our records. Authentication failed.`, 401);
        
        req.session.email = email;
        req.session.forename = forename;
        req.session.lastname = lastname;
        
        const responseData: LoginPostResponseData = {
            email,
            forename,
            lastname,
            id: userId
        }
        const customResponse = new CustomResponse(true, responseData)
        return res.json(customResponse)

    } catch (err) {
        if(err instanceof CustomError) next(err);
        else {
            const err2 = new CustomError(ErrorStatus.DatabaseError, `Login failed`,`An unexpected error occurred during the authentication process. Please try again later.`,500);
            next(err2)
        }
    }
})

export default router;