require('dotenv').config();
const oracledb = require('oracledb');
const path = require('path');


// Set TNS_ADMIN to point to your wallet directory
process.env.TNS_ADMIN = process.env.TNS_ADMIN;

oracledb.initOracleClient({ configDir: process.env.TNS_ADMIN });



const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING, // Replace with your tnsnames.ora alias
};

async function testConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Connection successful!");
    await connection.close();
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}

testConnection();
