import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  updateRefreshToken,
} from "./session";
import { refreshRequest } from "./api";
import { ApiError, type ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  retry?: boolean;
};

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Unexpected server response.", "INTERNAL_ERROR", response.status);
  }
}

async function tryRefreshToken(): Promise<boolean> {
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

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, retry = true, headers, ...rest } = options;
  const accessToken = getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(!skipAuth && accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...headers,
    },
  });

  const newToken = response.headers.get("X-New-Token");
  if (newToken) {
    updateAccessToken(newToken);
  }

  const result = await parseResponse<T>(response);

  if (response.status === 401 && !skipAuth && retry) {
    const code = result.code;

    if (code === "TOKEN_EXPIRED") {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiClient<T>(path, { ...options, retry: false });
      }
    }

    clearSession();
    throw new ApiError(
      result.message || "Session expired. Please login again.",
      code || "TOKEN_INVALID",
      401
    );
  }

  if (!response.ok || !result.success) {
    throw new ApiError(
      result.message || "Request failed.",
      result.code || "INTERNAL_ERROR",
      response.status
    );
  }

  return result.data as T;
}
