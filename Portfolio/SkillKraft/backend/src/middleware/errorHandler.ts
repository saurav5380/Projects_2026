// import type {Response} from 'express';

import type { NextFunction, Request, Response } from "express";

type handlerError = {
    success: boolean,
    statusCode: number,
    message: string,
    details: string[]
}

const globalErrorHandler = (error: handlerError, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = error.statusCode;
    switch (statusCode) {
        case 401:
            return res.status(401).json({ success: false, message: "Check username and password", details: error.details });
        case 403:
            return res.status(403).json({success: false, message: "Unauthorised",details: error.details });
        case 400:
            return res.status(400).json({success: false, message: "Bad request", details: error.details });
        case 409:
            return res.status(409).json({ suceess: false, message: "Conflict. Duplicate resource", details: error.details });
        case 422:
            return res.status(422).json({ success: false, message: "Request failed validation parameters", details: error.details });
        case 404:
            return res.status(404).json({ success: false, message: "Resource not found", details: error.details });
        default:
            return res.status(500).json({ success: false, message: "Internal Server Error", details: error.details });
    }
}


export default globalErrorHandler;