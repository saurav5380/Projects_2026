// import type {Response} from 'express';

import type { NextFunction, Request, Response } from "express";
import HttpError from "../utils/httpError.js";

type ErrorResponse = {
    success: boolean,
    statusCode: number,
    message?: string,
    details?: string[]
}

const globalErrorHandler = (error: ErrorResponse | Error | any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error instanceof HttpError ? error.statusCode : 500;
    switch (statusCode) {
        case 401:
            return res.status(401).json({ success: false, message: error.message ?? "Unauthorized", details: error.details });
        case 403:
            return res.status(403).json({success: false, message: "Unauthorised",details: error.details });
        case 400:
            return res.status(400).json({success: false, message: "Bad request", details: error.details });
        case 409:
            return res.status(409).json({ success: false, message: "Conflict. Duplicate resource", details: error.details });
        case 422:
            return res.status(422).json({ success: false, message: "Request failed validation parameters", details: error.details });
        case 404:
            return res.status(404).json({ success: false, message: "Resource not found", details: error.details });
        default:
            return res.status(500).json({ success: false, message: "Internal Server Error", details: error.details });
    }
}


export default globalErrorHandler;
