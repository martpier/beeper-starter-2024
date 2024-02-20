import { getBeepResponses } from "../db/get-beep-response.js";

export async function getResponses(beepId) {
  const responses = await getBeepResponses(beepId);

  return responses;
}
