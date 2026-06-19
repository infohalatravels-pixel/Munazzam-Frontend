import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  setSession,
  updateAccessToken,
  updateRefreshToken,
  updateSessionUser,
  type AuthSession,
  type SessionUser,
} from "./session";
import { ApiError, type ApiErrorCode, type ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type LoginPayload = {
  email: string;
  password: string;
};

type RefreshData = {
  accessToken: string;
  refreshToken: string;
};

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "Unexpected server response. Please try again.",
      "INTERNAL_ERROR",
      response.status
    );
  }
}

function throwApiError(result: ApiResponse<unknown>, status: number): never {
  throw new ApiError(
    result.message || "Request failed.",
    (result.code as ApiErrorCode) || "INTERNAL_ERROR",
    status
  );
}

export async function loginRequest(payload: LoginPayload): Promise<AuthSession> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });
  } catch {
    throw new ApiError(
      "Unable to connect to server. Make sure the backend is running.",
      "INTERNAL_ERROR"
    );
  }

  const result = await parseResponse<AuthSession>(response);

  if (!response.ok || !result.success || !result.data) {
    throwApiError(result, response.status);
  }

  return result.data;
}

export async function refreshRequest(refreshToken: string): Promise<RefreshData> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new ApiError("Unable to connect to server.", "INTERNAL_ERROR");
  }

  const result = await parseResponse<RefreshData>(response);

  if (!response.ok || !result.success || !result.data) {
    throwApiError(result, response.status);
  }

  return result.data;
}

export async function meRequest(accessToken: string): Promise<SessionUser> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    throw new ApiError("Unable to connect to server.", "INTERNAL_ERROR");
  }

  const newToken = response.headers.get("X-New-Token");
  if (newToken) {
    updateAccessToken(newToken);
  }

  const result = await parseResponse<{ user: SessionUser }>(response);

  if (!response.ok || !result.success || !result.data?.user) {
    throwApiError(result, response.status);
  }

  updateSessionUser(result.data.user);
  return result.data.user;
}

export async function logoutRequest(accessToken: string): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    // Always clear local session even if API fails
  }
}

export async function refreshSession(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const data = await refreshRequest(refreshToken);
    updateAccessToken(data.accessToken);
    updateRefreshToken(data.refreshToken);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export async function validateSession(): Promise<SessionUser | null> {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    return await meRequest(accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.code === "TOKEN_EXPIRED") {
      const refreshed = await refreshSession();
      if (!refreshed) return null;

      const newToken = getAccessToken();
      if (!newToken) return null;

      try {
        return await meRequest(newToken);
      } catch {
        clearSession();
        return null;
      }
    }

    clearSession();
    return null;
  }
}

export async function establishSession(session: AuthSession) {
  setSession(session);
  return session.user;
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "INVALID_CREDENTIALS":
        return "Invalid email or password.";
      case "ACCOUNT_DISABLED":
        return "Your account has been disabled. Contact your administrator.";
      default:
        return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Login failed. Please try again.";
}
