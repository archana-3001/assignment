//  create/update/read/delete users from the system
import { Router, response } from "express";
import { request } from "http";
import cassandra from 'cassandra-driver';
import userValidation from "../middleware/userValidation";
import addUser from "../controller/users";

const userRouter=Router();

userRouter.get('/', (request,  response)=>{
    response.send("hello from all users !!!!");
});

userRouter.post('/add', userValidation, addUser);

export default userRouter;