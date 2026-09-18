import Express from "express";
import { onboardingController } from "../controllers/onboarding.controller.js";
import authenticate from "../middleware/authenticate.js";

const express = Express();
const onboardingRouter = express.router;

onboardingRouter.post("/onboarding", authenticate, onboardingController);

export default onboardingRouter;
