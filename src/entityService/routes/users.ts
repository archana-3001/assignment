//  create/update/read/delete users from the entity service 
// entity instances 

import axios from "axios";
import  { query, Router } from "express";
import userValidation from "../../middleware/userValidation";
import updateValidation from "../../middleware/updateValidation";
import { addUser, updateUser } from "../controller/users";
import { string } from "joi";
import { stringify } from "querystring";


const userRouter=Router();

//API to get information of all Entities of entity type specified by EntityTypePluralName, based on the filters specified.
userRouter.get('/', async (req, res)=>{
    var query='{'+'"terms": [{"key": "IsDeleted", "value": [false]}]';
    console.log(req.query);
    if((Object.entries(req.query)).length>0){
        query=query+',  "match_phrase_prefix": [ '
        let l=0;
        for (const [key, value] of Object.entries(req.query)) {
            if(l>=1){
                query=query+',';
            }
            query=query+'{"key": "'+key+'"'+', "value":'+value+'}';
            l=l+1;
        }
        query=query+']'
    }
    query=query+'}';
    console.log(query)
    try{
    const results=await axios.get(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/'+process.env.ENTITY_TYPE_PLURAL_NAME+'?query='+encodeURIComponent(query), {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN
        },
        params:{
            limit: 50,
            offset: 0,
            sortBy: 'desc',
        }
    });
    const val=await results;
    // console.log(val.data);
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

//delete user
//just mark IsDeleted as true

export default userRouter;