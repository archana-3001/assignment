import  { Router } from "express";
import { cluster } from "./users";
import * as jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const authRouter=Router();


authRouter.post('/login', (request, response, next)=>{
    console.log(request.body);
    const password=request.body.Password; // here create hash of entered password and then match hash with stored hash
    const query=`SELECT * from users WHERE Username= '${request.body.Username}';`;
    console.log(query);
    // // now check if password hash in table equal to generated hash 
    const res=cluster.execute(query);
        res.then(val=>{
            if(val.rows.length!=0){
                // console.log(val.rows[0].password, typeof(val.rows[0].password));
                // console.log(password, typeof(password));
                // console.log(val.rows[0].is_active);
                bcrypt.compare(password, val.rows[0].password).then((cmp)=>{
                    // console.log(cmp);
                    if(cmp && val.rows[0].is_active){
                        let jwtToken = jwt.sign({
                            Username: val.rows[0].username,
                            userId: val.rows[0].id,
                            Is_admin: val.rows[0].is_admin
                        }, 'APP_SECRET', {
                            expiresIn: "1h"
                        });
                        return response.status(200).json({
                            token: jwtToken,
                            expiresIn: 3600,
                            userId: val.rows[0].id,
                            Is_admin: val.rows[0].is_admin,
                            msg: "login successful !!"
                    });
                    }else{
                        return response.status(401).json({
                            msg: "user credentials didn't match"
                        })
                    }
                });
                
            }
            else{
                    return response.status(403).json({error: "Authorisation failed!!"});
            }
        }).catch(err=>{
            return response.status(404).json({
                err: err
            })
        })
    // response.send("login !!");
});


export default authRouter;