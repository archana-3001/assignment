import { stat } from "fs";
import { cluster } from "../routes/users";
import { v4 as uuidv4 } from 'uuid';


export default async function addUser(req, res, next){
    try{
       // write code to validate
       const Username=req.body.Username;
       const email=req.body.email;
       const Phone_number=req.body.Phone_number;
       const id = uuidv4();
       console.log(Username, typeof(Username)); 
       const query1=`SELECT * FROM unique_usernames WHERE Username='${Username}';`;
       const query2=`SELECT * FROM unique_emails WHERE email='${email}';`;
       const query3=`SELECT * FROM unique_phone_numbers WHERE Phone_number='${Phone_number}';`;
       const query4=`INSERT INTO users(ID, First_name, Last_name, Username, email, Phone_number, Is_active, Is_admin, Password) VALUES (${id}, '${req.body.First_name}', '${req.body.Last_name}', '${req.body.Username}', '${req.body.email}', '${req.body.Phone_number}', ${req.body.Is_active}, ${req.body.Is_admin}, '${req.body.Password}');`;
       console.log(query1);
       const res1=cluster.execute(query1);
       res1.then(stats=>{
        if(stats.rows.length==0){
            console.log("Username not exist now check for email ");
            const res2=cluster.execute(query2);
            res2.then(stats=>{
                if(stats.rows.length==0){
                    console.log("Email not exist now check for Phone number ");
                    const res3=cluster.execute(query3);
                    res3.then(stats=>{
                        if(stats.rows.length==0){
                            // console.log(" add user everything is fine ");
                            console.log(query4);
                            try{
                                const res4=cluster.execute(query4);
                                res4.then(msg=>{
                                    console.log(msg);
                                    return res.status(200).send('user added');
                                }).catch(err=>{
                                    console.log(err);
                                })
                                
                            }catch(err){
                                console.log(err);
                            }

                        }else{
                            return res.status(401).json({ err: 'user exists' });
                        }
                    })
                }else{
                    return res.status(401).json({ err: 'user exists' });
                }
            })
        }else{
            return res.status(401).json({ err: 'user exists' });
        }

       })
    }catch(err){
        console.log(err);
    }
};