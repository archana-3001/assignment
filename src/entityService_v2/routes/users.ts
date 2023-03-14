//  create/update/read/delete users from the entity service 
// entity instances 

import axios from "axios";
import  { Router } from "express";
import { addUser, updateUser } from "../controller/users";
import userValidation from "../../middleware/userValidation";
import updateValidation from "../../middleware/updateValidation";
import { sign } from "crypto";
const crypto = require('crypto');
const userRouter=Router();

//API to get information of all Entities of entity type specified by EntityTypePluralName, based on the filters specified.
userRouter.get('/', async (req, res)=>{
    // console.log(req.body.token);
    var query='{"op": "and","arr":[{ "key": "IsDeleted", "value": false }'
    // console.log(req.query);
    if((Object.entries(req.query)).length>0){
        for (const [key, value] of Object.entries(req.query)) {
            query=query+', {"key": "'+key+'"'+', "value":'+value+'}';
        }
    }
    query=query+']}';
    console.log(query)
    try{
        const url=process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME+'?query='+encodeURIComponent(query)
        console.log(url)
        const obj= {
            "url": url
        }
        
    const results=await axios.get(url, {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': req.headers.token,
   
        },
       
        
        
    });
    const val=await results;
    console.log(val.data);
    res.status(200).json(val?.data);
    }catch(err){
        res.status(404).json(err);
    }
})

//API to get information (base & core attribute values) of a Entity (specified by EntityId) of entity type specified by entityTypePluralName.
userRouter.get('/:entityID', async (req, res)=>{
    try{
        const results=await axios.get(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME+'/'+req.params.entityID, {
            headers:{
                'Accept': 'application/json',
                'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
                'X-COREOS-TID': process.env.TID,
                'X-COREOS-ACCESS': req.headers.token
            }
        });
        const val=await results;
        console.log(val.data);
        return res.status(200).json({
            data: val.data
        });
    }catch(err){
        res.status(404).json({err});
    }
});


//API for creating a new Entity of entity type specified by entityTypePluralName.
userRouter.post('/', userValidation, addUser)

//API to update core attributes of a Entity specified by EntityId.
userRouter.put('/:entityID', updateValidation, updateUser);

//callback
userRouter.post('/callback', (req, res)=>{
    const signature=req.header('x-coreos-hmac-signature')
    const callbackSecret=req.header('x-coreos-callback-secret');
    console.log(signature, "\t", callbackSecret, "\t", typeof(callbackSecret));
    // console.log(req.body);
    const payload = JSON.stringify(req.body);
    console.log(payload)
    const concatenatedString = String(payload) + callbackSecret;
    const newsignature=crypto.createHash('sha256').update(concatenatedString).digest('hex');
    // console.log(req.headers.x-coreos-hmac-signature);
    console.log(req.rawTrailers)
    console.log(newsignature)
    if(signature==newsignature){
        return res.status(201).json(req.body
            );
    }
    return res.send("callback!");

});

export default userRouter;