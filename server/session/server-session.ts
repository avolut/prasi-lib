/// <reference types="bun-types" />

import { useServerRouter } from "../server-route";
import { sessionRouter } from "./router/session-router";
import { newSessionStore } from "./store/session-store";
import { ServerContext } from "./type";

type SessionServerHandler = {
  cleanup: () => Promise<void>;
  handle: (arg: ServerContext) => Promise<Response>;
};

export const createSessionServer = <T>(arg: {
  encrypt?: boolean;
  server_router?: ReturnType<typeof useServerRouter>;
  site_id?: string;
}): SessionServerHandler => {
  const session_store = newSessionStore<T>(arg.site_id);

  const session_router = useServerRouter(sessionRouter);

  const server_handler: SessionServerHandler = {
    async cleanup() {},
    async handle(server_arg) {
      const { req, handle, url } = server_arg;

      const route_arg = {
        ...server_arg,
        session: {
          ...session_store,
          current: undefined,
        },
      };

      if (url.pathname.startsWith("/_session/")) {
        const res = await session_router.handle(route_arg);
        if (res) return res;
      }

      if (arg.server_router) {
        const res = await arg.server_router.handle(route_arg);
        if (res) return res;
      }

      return handle(req);
    },
  };

  return server_handler;
};
