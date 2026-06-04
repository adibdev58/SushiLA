import {type ProductPost, type CategoryPost, type SignupPost, type UserQueryData, CustomError, ErrorStatus, StoredProcedureName} from "@sushila/shared"
import {createClient} from "@supabase/supabase-js"
import lowercaseKeys from "lowercase-keys"

async function db() {
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if(!supabaseUrl || !supabaseKey) { 
        throw new CustomError(ErrorStatus.NotFoundInEnv, `Supabase variables are missing in the .env!`, `PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is missing in .env.`,500)
    }
 
    try{
        const supabase = createClient(supabaseUrl, supabaseKey);
        return supabase;
    } catch (err) {
        throw new CustomError(ErrorStatus.DatabaseError, `Invalid environment variables in .env.`,`Failed to connect to the database. Please verify PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY variables in the .env file. ${JSON.stringify(err)}`,500)
    } 
}

type InsertResponseData= {
    data: ProductPost | CategoryPost | SignupPost,
    status: number
}
async function insert(dataToInsert: ProductPost | CategoryPost | SignupPost, storedProcedureName: StoredProcedureName):Promise<InsertResponseData> {
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
            throw new CustomError(ErrorStatus.DatabaseError, `DB Insert Error`,`Something went wrong while inserting into the database! Check the ${storedProcedureName} function in the DB. ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}}`,500)
        }
        
    return {data,status}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,`Unexpected error during database insert operation! Raw error: ${err}`,500)
        }
    }
}

async function queryUser(email: string):Promise<{
    data: UserQueryData,
    status: number
}> {
    try {
        const database = await db();
        const {data, error, status} = await database
            .from("users")
            .select("*")
            .eq("email",email).single();

        if(error) {
            const errorMessage = error.message;
            const errorDetails = error.details;
            const errorCause = error.cause;
            throw new CustomError(ErrorStatus.DatabaseError,`User not found!`, `Something went wrong with the DB query! User does not exist. ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,404)
        }
        
    return {data,status}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,`Unexpected error during database insert operation! rawError: ${err}`,500)
        }
    }
}
export {insert,queryUser}