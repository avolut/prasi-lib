import { SessionData } from "lib/server/server-session";

const w = window as unknown as {
  _prasi_session: any;
  _prasi: { site_id: string };
};

type SessionResponse<T> =
  | { active: false; reason: string }
  | { active: true; data: T; token: string };

export const sessionClient = async <T extends SessionData<any>>(arg: {
  editorSampleData: T;
  auth: {
    mode: "user-pass";
  };
  on?: Partial<{
    active: (arg: { token: string; data: T }) => any;
    expired: () => any;
    logout: () => any;
    broadcast: (arg: { data: any }) => any;
  }>;
}): Promise<Session<T>> => {
  const session: Session<T> = {
    active: false,
    id_site: isEditor ? "" : w._prasi.site_id,
    async login() {},
    async logout() {},
    token: "",
    data: {} as T,
  };
  if (isEditor) {
    session.active = true;
    session.data = arg.editorSampleData;
    return session;
  }
  if (w._prasi_session) return w._prasi_session as Session<T>;

  const s = localStorage.getItem(`prss-${session.id_site}`);
  if (!s) {
    session.active = false;
  } else {
    let url = siteurl("/_session");
    if (
      location.hostname === "prasi.avolut.com" ||
      location.host === "localhost:4550"
    ) {
      const newurl = new URL(location.href);
      newurl.pathname = `/_proxy/${url}`;
      url = newurl.toString();
    }

    const prss = await fetch(url, { method: "POST", body: s });
    try {
      const resp = (await prss.json()) as SessionResponse<T>;
      if (resp) {
        if (resp.active) {
          session.data = resp.data;
          session.active = true;
          session.token = resp.token;
        } else {
          console.warn("Session inactive, reason:" + resp.reason);
        }
      }
    } catch (e) {
      console.warn("Failed to activate session");
    }
  }

  return session;
};

export type Session<T extends SessionData<any>> = {
  active: boolean;
  id_site: string;
  login: (arg: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  token: string;
  data: T;
};
