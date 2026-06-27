import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';

dotenv.config();

const PORT = process.env.BACKEND_PORT || 3002;
const app  = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
   return res.status(200).json({message: "SkillKraft backend running."})
})

app.listen(PORT,() =>{
    console.log("SkillKraft Backend services operational");
})

