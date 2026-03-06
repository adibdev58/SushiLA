import express, { type ErrorRequestHandler, type NextFunction } from "express";
import dotenv from "dotenv";

import {rootRouterV1} from "./routers/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

//products
const productsRouter = express.Router();


enum ErrorStatus {
    NoRessource = "NoRessource",
}

type Error1 = {
    statusCode: number,
    status: ErrorStatus,
    message: string
}

app.use("/api/v1", rootRouterV1);
app.use("", (req, res, next) => {
    const error:Error1 = {
        statusCode: 404,
        status: ErrorStatus.NoRessource,
        message: "Ressource couldn't be found!"
    };
    next(error);
})

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next) => {
    const {statusCode, status, message}:Error1 = err;
    if(!statusCode || !status || !message) {
        throw new Error(`Exeption occured in globalErrorHandler! Some data was missing! statusCode: ${statusCode}, status: ${status}, message: ${message}`)
    }
    res.status(statusCode);
    res.json(
        {
            statusCode,
            status,
            message
        }
    )
};

app.use(globalErrorHandler)

const server = app.listen(port, ()=> {
    console.log(`Backend-Server is running at ${port}`)
})