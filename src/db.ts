import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';


dotenv.config();

export const {NODE_IP, DATA_CENTER, KEY_SPACE}=process.env;

// set new keyspace
export const getClient=(keyspace: any)=>{
const client = new cassandra.Client({
  contactPoints: [NODE_IP],
  localDataCenter: DATA_CENTER,
  keyspace
});
return client
};

// get client with keyspace 
export const getClientWithKeyspace = () => {
    return getClient(KEY_SPACE);
};

module.exports = { getClient, getClientWithKeyspace };

