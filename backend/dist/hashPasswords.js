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
const oracledb_1 = __importDefault(require("oracledb"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
require('dotenv').config();
process.env.TNS_ADMIN = process.env.TNS_ADMIN;
oracledb_1.default.initOracleClient({ configDir: process.env.TNS_ADMIN });
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
};
const hashPasswords = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    console.log("Connection string:", dbConfig.connectString);
    try {
        // Connect to the database
        connection = yield oracledb_1.default.getConnection(dbConfig);
        // Fetch all users with plain-text passwords
        const result = yield connection.execute(`SELECT id, password_hash FROM users`, [], { outFormat: oracledb_1.default.OUT_FORMAT_OBJECT });
        // Explicitly type the rows
        const rows = result.rows; // Type-casting result.rows
        console.log(`Found ${rows.length} users.`);
        // Iterate over each user and hash their plain-text password
        for (const row of rows) {
            const userId = row.ID;
            const plainTextPassword = row.PASSWORD_HASH;
            // Hash the plain-text password
            const hashedPassword = yield bcryptjs_1.default.hash(plainTextPassword, 10);
            // Update the database with the hashed password
            yield connection.execute(`UPDATE users SET password_hash = :hashedPassword WHERE id = :userId`, { hashedPassword, userId });
            console.log(`Password for user ID ${userId} updated.`);
        }
        // Commit changes
        yield connection.commit();
        console.log("All passwords have been hashed and updated.");
    }
    catch (err) {
        console.error("Error hashing passwords:", err);
    }
    finally {
        if (connection) {
            yield connection.close();
        }
    }
});
// Run the script
hashPasswords();
