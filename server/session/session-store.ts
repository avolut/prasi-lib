export type NewSessionData<T extends Record<string, any>> = T & {
  uid: string;
  role: string;
  expired_at?: number;
};

export type SessionData<T extends Record<string, any>> = NewSessionData<T> & {
  sid: string;
  created_at: number;
};

export type SingleSession<T extends SessionData<any>> = {
  data: T;
  track: (arg: { path: string }) => Promise<void>;
  destroy: () => Promise<void>;
};

type FilterSessionArg = {
  uid: string;
  sid: string;
  role: string;
  created_at: { gt?: number; lt?: number };
  expired_at: { gt?: number; lt?: number };
};

export type SessionStore<T extends SessionData<any>> = {
  create: (
    data: Record<string, any> & {
      uid: string;
      role: string;
      expired_at?: number;
    }
  ) => Promise<SingleSession<T>>;
  findMany: (arg: Partial<FilterSessionArg>) => Promise<SingleSession<T>[]>;
  findFirst: (
    arg: Partial<FilterSessionArg>
  ) => Promise<null | SingleSession<T>>;
};

export const newSessionStore = <T>() => {
  return {
    async create(data) {
      const new_session: SingleSession<T> = {
        data: { ...data, created_at: Date.now() } as T,
        async destroy() {},
        async track(arg) {},
      };
      return new_session;
    },
    async findFirst(arg) {
      return null;
    },
    async findMany(arg) {
      return [];
    },
  } as SessionStore<T>;
};
