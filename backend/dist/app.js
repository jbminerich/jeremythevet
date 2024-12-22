"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure this is at the very top of the file
const path_1 = __importDefault(require("path"));
process.env.TNS_ADMIN = process.env.TNS_ADMIN || path_1.default.resolve(__dirname, "../Wallet");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const oracledb_1 = __importDefault(require("oracledb"));
const body_parser_1 = __importDefault(require("body-parser"));
const users_1 = __importDefault(require("./routes/users")); // Import users.ts
oracledb_1.default.initOracleClient({ configDir: process.env.TNS_ADMIN });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Serve React frontend
const buildPath = path_1.default.join(__dirname, "../../frontend/build");
app.use(express_1.default.static(buildPath));
// API routes
app.get("/api/projects", (req, res) => {
    res.json([
        { id: 1, title: "Project One", description: "This is project one." },
        { id: 2, title: "Project Two", description: "This is project two." },
        { id: 3, title: "Project Three", description: "This is project three." },
    ]);
});
// Add the /api/users route
app.use("/api/users", users_1.default); // Prefix all `users.ts` routes with `/api/users`
// Catch-all route to serve the React app
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(buildPath, "index.html"));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
