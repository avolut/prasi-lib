/// <reference types="bun-types" />

import { ServerContext, useServerRouter } from "./server-route";

export type SessionData<T extends Record<string, any> | undefined> = T & {
  uid: string;
  role: string;
  sid: string;
  expired_at?: number;
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
export type ServerSession<T extends SessionData<any>> = {
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
  current?: SingleSession<T>;
};

type SessionServerHandler = {
  cleanup: () => Promise<void>;
  handle: (arg: ServerContext) => Promise<Response>;
};

export const createSessionServer = <T extends SessionData<any>>(arg: {
  encrypt?: boolean;
  router?: ReturnType<typeof useServerRouter>;
}): SessionServerHandler => {
  const internal = {
    has_router: false,
    router: null as null | ReturnType<typeof useServerRouter>,
  };
  const server_session: Omit<ServerSession<T>, "current"> = {
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
  };

  if (typeof arg.router === "object" && arg.router instanceof Promise) {
    internal.has_router = true;
    arg.router.then((e) => {
      internal.router = e;
    });
  }

  const server_handler: SessionServerHandler = {
    async cleanup() {},
    async handle(server_arg) {
      const { req, handle } = server_arg;

      console.log("makaru", internal.has_router, internal.router);
      return new Response("fas");
      // if (internal.has_router && internal.router) {
      //   return await internal.router.handle({
      //     ...server_arg,
      //     session: {
      //       ...server_session,
      //       current: undefined,
      //     },
      //   });
      // }

      // return handle(req);
    },
  };

  return server_handler;
};
