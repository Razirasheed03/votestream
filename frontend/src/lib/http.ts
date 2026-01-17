// frontend/src/lib/http.ts
import { auth } from "./firebase";

type Json = Record<string, unknown>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function getFirebaseIdToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user.getIdToken();
}

export async function postJson<TResponse>(
  path: string,
  body: Json,
  options?: {
    auth?: boolean;
  }
): Promise<TResponse> {
  const token = options?.auth === false ? undefined : await getFirebaseIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "omit",
    body: JSON.stringify(body),
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }

  if (!response.ok) {
    const message = data?.message ?? `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return (data?.data ?? data) as TResponse;
}
