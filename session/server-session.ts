import { ServerWebSocket } from "bun";
import { useServerRouter } from "../server/server-route";
import { newSessionStore } from "./store/session-store";
import { ServerContext } from "./type";

type WS = ServerWebSocket<{ url: string }>;
export type SessionServerHandler = {
  cleanup: () => Promise<void>;
  handle: (
    arg: ServerContext,
    opt?: {
      rewrite?: (arg: {
        body: Bun.BodyInit;
        headers?: Record<string, string>;
      }) => Bun.BodyInit;
    }
  ) => Promise<Response>;
};

export const initSessionServer = <T>(
  server: PrasiServer,
  arg: {
    encrypt?: boolean;
    router: ReturnType<typeof useServerRouter>;
  }
) => {
  try {
    const session_store = newSessionStore<T>(server.site_id);
    const session_router = arg.router;
    const server_handler: SessionServerHandler = {
      async cleanup() {},

      async handle(server_arg, opt) {
        const { req, handle, url } = server_arg;

        const route_arg = {
          ...server_arg,
          session: {
            ...session_store,
            current: undefined,
          },
        };

        if (url.pathname.startsWith("/_session/")) {
          const res = await session_router.handle(route_arg, opt);
          if (res) return res;
        }

        if (arg.router) {
          const res = await arg.router.handle(route_arg, opt);
          if (res) return res;
        }

        return handle(req, opt);
      },
    };

    server.session = server_handler;
  } catch (e) {
    console.log(e);
  }
};
