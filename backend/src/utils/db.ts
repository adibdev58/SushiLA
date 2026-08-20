import {type ProductDbInsert, type ProductPostResponse, type CategoryDbInsert, type CategoryPostResponse, type SignupDbInsert, type SignupPostResponse, type UserQueryData, CustomError, ErrorStatus, StoredProcedureName, roles} from "@sushila/shared"
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
type InsertResponseData = ProductDbInsert | CategoryPostResponse | SignupPostResponse;

async function insert(dataToInsert: ProductDbInsert | CategoryPostResponse | SignupDbInsert, storedProcedureName: StoredProcedureName):Promise<InsertResponseData> {
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
            throw new CustomError(ErrorStatus.DatabaseError, `DB Insert Error`,`Something went wrong while inserting into the database! Check the ${storedProcedureName} function in the DB. ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,500)
        }

    return data
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,`Unexpected error during database insert operation! Raw error: ${err}`,500)
        }
    }
}


//Todo: Create other individual inserting functions which insert/does only one thing! insert-function should be eventually deleted!
//Main function for inserting in DB. Other insertion functions just use/extend this.
async function executeInsertion<T>(dataToInsert: Record<string,unknown>, storedProcedureName: StoredProcedureName, errorShort: string):Promise<T> {
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
            throw new CustomError(ErrorStatus.DatabaseError, errorShort,`Something went wrong while inserting into the database! Check the ${storedProcedureName} function in the DB. ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,500)
        }

    return data
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,`Unexpected error during database insert operation! Raw error: ${err}`,500)
        }
    }
}

//Todo: The timestamps in the database are not saved with their time zone differences.
async function insertProduct(product:ProductDbInsert):Promise<ProductPostResponse> {
    const insertionResponse = await executeInsertion<ProductPostResponse>(product, StoredProcedureName.insert_product_atomic, `Failed to insert the new product.`);
    return insertionResponse
}

//Todo: The post or insertion operations must return an id of the new ressource which is created. Start with category. Update the API schema in Notepad++.
//Todo: Refactor the DB function insert_product_atomic. It looks horrible/unreadable. 
async function insertCategory(category:CategoryDbInsert):Promise<CategoryPostResponse> {
    const insertionResponse = await executeInsertion<CategoryPostResponse>(category, StoredProcedureName.insert_category, `Failed to insert the new category.`);
    return insertionResponse
}
 
async function insertUser(user:SignupDbInsert):Promise<SignupPostResponse> {
    const insertionResponse = await executeInsertion<SignupPostResponse>(user, StoredProcedureName.insert_user, `Failed to insert the new user.`);
    return insertionResponse
}


async function queryUser(email: string):Promise<{
    data: UserQueryData
}> {
    try {
        const database = await db();
        const {data, error} = await database
            .from("users")
            .select("*")
            .eq("email",email).single();

        if(error) {
            const errorMessage = error.message;
            const errorDetails = error.details;
            const errorCause = error.cause;
            throw new CustomError(ErrorStatus.EmailNotRegistered,`User not found!`, `Make sure your email is registered. DB Error: ${errorMessage ?? ""} ${errorDetails ?? ""} ${errorCause ?? ""}`,404)
        }
        
    return {data}
    } catch(err) {
        if(err instanceof CustomError) {
            throw err;
        } else {
            throw new CustomError(ErrorStatus.DatabaseError,`Something went wrong with DB!`,`Unexpected error during database insert operation! rawError: ${err}`,500)
        }
    }
}

async function userExists(email: string):Promise<boolean> {
    const dbClient = await db();
    const {error, data} = await dbClient.from('users').select('*').eq('email',email);

    if(error) {
        const {message, details} = error;
        throw new CustomError(ErrorStatus.DatabaseError, `DB Query failed!`, `${message} ${details}`, 500);
    }
    const userExists = data.length > 0;
    return userExists
}

async function queryRoleId(role: roles): Promise<number> {
    const database = await db();
    const {data, error} = await database
                            .from('roles')
                            .select('id')
                            .eq('role',`${role}`);
    if(error) {
        throw new CustomError(ErrorStatus.DatabaseError, `DB Query failed for ${role} role!`, `${error}`, 500);
    }

    if(!data) {
        throw new CustomError(ErrorStatus.DatabaseError, `${role} role not found in DB!`, `´Make sure ${role} is in roles table in DB and try again.`, 500); 
    }
    const roleId = data[0]?.id;

    return roleId
}

async function queryRoleWithId(roleId: number): Promise<string> {
    const database = await db();
    const {data, error} = await database
                            .from('roles')
                            .select('role')
                            .eq('id',`${roleId}`);
    if(error) {
        throw new CustomError(ErrorStatus.DatabaseError, `DB Query failed for ${roleId} role!`, `${error}`, 500);
    }

    if(!data) {
        throw new CustomError(ErrorStatus.DatabaseError, `${roleId} role not found in DB!`, `´Make sure ${roleId} is in roles table in DB and try again.`, 500); 
    }
    const roleName = data[0]?.role;

    return roleName
}
export {insertUser,insertProduct,insertCategory,queryUser,userExists,queryRoleId,queryRoleWithId}