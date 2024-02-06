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

app.get("/api/followee", async (req, res) => {
  const userId = req.user.id;
  const suggestions = await queryNormalized(
    `
  SELECT DISTINCT u.name, u.picture, u.id
  FROM follow f INNER JOIN users u ON u.id = f.followee
  WHERE f.follower IN (
    SELECT u.id
    FROM follow f INNER JOIN users u ON u.id = f.followee
    WHERE f.follower = $1
    ) AND u.id NOT IN (SELECT u.id
      FROM follow f INNER JOIN users u ON u.id = f.followee
      WHERE f.follower = $1
    ) AND u.id != $1
  `,
    [userId]
  );
  res.json(suggestions);
});

app.get("/api/friends/", async (req, res) => {
  const userId = req.user.id;
  const friendsList = await queryNormalized(
    `
    SELECT DISTINCT u.name, u.picture, u.id
    FROM follow f INNER JOIN users u ON u.id = f.followee
    WHERE f.follower = $1
    `,
    [userId]
  );
  res.json(friendsList);
});

app.get("/api/mlm/", async (req, res) => {
  const mlm = await queryNormalized(`
    SELECT 
      b.id, 
      b.content,
      b.created_at AS createdAt,
      b.like_count AS likeCount,
      b.author_id AS authorId,
      u.name AS authorName,
      u.picture AS authorPicture
    FROM 
      beep b 
    INNER JOIN 
      users u ON u.id = b.author_id
    ORDER BY 
      like_count DESC
    LIMIT 10
  `);
  res.json(mlm);
});

app.get("/user/*", (req, res) => {
  res.sendFile(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "web/page/user/index.html"
    )
  );
});

app.post("/api/newFollow", async (req, res) => {
  const followeeId = req.body.followedUserId;
  const userId = req.user.id;
  const newFollow = await queryNormalized(
    `
  INSERT INTO follow (follower, followee)
  VALUES ($1, $2)
  `,
    [userId, followeeId]
  );

  console.log("ID de l'utilisateur :", userId, followeeId);

  res.json({ message: "Profil modifié avec succès" });
});

app.listen(3000);
