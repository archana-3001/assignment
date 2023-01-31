import { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';


dotenv.config();

const app : Express = express(); 
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response)=>{
    res.send("hello from server listening to ${port}");
});

app.use('/api/users', userRouter);

//express server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });

