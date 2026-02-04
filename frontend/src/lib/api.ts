import { postJson, getJson, deleteJson } from "./http";
import { Poll } from "../app/components/discover/Types";

/**
 * Create a poll (AUTH REQUIRED)
 */
export async function createPoll(payload: {
  title: string;
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
    title: string;
    question: string;
    options: { _id: string; text: string; votes: number }[];
    createdAt: string;
  }[];
}> {
  return getJson("/polls/me");
}

/**
 * Get active polls (PUBLIC)
 */
export async function getActivePolls(): Promise<Poll[]> {
  return getJson("/polls/active");
}

/**
 * Vote on a poll option (PUBLIC)
 */
export async function voteOnPoll(pollId: string, optionId: string): Promise<{ success: true }> {
  return postJson(`/polls/${pollId}/vote/${optionId}`, {});
}

/**
 * Delete a poll (AUTH REQUIRED)
 */
export async function deletePoll(pollId: string): Promise<{ success: true }> {
  return deleteJson(`/polls/${pollId}`);
}
