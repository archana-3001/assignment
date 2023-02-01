import { stat } from "fs";
import { cluster } from "../routes/users";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';


export  async function addUser(req, res, next){
    try{
       // write code to validate
       const id = uuidv4(); 
        bcrypt.hash(req.body.Password, 10).then((hash) => {
            req.body.Password=hash;
            const query1=`SELECT * FROM unique_usernames WHERE Username='${req.body.Username}';`;
            const query2=`SELECT * FROM unique_emails WHERE email='${req.body.email}';`;
            const query3=`SELECT * FROM unique_phone_numbers WHERE Phone_number='${req.body.Phone_number}';`;
            const query4=`INSERT INTO users(ID, First_name, Last_name, Username, email, Phone_number, Is_active, Is_admin, Password) VALUES (${id}, '${req.body.First_name}', '${req.body.Last_name}', '${req.body.Username}', '${req.body.email}', '${req.body.Phone_number}', ${req.body.Is_active}, ${req.body.Is_admin}, '${req.body.Password}');`;
            const query5=`INSERT INTO unique_usernames(Username) VALUES ('${req.body.Username}')`;
            const query6=`INSERT INTO unique_emails(email) VALUES ('${req.body.email}')`;
            const query7=`INSERT INTO unique_phone_numbers(Phone_number) VALUES ('${req.body.Phone_number}')`;
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
                                console.log(" add user everything is fine ");
                                console.log(query4);
                                try{
                                
                                    console.log(req.body.Password);
                                    const res4=cluster.execute(query4);
                                    res4.then(msg=>{
                                        const res5=cluster.execute(query5);
                                        res5.then(msg=>{
                                            const res6=cluster.execute(query6);
                                            res6.then((msg)=>{
                                                const res7=cluster.execute(query7);
                                                res7.then((msg)=>{
                                                
                                                    return res.status(200).send('user added');
                                                }).catch(err=>{
                                                    console.log(err);
                                                }
                                                )
                                            }).catch(err=>{
                                                console.log(err);
                                            })
                                      }).catch(err=>{
                                          console.log(err);
                                       })
                                    }).catch(err=>{
                                       console.log(err);
                                    })
                                
                            }catch(err){
                                console.log(err);
                            }

                        }else{
                            return res.status(401).json({ err: 'phone number already exists' });
                        }
                    })
                }else{
                    return res.status(401).json({ err: 'email already exists' });
                }
            })
        }else{
            return res.status(401).json({ err: 'username already exists' });
        }

       })
    });
    }
    catch(err){
        return res.status(400).json({
            error: "error in hash creation"
        })
    };
}


export async function updateUser(req, res, next){
    res.send("update request got !!");
}