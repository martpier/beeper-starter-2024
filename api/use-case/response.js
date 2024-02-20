import DOMPurify from "isomorphic-dompurify";

import { insertResponse } from "../db/insert-response.js";

const RESPONSE_MAX_LENGTH = 280;

export class ResponseTooLongError extends Error {}

export async function postResponse(user, beepId, content) {
  if (content.length > RESPONSE_MAX_LENGTH) {
    throw new ResponseTooLongError();
  }

  const insertedResponse = await insertResponse(user.id, beepId, DOMPurify.sanitize(content));

  return {
    ...insertedResponse,
    authorId: user.id,
    authorName: user.name,
    authorPicture: user.picture,
  };
}
