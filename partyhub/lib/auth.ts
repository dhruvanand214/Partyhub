const TOKEN_KEY = "cheers_india_auth";
const TOKEN_EXPIRY_DAYS = 30;

interface AuthToken {
  verified: boolean;
  birthYear: number;
  verifiedAt: number;
  expiresAt: number;
}

export function saveAuthToken(birthYear: number) {
  const now = Date.now();
  const token: AuthToken = {
    verified: true,
    birthYear,
    verifiedAt: now,
    expiresAt: now + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function getAuthToken(): AuthToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const token: AuthToken = JSON.parse(raw);
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}