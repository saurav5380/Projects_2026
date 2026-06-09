import express from 'express';
import { register, login, logout, userDetails } from '../controller/authController.js';
import { handleValidationError, newUserRegistrationValidator } from '../middleware/validation.js';
import validSession from '../middleware/sessionMgmt.js';

const authRouter = express.Router();

authRouter.post("/register", newUserRegistrationValidator, handleValidationError, register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", validSession, userDetails)


export default authRouter;