const REMEMBER_EMAIL_KEY = "munazzam_remember_email";

export function getRememberedEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(REMEMBER_EMAIL_KEY) || "";
}

export function setRememberedEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
}

export function clearRememberedEmail() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REMEMBER_EMAIL_KEY);
}
