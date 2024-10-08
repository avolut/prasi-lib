import { Server } from "bun";

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
  update: (
    where: Partial<FilterSessionArg>,
    data: { active?: boolean; wsid?: string[] }
  ) => SingleSession<T>[];
  findMany: (arg?: Partial<FilterSessionArg>) => SingleSession<T>[];
  findFirst: (arg?: Partial<FilterSessionArg>) => null | SingleSession<T>;
};

export type ServerSession<T> = SessionStore<T> & {
  current?: SingleSession<T>;
};

export type ClientSessionStatus =
  | "checking"
  | "guest"
  | "expired"
  | "active"
  | "logout";
export type ClientSession<T> = {
  status: ClientSessionStatus;
  current: null | T;
  init(): Promise<{ status: ClientSessionStatus }>;
  connected: boolean;
  login(auth: SessionAuth): Promise<T>;
  logout(): Promise<void>;
  save(data: T): Promise<void>;
  load(): Promise<T | null>;
  clear(): Promise<void>;
};

export interface SessionContext<T> extends ServerContext {
  session: ServerSession<T>;
}

export type ServerContext = {
  req: Request;
  server: Server;
  handle: (req: Request) => Promise<Response>;
  mode: "dev" | "prod";
  url: {
    raw: URL;
    pathname: string;
  };
};

export type SessionAuth = {
  method: "user-pass";
  username: string;
  password: string;
} & Record<string, any>;
