import dotenv from "dotenv";
dotenv.config(); // Ensure this is at the very top of the file

import path from "path";
process.env.TNS_ADMIN = process.env.TNS_ADMIN || path.resolve(__dirname, "../Wallet");
import express, { Request, Response } from "express";
import cors from "cors";
import oracledb from 'oracledb';
import bodyParser from "body-parser";
import usersRoutes from "./routes/users"; // Import users.ts



oracledb.initOracleClient({ configDir: process.env.TNS_ADMIN });


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Serve React frontend
const buildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(buildPath));

// API routes
app.get("/api/projects", (req: Request, res: Response) => {
  res.json([
    { id: 1, title: "Project One", description: "This is project one." },
    { id: 2, title: "Project Two", description: "This is project two." },
    { id: 3, title: "Project Three", description: "This is project three." },
  ]);
});

// Add the /api/users route
app.use("/api/users", usersRoutes); // Prefix all `users.ts` routes with `/api/users`

// Catch-all route to serve the React app
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});
