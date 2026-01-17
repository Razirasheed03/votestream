import { postJson, getJson } from "./http";

/**
 * Create a poll (AUTH REQUIRED)
 */
export async function createPoll(payload: {
  question: string;
  options: string[];
}): Promise<void> {
  // DO NOT pass auth:false (this is a protected route)
  await postJson("/polls", payload);
}

/**
 * Get polls created by logged-in user (AUTH REQUIRED)
 */
export async function getMyPolls(): Promise<{
  polls: {
    _id: string;
    question: string;
    options: string[];
    createdAt: string;
  }[];
}> {
  return getJson("/polls/me");
}
