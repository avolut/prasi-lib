/// <reference types="bun-types" />

import { ServerArg } from "./server-route";

type ServerSession = {
  handle: (arg: ServerArg) => Promise<Response>;
};

export const sessionServer = <T>(arg: {
  encrypt?: boolean;
  router?: (
    arg: ServerArg & { session: {} }
  ) => Response | (() => Promise<Response | void>) | void;
  on: {
    login: (arg: {
      mode: "user-pass";
      username: string;
      password: string;
    }) => Promise<false | T>;
  };
}): ServerSession => {
  const s: ServerSession = {
    async handle(server_arg) {
      const { req, handle, mode, url } = server_arg;
      if (typeof arg.router === "function") {
        let result = arg.router({
          ...server_arg,
          session: {},
        });
        if (result && typeof result === "function") {
          result = await result();
        }
        if (result instanceof Response) {
          return result;
        }
      }

      return await handle(req);
    },
  };

  return s;
};
