import express, { type ErrorRequestHandler, type NextFunction } from "express";
import dotenv from "dotenv";

import {rootRouterV1} from "./routers/index.js";
import {CustomError, ErrorStatus} from "../../shared/types.js"
import { time, timeStamp } from "node:console";

dotenv.config();
const app = express();
const port = process.env.PORT;

//products
const productsRouter = express.Router();

app.use("/api/v1", rootRouterV1);
app.use("", (req, res, next) => {
    next(new CustomError(ErrorStatus.NoRessourceFound,`Ressource couldn't be found!`, 404));
})

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next) => {
    const {statusCode, status, message, timeStamp}:CustomError = err;
    if(!statusCode || !status || !message || !timeStamp) {
        throw new Error(`Exeption occured in globalErrorHandler! Some data was missing! statusCode: ${statusCode}, status: ${status}, message: ${message}, timeStamp: ${timeStamp}`)
    }
    res.status(statusCode);
    res.json(
        {
            statusCode,
            status,
            message,
            timeStamp
        }
    )
};

app.use(globalErrorHandler)

const server = app.listen(port, ()=> {
    console.log(`Backend-Server is running at ${port}`)
})