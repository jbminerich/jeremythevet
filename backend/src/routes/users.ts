import { Router, RequestHandler } from "express";
import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Login Route
const loginHandler: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT id, password_hash FROM users WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = result.rows || [];
    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = rows[0] as {
      ID: number;
      PASSWORD_HASH: string;
    };

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD_HASH);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.ID }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Create User Route
const createUserHandler: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Check if the email already exists
    const checkResult = await connection.execute(
      `SELECT id FROM users WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = checkResult.rows || [];
    if (rows.length > 0) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await connection.execute(
      `INSERT INTO users (email, password_hash, created_at)
       VALUES (:email, :password_hash, :created_at)`,
      {
        email,
        password_hash: hashedPassword,
        created_at: new Date(),
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

router.post("/login", loginHandler);
router.post("/create", createUserHandler);

export default router;
