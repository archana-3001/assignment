//  create/update/read/delete users from the system
import  { Router, response, query } from "express";
import { request } from "http";
import userValidation from "../middleware/userValidation";
import addUser from "../controller/users";
import {getConnection } from '../db'; 


const userRouter=Router();
export const cluster=getConnection();

// GET USER WITH USER ID
userRouter.get('/', (request,  response)=>{
    
    console.log(request.query);
    const keys= Object.keys(request.query);
    if(keys.length!=0){
        for (const [key, value] of Object.entries(request.query)) {
            //console.log(`${key}: ${value}`);
            // console.log(typeof(key), typeof(value));
            var query = `SELECT * from users WHERE ${key}= '${value}' ALLOW FILTERING;`;
            if(`${key}`=='ID'){
                query = `SELECT * from users WHERE ${key}= ${value} ALLOW FILTERING;`;
            }
            console.log(query);
            const res=cluster.execute(query);
            res.then(val=>{
                if(val.rows.length!=0){
                    return response.status(200).json({msg: val.rows});
                }
                else{
                    return response.status(404).json({error: "user not found!!"});
                }
            }).catch(err=>{
                return response.status(404).json({
                    err: err
                })
            })

        }
    }else{
        return response.status(404).json({
            msg: "NO parameters passed in url"
        });
    }
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