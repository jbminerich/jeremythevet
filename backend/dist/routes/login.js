const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Assuming passwords are hashed
const router = express.Router();
const oracledb = require('oracledb');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Login route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Fetch the user by email
    const result = await connection.execute(
      `SELECT id, email, password_hash FROM users WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.ID, email: user.EMAIL }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

module.exports = router;
