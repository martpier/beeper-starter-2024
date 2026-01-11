import "dotenv/config";

import express from "express";
import "express-async-errors";
import expressauth from "express-openid-connect";

import path from "path";
import { fileURLToPath } from "url";
import { api } from "./api/api-router.js";
const { auth, requiresAuth } = expressauth;

const app = express();

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

app.use(requiresAuth());

// API routes must come before static serving
app.use("/api", api);

// Serve React build in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA fallback - all non-API routes serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(3000);
