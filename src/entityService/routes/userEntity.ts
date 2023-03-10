import { Router } from "express";
import dotenv from 'dotenv';
import axios from "axios";
import { userEntitySchema } from "../EntitySchema/userTemplate";

dotenv.config();
const userEntity=Router();

userEntity.get('/', async(req, res)=>{
    const results=axios.get(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/entity-type', {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN
        },
        params:{
            'limit': 50,
            'offset': 0,
            'sortBy': 'desc'
        }
    });
    // console.log(results);
    const val=await results;
    console.log(val.data);
    return res.send(`Get list of all entity types and their basic configuration for a tenant\n${results}\n${val.data}`);
})

userEntity.post('/', async(req, res)=>{
    //here we are calling this api just once to create userEntity
    const results=await axios.post(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/entity-type', userEntitySchema,{
        headers:{
            'accept': 'application/json',
            'x-coreos-request-id': process.env.REQUEST_ID,
            'x-coreos-tid':process.env.TID,
            'x-coreos-access':process.env.TOKEN
        }
    });
    // console.log(results);
    const val=await results;
    console.log(val.data);
    // console.log(val.data.data.entityTypes)
    return res.send(`API for creating a new Entity Type ${results}\n ${val.data}`);
})

userEntity.get('/:entityTypeId', async (req, res)=>{
    const results=await axios.get(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/entity-type/'+req.params.entityTypeId, {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN
        }
    });
    const val=await results;
    console.log(val.data);

    return res.send(`get basic configuration of entity by their id \n ${(val.data)}`);
})

userEntity.put('/:entityTypeId', async (req, res)=>{
    const results=await axios.put(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/entity-type/'+req.params.entityTypeId, req.body, {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN
        }
    });
    const val=await results;
    console.log(val.data);
    return res.send(`change configuration of particular entity ${(val.data)}`);
});

userEntity.put('/:entityTypeId/expire', async (req, res)=>{
    const results=await axios.put(process.env.ENTITY_SERVICE_ENDPOINT+'apps/'+process.env.APP_ID+'/entity-type/'+req.params.entityTypeId+'/expire', {
        headers:{
            'Accept': 'application/json',
            'X-COREOS-REQUEST-ID': process.env.REQUEST_ID,
            'X-COREOS-TID': process.env.TID,
            'X-COREOS-ACCESS': process.env.TOKEN
        }
    });
    const val=await results;
    console.log(val);
    return res.send(`change configuration of particular entity ${(val)}`);
});

export default userEntity;