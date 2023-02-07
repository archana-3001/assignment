import { Kafka } from "kafkajs";
import fs from 'fs';

export const kafka=new Kafka({
    clientId: 'assignment',
    brokers:['dln-046053:9092']
})

const producer=kafka.producer();
export const consumer=kafka.consumer({
    groupId: 'admin'
})
export const run=async()=>{
    console.log("kafka producer connected!!");
    await producer.connect();
    console.log("kafka consumer connected!!");
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("messages value :",message.value.toString());
            // messages.push(message.value.toString());
            // console.log("all messages: ", messages);
            fs.appendFile('./activity.txt', message.value.toString(), (err)=>{
            // console.log(err);
            });
        },
    })
    
}


export const publishUserEvent = async(userId, action) => {
    const message=JSON.stringify({
        userId,
        action,
        action_date: new Date().toISOString()
      })
    console.log(userId, action, "publishevent", message);
    producer.send({topic: 'test-topic', messages:
    [
        { value: message }
      ],
    });
}
