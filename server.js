import "dotenv/config";

import express from "express";
import "express-async-errors";
import cors from "cors";
import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

import path from "path";
import { fileURLToPath } from "url";
import { api } from "./api/api-router.js";

const app = express();

// CORS configuration for development (two origins)
const VITE_DEV_URL = 'http://localhost:5173';
app.use(cors({
  origin: VITE_DEV_URL,
  credentials: true,
}));

// JWT validation middleware
const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Apply JWT validation to all /api routes
app.use("/api", checkJwt);

// Custom error handler for JWT errors
app.use("/api", (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next(err);
});

// API routes
app.use("/api", api);

// Serve React build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(3000);
