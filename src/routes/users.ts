//  create/update/read/delete users from the system
import { Router, response, query } from "express";
import { request } from "http";
import userValidation from "../middleware/userValidation";
import addUser from "../controller/users";
import {getConnection } from '../db'; 


const userRouter=Router();
export const cluster=getConnection();

userRouter.get('/', (request,  response)=>{
    const query = 'SELECT * from users';
    var users=[];
    const res=cluster.execute(query);
    res.then(val=>{
        val.rows.forEach(val=>{
            console.log(val);
            users.push(val);
        })
    });
    console.log(users)
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