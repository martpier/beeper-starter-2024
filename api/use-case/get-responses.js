import { getBeepResponses } from "../db/get-beep-response.js";

export async function getResponses(beepId, userId) {
  const responses = await getBeepResponses(beepId, userId);

  return responses;
}
