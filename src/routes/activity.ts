import { Router } from "express";
import kafka from 'kafka-node';

const activityRouter=Router();

activityRouter.get('/', async (request,  response)=>{
    console.log(request.query.ID);
    const kafka = require('kafka-node');
    const Consumer = kafka.Consumer;
    const client = new kafka.KafkaClient();
    const desiredUserId=request.query.ID;
    const consumer = new Consumer(client, [{ topic: 'user-events', partition: 0 }]);

    consumer.on('message', function(message) {
        const event = JSON.parse(message.value);
        if (event.userId === desiredUserId) {
            return response.status(200).send(event);
        }else{
            return response.send(404).send("userid not found in kafka");
        }
    });

    consumer.on('error', function(err) {
        return response.status(404).json({error: err});
    });
});

export default activityRouter;