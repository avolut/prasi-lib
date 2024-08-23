/// <reference types="bun-types" />

import { ServerContext, useServerRouter } from "./server-route";
import {
  newSessionStore,
  SessionData,
  SessionStore,
  SingleSession,
} from "./session/session-store";

export type ServerSession<T> = SessionStore<T> & {
  current?: SingleSession<T>;
};

type SessionServerHandler = {
  cleanup: () => Promise<void>;
  handle: (arg: ServerContext) => Promise<Response>;
};

export const createSessionServer = <T >(arg: {
  encrypt?: boolean;
  router?: ReturnType<typeof useServerRouter>;
  site_id?: string;
}): SessionServerHandler => {
  const server_session = newSessionStore<T>(arg.site_id);

  const server_handler: SessionServerHandler = {
    async cleanup() {},
    async handle(server_arg) {
      const { req, handle } = server_arg;

      if (arg.router) {
        return await arg.router.handle({
          ...server_arg,
          session: {
            ...server_session,
            current: undefined,
          },
        });
      }

      return handle(req);
    },
  };

  return server_handler;
};
