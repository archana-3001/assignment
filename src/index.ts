import { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';

// import userRouter from './routes/users';
// import authRouter from './routes/auth';
// import activityRouter from './routes/activity';

// import userEntity from './entityService/routes/userEntity';
//import userRouter from './entityService/routes/users';

import userRouter from './entityService_v2/routes/users';

import cors from 'cors';
import { run } from './kafka';


dotenv.config();

const app : Express = express(); 
const port = process.env.PORT;

app.use(express.json());
app.use(cors())

app.get("/", (req: Request, res: Response)=>{
    res.send("hello from server listening to ${port}");
});

// scylladb routes
// app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
// app.use('/api/activity', activityRouter);

//entity service routes
//app.use('/api/userTemplate', userEntity);
app.use('/api/users', userRouter)

//express server
app.listen(port, () => {
    // run();
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });

