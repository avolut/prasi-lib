/// <reference types="bun-types" />

import { ServerArg, useServerRoutes } from "./server-route";

type ServerSession = {
  handle: (arg: ServerArg) => Promise<Response>;
};

export const sessionServer = <T>(arg: {
  encrypt?: boolean;
  router?: ReturnType<typeof useServerRoutes>;
  on: {
    login: (arg: {
      mode: "user-pass";
      username: string;
      password: string;
    }) => Promise<false | T>;
  };
}): ServerSession => {
  const internal = {
    has_router: false,
    router: null as null | Awaited<ReturnType<typeof useServerRoutes>>,
  };
  if (typeof arg.router === "object" && arg.router instanceof Promise) {
    internal.has_router = true;
    arg.router.then((e) => {
      internal.router = e;
    });
  }
  const s: ServerSession = {
    async handle(server_arg) {
      const { req, handle } = server_arg;

      if (internal.has_router && internal.router) {
        const result = await internal.router.handle(server_arg);

        if (typeof result === "object" && result instanceof Response) {
          return result;
        }

        return new Response(JSON.stringify(result));
      }

      return handle(req);
    },
  };

  return s;
};
