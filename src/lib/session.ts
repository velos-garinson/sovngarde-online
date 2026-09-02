export const SESSION_KEY = "sovngarde-session-v1";

export type ClientSession =
  | { role: "gm"; pin: string }
  | { role: "grantor"; pin: string }
  | { role: "teacher"; pin: string; institutionId: string; institutionName: string };

export function isSixDigit(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

export function readSession(): ClientSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ClientSession>;
    if (!parsed || (parsed.role !== "gm" && parsed.role !== "grantor" && parsed.role !== "teacher")) {
      return null;
    }
    if (typeof parsed.pin !== "string" || !isSixDigit(parsed.pin)) return null;
    if (parsed.role === "teacher") {
      if (!parsed.institutionId || !parsed.institutionName) return null;
      return {
        role: "teacher",
        pin: parsed.pin,
        institutionId: parsed.institutionId,
        institutionName: parsed.institutionName,
      };
    }
    return { role: parsed.role, pin: parsed.pin };
  } catch {
    return null;
  }
}

export function writeSession(session: ClientSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
