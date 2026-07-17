import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import globalErrorHandler from "../backend/src/middleware/errorHandler.js";
import authRouter from './src/routes/auth.routes.js';


dotenv.config();

const PORT = process.env.BACKEND_PORT || 3002;
const app  = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
   return res.status(200).json({message: "SkillKraft backend running."})
})

app.use("/auth", authRouter);

app.use(globalErrorHandler);

app.listen(PORT,() =>{
    console.log("SkillKraft Backend services operational");
})

