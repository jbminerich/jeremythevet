"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
// Catch-all route to serve the React app
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(buildPath, "index.html"));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
