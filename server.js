import "dotenv/config";

import express from "express";
import "express-async-errors";
import expressauth from "express-openid-connect";

import path from "path";
import { fileURLToPath } from "url";
import { api } from "./api/api-router.js";
import { queryNormalized } from "./api/db/connection-pool.js";
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

app.use(express.static("web/page"));
app.use(express.static("web"));

app.use("/api", api);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/user/*", (req, res) => {
  res.sendFile(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "web/page/user/index.html"
    )
  );
});

// TODO: Move to api
app.delete("/api/delete/:beepId", async (req, res) => {
  const beepId = req.params.beepId;
  const userId = req.user.id;

  // Check if user is admin
  const dbReqAdmins = await queryNormalized(
    `
    SELECT *
    FROM admins
    WHERE user_id = $1;
    `, [userId]
  );
  const userIsAdmin = dbReqAdmins.length > 0;
  
  if (!userIsAdmin) {
    // Check if user is the author of the beep
    const dbReqBeep = await queryNormalized(
      `
      SELECT author_id
      FROM beep
      WHERE id = $1;
      `, [beepId]
    );

    const beepAuthorId = dbReqBeep[0].authorId;

    if (beepAuthorId !== userId) {
      res.status(403).send("You can only delete your own beeps");
      return;
    }
  }
  
  // Delete the beep
  await queryNormalized(
    `
    DELETE
    FROM beep
    WHERE id = $1;
    `, [beepId]
  );

  res.status(200).send("Deleting beep : " + beepId);
});

app.listen(3000);
