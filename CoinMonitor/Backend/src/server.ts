import express from 'express';
import cors from 'cors';
import {type Request, type Response} from 'express';
import authRouter from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response)=>{
    res.json({message: "Backend Services operational"});
});

const PORT = process.env.PORT || 3002;

app.use("/auth", authRouter);

app.listen(PORT, ()=>{
    console.log('Server running on PORT: ', PORT);
});



