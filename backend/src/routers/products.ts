import express from "express"
import { createClient } from "@supabase/supabase-js";


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

async function db() {
    try {
        const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

        if(!supabaseUrl || !supabaseKey) {
            throw new Error(`Supabase keys are missing in .env!`)
        }
        const supabase = createClient(supabaseUrl, supabaseKey);
        return supabase;

    } catch (err) {
        console.log(err)
    }
}



async function insert() {
    const database = await db();

    if(!database) {
        return
    }
    const {format} = await import("date-fns");
    const dateNow = new Date(Date.now());
    const timeStamp = format(dateNow,`dd/MM/yyyy pppp`);
    console.log(`Timestamp ${timeStamp}`)
    const {data, error} = await database.from('products')
    .insert({creation_date: timeStamp, name: `test 00:15 09.03.26`, description: 'blablabla', weight: 5, price: 5, discount_price: 0, is_available: true})

    return {data, error}
}

router.post("/", async (req, res)=> {
    const db_response = await insert();
    console.log(db_response)
    res.status(500).json({response: db_response})
})

export default router