import { queryNormalized } from "./connection-pool.js";

export async function getBeepResponses(beepId) {
  return await queryNormalized(
    `
    SELECT
        response.id,
        response.author_id,
        response.content, 
        response.created_at,
        response.beep_id,
        response.like
    FROM
        response
    WHERE
        response.beep_id = $1
    ORDER BY 
      created_at DESC 
    `,
    [beepId]
  );
}
