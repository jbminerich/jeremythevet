import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Authorization header missing" });
    return; // Ensure we stop execution here
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as string | JwtPayload;
    req.user = decoded; // Attach the decoded token to the `user` property
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authenticateToken;
