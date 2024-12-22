import express from "express";
import { getProjects } from "../controllers/projectsController";

const router = express.Router();

// Define routes
router.get("/", getProjects);

export default router;

