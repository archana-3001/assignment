//  create/update/read/delete users from the system
import  { Router } from "express";
import userValidation from "../middleware/userValidation";
import {addUser} from "../controller/users";
import {getConnection } from '../db'; 
import updateValidation from "../middleware/updateValidation";
import userupdateValidation from "../middleware/userUpdateValidation";
import { updateAttributes } from "../controller/updateAttribute";
import { createClient } from 'redis';
import {authorize} from '../middleware/auth';

const userRouter=Router();
export const cluster=getConnection();

// GET USER WITH USER ID authorized 
userRouter.get('/',authorize, async (request,  response)=>{
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    // console.log(request.query);
    const keys= Object.keys(request.query);
    if(request.query.ID!=undefined){
        let results={};
        const query = `SELECT * from users WHERE ID=${request.query.ID}`;
        // let isCached = false;
        const cacheResults =await  client.get(`${request.query.ID}`);
            // console.log(cacheResults, cacheResults.length);
        if (cacheResults!=null && cacheResults.length>2) {
            //   isCached = true;
              results = JSON.parse(cacheResults);
        } else {
            cluster.execute(query).then((res)=>{
                results=res.rows;
                        client.set(`${request.query.ID}`, JSON.stringify(results));
                    }
            ).catch(err=>{
                    return response.status(404).json({
                        msg: "query execution errro",
                        error: err
                    })
            }); 
              
        }
            // console.log(results);
        return response.status(200).send(results);
    }
    else if(keys.length!=0){
        let query = `SELECT * from users WHERE `;
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
                    return response.status(200).send(val.rows);
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

//Using the update API,  I can update a user using his/her ID. authorized added
userRouter.patch('/', authorize,updateValidation, updateAttributes);


userRouter.delete('/', authorize,async (request, response)=>{
    console.log(request.query);
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    if(request.query.ID!=undefined){
        const query=`SELECT * FROM users WHERE ID=${request.query.ID};`;
        try{
            cluster.execute(query).then((val)=>{
                if(val.rows[0].length!=0){
                    const q1=`DELETE FROM  unique_emails WHERE email='${val.rows[0].email}';`;
                    const q2=`DELETE FROM  unique_usernames WHERE Username='${val.rows[0].username}';`;
                    const q3=`DELETE FROM unique_phone_numbers WHERE Phone_number='${val.rows[0].phone_number}'; `;
                    const q4=`DELETE FROM users WHERE ID=${val.rows[0].id}; `;
                    cluster.execute(q1).then(()=>{
                        cluster.execute(q2).then(()=>{
                            cluster.execute(q3).then(()=>{
                                cluster.execute(q4).then(()=>{
                                    client.del(`${request.query.ID}`);
                                    return response.status(200).json({
                                        
                                        msg: "deleted successfully !!!"
                                    })
                                }).catch(err=>{
                                    return response.status(404).json({
                                        msg: `${q4} failed`,
                                        error: err
                                    })
                                })
                            }).catch(err=>{
                                return response.status(404).json({
                                    msg: `${q3} failed`,
                                    error: err
                                })
                            })
                        }).catch(err=>{
                            return response.status(404).json({
                                msg: `${q2} failed`,
                                error: err
                            })
                        })
                    }).catch(err=>{
                        return response.status(404).json({
                            msg: `${q1} failed`,
                            error: err
                        })
                    })


                }else{
                    return response.status(404).json({
                        message: "user not exist!!"
                    })
                }
            }).catch((err)=>{
                return response.status(404).json({
                    message: err
                })
            })
        }catch(err){
            return response.status(400).json({
                message: " error in params",
                error: err
            })
        }
    }
});

// The Update API must throw an error if any of these attributes are missing. It should be able to create a new user if it is a unique user. authorize added
userRouter.put('/', authorize,userupdateValidation, updateAttributes);

userRouter.post('/',authorize, userValidation, addUser);

export default userRouter;