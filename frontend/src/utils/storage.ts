const KEYS = {
  ACCESS_TOKEN: 'mf_access_token',
  REFRESH_TOKEN: 'mf_refresh_token',
  USER: 'mf_user',
} as const;

export const storage = {
  getAccessToken: (): string | null => localStorage.getItem(KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string): void => localStorage.setItem(KEYS.ACCESS_TOKEN, token),
  removeAccessToken: (): void => localStorage.removeItem(KEYS.ACCESS_TOKEN),

  getRefreshToken: (): string | null => localStorage.getItem(KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string): void => localStorage.setItem(KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: (): void => localStorage.removeItem(KEYS.REFRESH_TOKEN),

  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  },
  setUser: (user: unknown): void => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem(KEYS.USER),

  clearAll: (): void => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
  },
};
