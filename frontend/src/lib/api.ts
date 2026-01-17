// frontend/src/lib/api.ts
import { postJson } from "./http";

export async function createPoll(payload: {
  question: string;
  options: string[];
}): Promise<void> {
  await postJson("/polls", payload, { auth: false });
}