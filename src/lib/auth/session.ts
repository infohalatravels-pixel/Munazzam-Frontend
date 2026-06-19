export const SESSION_KEYS = {
  ACCESS_TOKEN: "munazzam_access_token",
  REFRESH_TOKEN: "munazzam_refresh_token",
  USER: "munazzam_user",
} as const;

export type UserRole = "ADMIN" | "PRO" | "ACCOUNTANT";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phoneNo: string | null;
  role: UserRole;
  isActive: boolean;
  isCompanySetup: boolean;
  onboardingStep: number;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);
}

export function getSessionUser(): SessionUser | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(SESSION_KEYS.USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function setSession(session: AuthSession) {
  if (!isBrowser()) return;

  sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, session.accessToken);
  sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, session.refreshToken);
  sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(session.user));
}

export function updateAccessToken(accessToken: string) {
  if (!isBrowser()) return;
  sessionStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, accessToken);
}

export function updateRefreshToken(refreshToken: string) {
  if (!isBrowser()) return;
  sessionStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
}

export function updateSessionUser(user: SessionUser) {
  if (!isBrowser()) return;
  sessionStorage.setItem(SESSION_KEYS.USER, JSON.stringify(user));
}

export function clearSession() {
  if (!isBrowser()) return;

  sessionStorage.removeItem(SESSION_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(SESSION_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(SESSION_KEYS.USER);
}
