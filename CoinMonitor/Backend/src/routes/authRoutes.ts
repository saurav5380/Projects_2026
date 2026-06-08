import express from 'express';
import {register} from '../controller/authController.js'
import { handleValidationError, newUserRegistrationValidator } from '../middleware/validation.js';

const authRouter = express.Router();

authRouter.post("/register", newUserRegistrationValidator, handleValidationError, register)


export default authRouter;