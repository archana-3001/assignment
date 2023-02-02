//  create/update/read/delete users from the system
import  { Router, response, query } from "express";
import { request } from "http";
import userValidation from "../middleware/userValidation";
import {addUser} from "../controller/users";
import {getConnection } from '../db'; 
import bcrypt from 'bcryptjs';
import updateValidation from "../middleware/updateValidation";
import userupdateValidation from "../middleware/userUpdateValidation";
import { updateAttributes } from "../controller/updateAttribute";

const userRouter=Router();
export const cluster=getConnection();

// GET USER WITH USER ID
userRouter.get('/', (request,  response)=>{
    
    // console.log(request.query);
    const keys= Object.keys(request.query);
    if(keys.length!=0){
        var query = `SELECT * from users WHERE `;
        const startq=query;
        for (const [key, value] of Object.entries(request.query)) {
            //console.log(`${key}: ${value}`);
            // console.log(typeof(key), typeof(value));
                if(startq!=query){
                    query=query+` AND `;
                }
                query = query +` ${key}= ${value} `;
        }
        query=query+` ALLOW FILTERING;`;
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

        
    }else{
        const query = `SELECT * from users; `;
        // console.log(query);
        cluster.execute(query).then(
            val=>{
                // console.log(val.rows);
                return response.status(200).send(val.rows);
            }
        ).catch(
            err=>{
                return response.status(404).json({
                    error: err
                });
            }
        );

        
    }
});

//Using the update API,  I can update a user using his/her ID.
userRouter.patch('/', updateValidation, updateAttributes);


userRouter.delete('/', (request, response)=>{
    // console.log(request.query);
    response.send("user deleted !!!");
});

// The Update API must throw an error if any of these attributes are missing. It should be able to create a new user if it is a unique user.
userRouter.put('/', userupdateValidation, updateAttributes);

userRouter.post('/', userValidation, addUser);

export default userRouter;