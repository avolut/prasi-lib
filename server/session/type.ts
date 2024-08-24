export interface NewSessionData<T> {
  uid: string;
  role: string;
  data?: T;
  expired_at?: number;
}

export interface SessionData<T> extends NewSessionData<T> {
  sid: string;
  active: boolean;
  created_at: number;
}

export interface SingleSession<T> extends SessionData<T> {
  track: (arg: { path: string }) => void;
  destroy: () => boolean;
}

type FilterSessionArg = {
  uid: string;
  sid: string;
  role: string;
  active: boolean;
  created_at: { gt?: number; lt?: number };
  expired_at: { gt?: number; lt?: number };
};

export type SessionStore<T> = {
  create: (arg: {
    uid: string;
    role: string;
    data?: T;
    expired_at?: number;
  }) => SingleSession<T>;
  findMany: (arg?: Partial<FilterSessionArg>) => SingleSession<T>[];
  findFirst: (arg?: Partial<FilterSessionArg>) => null | SingleSession<T>;
};

export type ServerSession<T> = SessionStore<T> & {
  current?: SingleSession<T>;
};

export type ClientSessionStatus = "checking" | "guest" | "expired" | "active";
export type ClientSession<T> = {
  status: ClientSessionStatus;
  current: null | SessionData<T>;
  recheck(): Promise<{ status: ClientSessionStatus }>;
  login(arg: {
    method: "user-pass";
    username: string;
    password: string;
  }): Promise<void>;
  logout(): Promise<void>;
};
