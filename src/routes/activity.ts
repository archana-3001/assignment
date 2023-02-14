import { Router } from "express";
import fs from 'fs';
const activityRouter=Router();


activityRouter.get('/', async (request ,  response)=>{
    try {
        const data = fs.readFileSync('activity.txt', 'utf8');
        // console.log(data);
        return response.send(data);
      } catch (err) {
        return response.send(err);
      }
});

export default activityRouter;