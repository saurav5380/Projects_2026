import express from 'express';
import { register, login, logout } from '../controller/authController.js';
import { handleValidationError, newUserRegistrationValidator } from '../middleware/validation.js';

const authRouter = express.Router();

authRouter.post("/register", newUserRegistrationValidator, handleValidationError, register);

authRouter.post("/login", login);

authRouter.post("/logout", logout);


export default authRouter;