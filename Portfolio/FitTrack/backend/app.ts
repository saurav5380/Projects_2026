import 'dotenv/config';
import express from 'express';
import authRouter from './routers/authRouter.js';
import cors from 'cors';
import type {Request, Response} from 'express';


const app = express();

const PORT = process.env.PORT || '3002'

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

app.use(express.urlencoded({extended:false}));

app.get("/", (req: Request, res:Response) =>{
    res.json({
        message: "FitTrack Backend server running"
    })
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
})

export default app;
