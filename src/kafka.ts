import kafka from 'kafka-node';

const Producer=kafka.Producer;
const client=new kafka.KafkaClient();
const producer = new Producer(client);

producer.on('ready', function() {
    console.log('Producer is ready!');
});
  
export const publishUserEvent = (userId, action) => {
    const payloads = [
        {
            topic: 'user-events',
            messages: JSON.stringify({
              userId,
              action,
              action_date: new Date().toISOString()
            })
          }
    ];
    
    producer.send(payloads, function(err, data) {
        if (err) console.error(err);
        else console.log(data);
      });
};
    