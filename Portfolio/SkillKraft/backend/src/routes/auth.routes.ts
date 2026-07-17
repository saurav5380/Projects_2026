//`POST /register`, `POST /login`, `POST /refresh`, `POST /logout`
import Express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.controller.js';

const express = Express();
const authRouter = express.router;

authRouter.post("/register", registerController);

authRouter.post("/login", loginController);

authRouter.post("/refresh", refreshController);

authRouter.post("/logout", logoutController);

export default authRouter;
