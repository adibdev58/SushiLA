import express from "express";

const app = express();

const port = 5000;

//products
const router = express.Router();
router.get("/")


app.get("/", (req, res)=> {
    res.send("Hssdffiii")
})

const server = app.listen(port, ()=> {
    console.log(`Backend-Server is running at ${port}`)
})