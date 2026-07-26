import Express  from "express";
import { getProfileController, updateProfileController, changePasswordController } from "../controllers/user.controller.js";
import authenticate from "../middleware/authenticate.js";

const express = Express();
const userRouter = express.router;

userRouter.get("/me", authenticate, getProfileController);

userRouter.post("/profile-update", authenticate, updateProfileController);

userRouter.post("/change-password", authenticate, changePasswordController);

export default userRouter;
