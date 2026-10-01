import Express  from "express";
import { activeRoadmapController, renameRoadmapController, regenerateRoadmapController } from "../controllers/roadmap.controller.js";
import authenticate from "../middleware/authenticate.js";

const express = Express();
const roadmapRouter = express.router;

roadmapRouter.get("/active-roadmap", authenticate, activeRoadmapController);

roadmapRouter.patch("/rename-roadmap", authenticate, renameRoadmapController);

roadmapRouter.post("/regenerate-roadmap", authenticate, regenerateRoadmapController);


export default roadmapRouter;

