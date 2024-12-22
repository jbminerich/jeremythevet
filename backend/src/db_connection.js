require('dotenv').config();
const oracledb = require('oracledb');
const path = require('path');

// Set TNS_ADMIN to point to your wallet directory
//ess.env.TNS_ADMIN = path.resolve(__dirname, '../Wallet');
process.env.TNS_ADMIN = process.env.TNS_ADMIN;

oracledb.initOracleClient({ configDir: process.env.TNS_ADMIN });



const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING, // Replace with your tnsnames.ora alias
};



async function queryDatabase() {
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Set output format for query results

  let connection;

  try {
    
    // Establish connection
    connection = await oracledb.getConnection(dbConfig);

    // Run a query
    const result = await connection.execute('SELECT * FROM users', [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Return results as JSON-like objects
    });

    console.log(result.rows); // Display fetched rows
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    if (connection) {
      await connection.close(); // Always close the connection
    }
  }
}

queryDatabase();
