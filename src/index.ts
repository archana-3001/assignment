import { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';


dotenv.config();


const app : Express = express(); 
const port = process.env.PORT;

app.use(express.json());

const query = 'SELECT * from students';



app.get("/", (req: Request, res: Response)=>{
    try{
      // const val=client.execute(query).then((res)=>{
      //   console.log(res.rows[0].first_name);
      // });
      res.send("hello from server side !!");

    }catch{
      console.log("error in server side");
    }
  });

app.use('/api/users', userRouter);

//express server
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
