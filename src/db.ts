import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';


dotenv.config();

const {NODE_IP, DATA_CENTER, KEY_SPACE}=process.env;

// set new keyspace
export const client = new cassandra.Client({
  contactPoints: [NODE_IP],
  localDataCenter: DATA_CENTER,
  keyspace: KEY_SPACE
});


