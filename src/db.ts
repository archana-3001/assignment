import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';
dotenv.config();

// connect to databse

export const getConnection=()=>{ 
  const client = new cassandra.Client({
  contactPoints: [process.env.NODE_IP],
  localDataCenter: process.env.DATA_CENTER,
  keyspace: process.env.KEY_SPACE
});
client.connect((err) => {
  if (err) {
    console.error('There was an error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});
return client;
}

     
