import { deleteLike, insertLike, insertResponseLike, deleteResponseLike } from "../db/like.js";

export class BeepNotFoundError extends Error {}

export async function like(userId, beepId) {
  await insertLike(userId, beepId);
}

export async function unlike(userId, beepId) {
  await deleteLike(userId, beepId);
}

export async function like_response(userId, responseId) {
  await insertResponseLike(userId, responseId)
}

export async function unlike_response(userId, responseId) {
  await deleteResponseLike(userId, responseId)
}