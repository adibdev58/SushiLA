import {type ProductPost, type CategoryPost, type SignupPost, CustomError, ErrorStatus, StoredProcedureName} from "@sushila/shared"
import {createClient} from "@supabase/supabase-js"
import lowercaseKeys from "lowercase-keys"

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
async function insert(dataToInsert: ProductPost | CategoryPost | SignupPost, storedProcedureName: StoredProcedureName) {
    try {
        const database = await db();
        const data_keysToLowerCase = lowercaseKeys(dataToInsert);
        const {data, error, status} = await database.rpc(storedProcedureName, 
            data_keysToLowerCase
        );

        if(error) {
            const errorMessage = error.message;
            const errorDetails = error.details;
            const errorCause = error.cause;
            throw new CustomError(ErrorStatus.DatabaseError, `Something went wrong with inserting in DB! ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,500)
        }
        
    return {data,status}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,500)
        }
    }
}

async function queryUser(email: string) {
    try {
        const database = await db();
        const {data, error, status} = await database.from("users").select("*").eq("email",email)

        if(error) {
            const errorMessage = error.message;
            const errorDetails = error.details;
            const errorCause = error.cause;
            throw new CustomError(ErrorStatus.DatabaseError, `Something went wrong with DB query! User does not exist! ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,500)
        }
        
    return {data,status}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,500)
        }
    }
}
export {insert,queryUser}