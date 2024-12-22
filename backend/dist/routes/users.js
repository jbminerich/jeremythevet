"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const oracledb_1 = __importDefault(require("oracledb"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
// Database Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
};
// Login Route
const loginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(dbConfig);
        const result = yield connection.execute(`SELECT id, password_hash FROM users WHERE email = :email`, [email], { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
        const rows = result.rows || [];
        if (rows.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const user = rows[0];
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.PASSWORD_HASH);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.ID }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (err) {
        console.error("Error during login:", err);
        next(err);
    }
    finally {
        if (connection) {
            yield connection.close();
        }
    }
});
// Create User Route
const createUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let connection;
    try {
        connection = yield oracledb_1.default.getConnection(dbConfig);
        // Check if the email already exists
        const checkResult = yield connection.execute(`SELECT id FROM users WHERE email = :email`, [email], { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
        const rows = checkResult.rows || [];
        if (rows.length > 0) {
            res.status(400).json({ error: "Email already in use" });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Insert the new user into the database
        yield connection.execute(`INSERT INTO users (email, password_hash, created_at)
       VALUES (:email, :password_hash, :created_at)`, {
            email,
            password_hash: hashedPassword,
            created_at: new Date(),
        }, { autoCommit: true });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        console.error("Error creating user:", err);
        next(err);
    }
    finally {
        if (connection) {
            yield connection.close();
        }
    }
});
router.post("/login", loginHandler);
router.post("/create", createUserHandler);
exports.default = router;
