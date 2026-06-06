import express from 'express';
import cors from 'cors';
import {type Request, type Response} from 'express';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response)=>{
    res.json({message: "Backend Services operational"});
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=>{
    console.log('Server running on PORT: ', PORT);
});



