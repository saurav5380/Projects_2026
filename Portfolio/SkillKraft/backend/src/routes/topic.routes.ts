import  Express  from "express";
import { updateTopicOrderController } from "../controllers/topic.controller.js";
import authenticate from "../middleware/authenticate.js";

const express = Express();
const topicRouter = express.router;

topicRouter.patch("/:phaseId/reorder", authenticate, updateTopicOrderController);

export default topicRouter;


