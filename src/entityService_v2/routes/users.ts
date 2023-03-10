//  create/update/read/delete users from the entity service 
// entity instances 

import axios from "axios";
import  { Router } from "express";
import { addUser, updateUser } from "../controller/users";
import userValidation from "../../middleware/userValidation";
import updateValidation from "../../middleware/updateValidation";
const crypto = require('crypto');
const userRouter=Router();

//API to get information of all Entities of entity type specified by EntityTypePluralName, based on the filters specified.
userRouter.get('/', async (req, res)=>{
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
        const payload = JSON.stringify(obj);
        const callbackSecret = process.env.CALLBACK_SECRET;
        const concatenatedString = payload + callbackSecret;
        const signature = crypto.createHash('sha256').update(concatenatedString).digest('hex');
        console.log(signature)
    const results=await axios.get(url, {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN,
            'X-COREOS-CALLBACK-SECRET': process.env.CALLBACK_SECRET,
            'X-COREOS-HMAC-SIGNATURE': signature
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
                'X-COREOS-ACCESS': process.env.TOKEN
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

export default userRouter;