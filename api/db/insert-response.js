import { queryNormalized } from "./connection-pool.js";

export async function insertResponse(userId, beepId, content) {
  const inserted = await queryNormalized(
    `
        INSERT INTO response (author_id, beepId, content) VALUES ($1, $2, $3) RETURNING *
    `,
    [userId, beepId, content]
  );

  return inserted[0];
}
