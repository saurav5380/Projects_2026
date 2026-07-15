//request parsing, service call, response formatting
// register, login, refresh, logout

import type {Request, Response, NextFunction} from 'express';
import {register, login, refresh} from '../services/auth.service.js';
import { success } from 'zod';

export const registerController = async (req:Request, res:Response) => {
    const firstName = String(req.user?.firstName);
    const lastName = String(req.user?.lastName);
    const email = String(req.user?.email);
    const password = String(req.user?.password);
    if (!firstName || !lastName || !email || !password){
        res.status(401).json({
            message: 'Request Body is missing mandatory information'
        })
    }
    const result = await register(firstName, lastName, email, password);
    res.status(200).json({
        success: true,
        data: result
    })
} 


