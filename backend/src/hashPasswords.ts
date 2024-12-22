import oracledb from "oracledb";
import bcrypt from "bcryptjs";
require('dotenv').config();


process.env.TNS_ADMIN = process.env.TNS_ADMIN;

oracledb.initOracleClient({ configDir: process.env.TNS_ADMIN });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Define the structure of the `users` table rows
interface UserRow {
  ID: number;
  PASSWORD_HASH: string;
}

const hashPasswords = async () => {
  let connection;
  console.log("Connection string:", dbConfig.connectString);


  try {
    // Connect to the database
    connection = await oracledb.getConnection(dbConfig);


    // Fetch all users with plain-text passwords
    const result = await connection.execute(
      `SELECT id, password_hash FROM users`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Explicitly type the rows
    const rows = result.rows as UserRow[]; // Type-casting result.rows

    console.log(`Found ${rows.length} users.`);

    // Iterate over each user and hash their plain-text password
    for (const row of rows) {
      const userId = row.ID;
      const plainTextPassword = row.PASSWORD_HASH;

      // Hash the plain-text password
      const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

      // Update the database with the hashed password
      await connection.execute(
        `UPDATE users SET password_hash = :hashedPassword WHERE id = :userId`,
        { hashedPassword, userId }
      );

      console.log(`Password for user ID ${userId} updated.`);
    }

    // Commit changes
    await connection.commit();
    console.log("All passwords have been hashed and updated.");
  } catch (err) {
    console.error("Error hashing passwords:", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Run the script
hashPasswords();
