import "dotenv/config";

import express from "express";
import "express-async-errors";
import expressauth from "express-openid-connect";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
import { api } from "./api/api-router.js";
const { auth, requiresAuth } = expressauth;

const app = express();

// Enable CORS for Vite dev server
const VITE_DEV_URL = process.env.VITE_DEV_URL || 'http://localhost:5173';
app.use(cors({
  origin: VITE_DEV_URL,
  credentials: true
}));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: "https://" + process.env.AUTH0_DOMAIN,
  })
);

// Custom middleware for API routes - return 401 instead of redirecting
app.use("/api", (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
});

// API routes must come before static serving
app.use("/api", api);

// Root route - redirect authenticated users to Vite dev server (in development)
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // In development, redirect to Vite
    if (process.env.NODE_ENV !== 'production') {
      return res.redirect(`${VITE_DEV_URL}/home`);
    }
  }
  // In production or not authenticated, continue to static files
  res.redirect('/home');
});

// Require auth for all other routes (will redirect to Auth0)
app.use(requiresAuth());

// Serve React build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback - all non-API routes serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(3000);
