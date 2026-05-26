import express, { type ErrorRequestHandler, type NextFunction } from "express";
import dotenv from "dotenv";
import path from "node:path";

import {rootRouterV1} from "./routers/index.js";
import {CustomResponse, CustomError, ErrorStatus} from "@sushila/shared"


process.chdir(path.resolve(import.meta.dirname, ".."))
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use("/api/v1", rootRouterV1);
app.use("", (req, res, next) => {
    next(new CustomError(ErrorStatus.NoRessourceFound,`Resource not found!`, `The requested resource with the provided ID does not exist in the database or the URL endpoint is invalid.`, 404));
})

const globalErrorHandler:ErrorRequestHandler = (err, req, res, next) => {
    const {statusCode, status, messageShort, messageDetailed}:CustomError = err;

    if(!statusCode || !status || !messageShort || !messageDetailed) {
        throw new Error(`Exeption occured in globalErrorHandler! Some data was missing! statusCode: ${statusCode}, status: ${status}, messageShort: ${messageShort}, messageDetailed: ${messageDetailed}, rawError: ${err}`)
    }

    res.status(statusCode);
    const response = new CustomResponse(false,[],err)
    res.json(response)
};

app.use(globalErrorHandler)

const server = app.listen(port, ()=> {
    console.log(`Backend-Server is running at ${port}`)
})