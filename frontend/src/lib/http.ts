import { auth } from "./firebase";

type Json = Record<string, unknown>;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

/**
 * Get Firebase ID token for authenticated requests
 */
async function getFirebaseIdToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user.getIdToken();
}

/**
 * POST JSON helper
 */
export async function postJson<TResponse>(
  path: string,
  body: Json,
  options?: {
    auth?: boolean;
  }
): Promise<TResponse> {
  const token =
    options?.auth === false ? undefined : await getFirebaseIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "omit",
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => {
    throw new Error("Invalid response from server");
  });

  if (!response.ok) {
    throw new Error(
      data?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return (data?.data ?? data) as TResponse;
}

/**
 * DELETE JSON helper
 */
export async function deleteJson<TResponse>(
  path: string,
  options?: {
    auth?: boolean;
  }
): Promise<TResponse> {
  const token =
    options?.auth === false ? undefined : await getFirebaseIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "omit",
  });

  const data = await response.json().catch(() => {
    throw new Error("Invalid response from server");
  });

  if (!response.ok) {
    throw new Error(
      data?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return (data?.data ?? data) as TResponse;
}

/**
 * GET JSON helper
 */
export async function getJson<TResponse>(
  path: string,
  options?: {
    auth?: boolean;
  }
): Promise<TResponse> {
  const token =
    options?.auth === false ? undefined : await getFirebaseIdToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "omit",
  });

  const data = await response.json().catch(() => {
    throw new Error("Invalid response from server");
  });

  if (!response.ok) {
    throw new Error(
      data?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return (data?.data ?? data) as TResponse;
}
