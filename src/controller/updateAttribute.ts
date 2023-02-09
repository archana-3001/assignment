import { cluster } from "../routes/users";
import bcrypt from 'bcryptjs';
import { createClient } from "redis";
import { publishUserEvent } from "../kafka";

export async function updateAttributes(request, response, next) {
console.log("update query", request.body, request.query);


const keys= Object.keys(request.query);
if(keys.length!=0){
    const client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
        const query = `SELECT * from users WHERE ID= ${request.query.ID};`;
        
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
                                client.del(`${request.query.ID}`);
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
                                                client.del(`${request.query.ID}`);
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
                                    const query3=`DELETE FROM unique_phone_numbers WHERE Phone_number='${val.rows[0].phone_number}'; `;
                                    cluster.execute(query3).then(()=>{
                                        // user previous email has been deleted 
                                        // step 2: insert into users table and then in unique_emails
                                        const query4=`INSERT INTO unique_phone_numbers(Phone_number) VALUES ('${request.body.Phone_number}')`;
                                        cluster.execute(query1).then(()=>{
                                            cluster.execute(query4).then(val2=>{
                                                client.del(`${request.query.ID}`);
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
                                client.del(`${request.query.ID}`);
                            }).catch((err)=>{
                                response.status(405).json({
                                    error: err
                                })
                            })
                        }
                        else{
                            cluster.execute(query1).then(val=>{
                                client.del(`${request.query.ID}`);

                            }).catch((err)=>{
                                response.status(405).json({
                                    error: err
                                })
                            })
                        }
                        
                        // console.log(query1);
                       
                    }
                }
                publishUserEvent(`${val.rows[0].id}`, 'updated', request.body).then();
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
    
}
