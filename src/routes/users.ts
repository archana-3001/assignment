//  create/update/read/delete users from the system
import { Router, response, query } from "express";
import { request } from "http";
import cassandra from 'cassandra-driver';
import userValidation from "../middleware/userValidation";
import addUser from "../controller/users";
const { getClientWithKeyspace } = require('../db');

const cluster = getClientWithKeyspace();

const userRouter=Router();

userRouter.get('/', (request,  response)=>{
    // const query = 'SELECT * from users';
    // const res=cluster.execute(query);
    // console.log(res);
    response.send("hello from all users !!!!");
});


userRouter.patch('/', (request, response) =>{
    // console.log(request.query);
    response.send("attribute added !!!");
});

userRouter.delete('/', (request, response)=>{
    // console.log(request.query);
    response.send("user deleted !!!");
});

userRouter.post('/', userValidation, addUser);

export default userRouter;