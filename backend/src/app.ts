import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Catch-all route to serve the React app
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
