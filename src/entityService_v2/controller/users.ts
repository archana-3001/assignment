import axios from 'axios';
import { Console } from 'console';
// Load the CryptoJS library
const crypto = require('crypto');

export  async function addUser(req, res){
    console.log("user create request")
    try{
       // write code to validate
        // Encrypt the message with AES encryption
        var key = "alpha";
        const url=process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME;
        const callbackURL="https://webhook.site/523da379-a7ea-435e-875e-82bbc17459f0"
        console.log(url)
        // const hash = crypto.createHash('sha256').update(callback).digest('hex');
       const obj={
            "uniqueCode": String(req.body.Username),
            "name": "users",
            "owner": process.env.APP_ID,
            "properties":{
                "Username": String(req.body.Username),
                "email": String(req.body.email),
                "PhoneNumber": String(req.body.Phone_number),
                "Password": String(req.body.Password),
                "FirstName": String(req.body.First_name),
                "LastName": String(req.body.Last_name),
                "IsActive": String(req.body.Is_active),
                "IsAdmin": String(req.body.Is_admin),
                "IsDeleted": {
                    "ownerAppId": "2r5hDxz6J2W5a0wMbJFpjwkg6fOGj8C2",
                    
                }
            },
            "callback": {
                "url": callbackURL
            }
       }
        
        const results=await axios.post(url, obj, {
            headers:{
                'Accept': 'application/json',
                'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
                'X-COREOS-TID': process.env.TID,
                'X-COREOS-ACCESS': process.env.TOKEN,
                'X-COREOS-ORIGIN-TOKEN': process.env.TOKEN,
                'X-COREOS-CALLBACK-SECRET': process.env.CALLBACK_SECRET
            },
        });
        const val=await results;
        console.log(val.data)

        // console.log(data)
        return res.status(201).json({"data": val?.data});
    }
    catch(err){
        return res.status(400).json({
            err
        })
    }
}


export async function updateUser(req, res) {
    try{
        console.log(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME+'/'+req.params.entityID);
        const obj={
            "properties": {   
            }
        }
        if(req.body.First_name!=undefined){
            obj.properties['FirstName']=req.body.First_name
        }
        if(req.body.Last_name!=undefined){
            obj.properties['LastName']=req.body.Last_name
        }
        if(req.body.email!=undefined){
            obj.properties['email']=req.body.email
        }
        if(req.body.Phone_number!=undefined){
            obj.properties['PhoneNumber']=req.body.Phone_number
        }
        if(req.body.Is_active!=undefined){
            obj.properties['IsActive']=req.body.Is_active
        }
        if(req.body.Is_admin!=undefined){
            obj.properties['IsAdmin']=req.body.Is_admin
        }
        if(req.body.Password!=undefined){
            obj.properties['Password']=req.body.Password
        }
        if(req.body.IsDeleted!=undefined){
            obj.properties['IsDeleted']=req.body.IsDeleted
        }
        console.log(obj, req.body.IsDeleted);
        const results=await axios.put(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME+'/'+req.params.entityID,obj, {
            headers:{
                'Accept': 'application/json',
                'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
                'X-COREOS-TID': process.env.TID,
                'X-COREOS-ACCESS': process.env.TOKEN,
                'X-COREOS-ORIGIN-TOKEN': process.env.TOKEN,

            },
        })
        const val=await results;
        console.log(val.data)
        return res.status(200).json({
            data: val.data
        })
    }catch(err){
        return res.status(404).json({
            err
        })
    }
}
