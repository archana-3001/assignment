//  create/update/read/delete users from the system
import  { Router, response, query } from "express";
import { request } from "http";
import userValidation from "../middleware/userValidation";
import {addUser, updateUser} from "../controller/users";
import {getConnection } from '../db'; 
import bcrypt from 'bcryptjs';

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

//Using the update API,  I can update a user using his/her ID.
userRouter.patch('/', (request, response)=>{
    if(request.body.Username!=null){
        return response.status(404).send('username cannot be updated!');
    }
    const keys= Object.keys(request.query);
    if(keys.length!=0){

            const query = `SELECT * from users WHERE ID= ${request.query.ID} ALLOW FILTERING;`;
            
            // console.log(query);
            const res=cluster.execute(query);
            res.then(val=>{
                if(val.rows.length!=0){
                    for (const [key, value] of Object.entries(request.body)) {
                        if(`${key}`=='Password'){
                            
                            console.log("handling password change !!!");
                            bcrypt.hash(request.body.Password, 10).then((hash)=>{
                                const query1= `UPDATE users SET ${key}= '${hash}' WHERE ID= ${request.query.ID};`;
                                cluster.execute(query1).then(val=>{
                                    console.log(`${key} value is updated  !!`);
                                }).catch((err)=>{
                                    response.status(405).json({
                                        error: err
                                    })
                                })
                            });
                        }
                        else if(`${key}`!='ID' && `${key}`!='Username'){
                            const query1= `UPDATE users SET ${key}= '${value}' WHERE ID= ${request.query.ID};`;
                            if(`${key}`=='email'){
                                console.log("updating email...");
                                // first check that email exists in table 
                                const query2=`SELECT * FROM unique_emails WHERE email='${request.body.email}';`;
                                cluster.execute(query2).then(val1=>{
                                    if(val1.rows.length==0){
                                        
                                        // insert into unique_emails table as well as users table and delete previous email
                                        // step 1: delete previous email of user
                                        const query3=`DELETE FROM unique_emails WHERE email='${val.rows[0].email}'; `
                                        cluster.execute(query3).then(()=>{
                                            // user previous email has been deleted 
                                            // step 2: insert into users table and then in unique_emails
                                            const query4=`INSERT INTO unique_emails(email) VALUES ('${request.body.email}')`;
                                            cluster.execute(query1).then(()=>{
                                                cluster.execute(query4).then(val2=>{
                                                    console.log('user email is updated in all tables');
                                                }).catch(err=>{
                                                    response.status(404).json({
                                                        error: err
                                                    })
                                                })
                                            })
                                        }).catch(err=>{
                                            response.status(405).json({
                                                error: err
                                            })
                                        })
                                        
                                    }else{
                                        response.status(405).json({
                                            error: "email exists"
                                        })
                                    }
                                }).catch(err=>{
                                    response.status(405).json({
                                        error: err
                                    })
                                })
                            }
                            else if(`${key}`=='Phone_number'){
                                console.log("updating Phone_number...");
                                // first check that email exists in table 
                                const query2=`SELECT * FROM unique_phone_numbers WHERE Phone_number='${request.body.Phone_number}';`;
                                cluster.execute(query2).then(val1=>{
                                    if(val1.rows.length==0){
                                        
                                        // insert into unique_phone_numbers table as well as users table and delete previous phone_number
                                        // step 1: delete previous phone_number of user
                                        const query3=`DELETE FROM unique_phone_numbers WHERE Phone_number='${val.rows[0].phone_number}'; `
                                        cluster.execute(query3).then(()=>{
                                            // user previous email has been deleted 
                                            // step 2: insert into users table and then in unique_emails
                                            const query4=`INSERT INTO unique_phone_numbers(Phone_number) VALUES ('${request.body.Phone_number}')`;
                                            cluster.execute(query1).then(()=>{
                                                cluster.execute(query4).then(val2=>{
                                                    console.log('user Phone number is updated in all tables');
                                                }).catch(err=>{
                                                    response.status(404).json({
                                                        error: err
                                                    })
                                                })
                                            })
                                        }).catch(err=>{
                                            response.status(405).json({
                                                error: err
                                            })
                                        })
                                        
                                    }else{
                                        response.status(405).json({
                                            error: "Phone number exists"
                                        })
                                    }
                                }).catch(err=>{
                                    response.status(405).json({
                                        error: err
                                    })
                                })
                            }
                            else if(`${key}`=='Is_active' || `${key}`=='Is_admin'){
                                cluster.execute(`UPDATE users SET ${key}= ${value} WHERE ID= ${request.query.ID};`).then(val=>{
                                    console.log(`${key} value is updated  !!`);
                                }).catch((err)=>{
                                    response.status(405).json({
                                        error: err
                                    })
                                })
                            }
                            else{
                                cluster.execute(query1).then(val=>{
                                    console.log(`${key} value is updated  !!`);
                                }).catch((err)=>{
                                    response.status(405).json({
                                        error: err
                                    })
                                })
                            }
                            
                            // console.log(query1);
                           
                        }
                    }
                    return response.status(200).json({msg: "all values updated!!"});
                }
                else{
                    return response.status(404).json({error: "user not found!!"});
                }
            }).catch(err=>{
                response.redirect('/update');
                // return response.status(404).json({
                //     err: "user not exist"
                // })
            })

    }else{
        return response.status(404).json({
            msg: "NO parameters passed in url"
        });
    }
    // response.send("user all attributes updated");
});



userRouter.delete('/', (request, response)=>{
    // console.log(request.query);
    response.send("user deleted !!!");
});

// The Update API must throw an error if any of these attributes are missing. It should be able to create a new user if it is a unique user.
userRouter.put('/', userValidation, updateUser);

userRouter.post('/', userValidation, addUser);

export default userRouter;