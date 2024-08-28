/// <reference types="bun-types" />

import { ServerWebSocket } from "bun";
import { useServerRouter } from "../server/server-route";
import { sessionRouter } from "./router/session-router";
import { newSessionStore } from "./store/session-store";
import {
  ServerContext,
  SessionAuth,
  SessionStore,
  SingleSession,
} from "./type";
import { createId } from "@paralleldrive/cuid2";
import { ConsoleLogWriter } from "drizzle-orm";

type WS = ServerWebSocket<{ url: string }>;
type SessionServerHandler = {
  cleanup: () => Promise<void>;
  handle: (arg: ServerContext) => Promise<Response>;
  ws: {
    sids: Record<string, WS[]>;
    index: Record<string, WS>;
    conns: Map<WS, { sid: string; uid: string; wsid: string }>;
    init: () => PrasiServer["ws"];
  };
};

export const initSessionServer = <T>(
  server: PrasiServer,
  arg: {
    encrypt?: boolean;
    router?: ReturnType<typeof useServerRouter>;
    login: (
      session: SessionStore<T>,
      arg: SessionAuth
    ) => Promise<SingleSession<T> | false>;
  }
) => {
  try {
    const session_store = newSessionStore<T>(server.site_id);
    const session_router = useServerRouter(sessionRouter);
    const server_handler: SessionServerHandler = {
      async cleanup() {},
      ws: {
        sids: {},
        index: {},
        conns: new Map(),
        init() {
          return {
            async message(ws, message) {
              const sids = server_handler.ws.sids;
              const conns = server_handler.ws.conns;
              const index = server_handler.ws.index;
              const conn = conns.get(ws);
              if (conn) {
                try {
                  if (typeof message === "string") {
                    const parsed = JSON.parse(message) as { action: "logout" };

                    if (parsed.action === "logout") {
                      const sid = `${conn.uid}-${conn.sid}`;

                      if (!sids[sid]) {
                        sids[sid] = [];
                      }
                      sids[sid].forEach((e) => {
                        conns.delete(e);
                        e.close();
                      });

                      session_store.update(
                        { sid: conn.sid, uid: conn.uid },
                        {
                          active: false,
                          wsid: [],
                        }
                      );
                    }
                  }
                } catch (e) {}
              } else {
                try {
                  if (typeof message === "string") {
                    const activateSession = (result: SingleSession<T>) => {
                      try {
                        const wsid = createId();
                        conns.set(ws, {
                          wsid,
                          uid: result.uid,
                          sid: result.sid,
                        });

                        index[wsid] = ws;
                        const sid = `${result.uid}-${result.sid}`;

                        if (!sids[sid]) {
                          sids[sid] = [];
                        }

                        sids[sid].push(ws);

                        const wsids = Object.values(sids[sid]).map(
                          (e) => server_handler.ws.conns.get(e)?.sid || ""
                        );

                        session_store.update(
                          { sid: result.sid, uid: result.uid },
                          {
                            wsid: wsids,
                          }
                        );

                        ws.send(
                          JSON.stringify({
                            status: "ok",
                            wsid,
                            session: result,
                          })
                        );
                      } catch (e) {
                        console.error(e);
                      }
                    };

                    const parsed = JSON.parse(message) as
                      | {
                          method: undefined;
                          uid: string;
                          sid: string;
                        }
                      | SessionAuth;

                    if (parsed) {
                      if (parsed.method) {
                        if (parsed.method === "user-pass") {
                          const result = await arg.login(session_store, parsed);
                          if (result) {
                            activateSession(result);
                          } else {
                            ws.send(JSON.stringify({ status: "failed" }));
                          }
                        }
                      } else {
                        const result = session_store.findFirst({
                          uid: parsed.uid,
                          sid: parsed.sid,
                        });

                        if (result) {
                          if (
                            result.active &&
                            (!result.expired_at ||
                              (result.expired_at &&
                                result.expired_at > Date.now()))
                          ) {
                            activateSession(result);
                          } else {
                            session_store.update(
                              {
                                uid: parsed.uid,
                                sid: parsed.sid,
                              },
                              { active: false }
                            );

                            ws.send(JSON.stringify({ status: "expired" }));
                          }
                        }
                      }
                    }
                  }
                } catch (e) {
                  console.error(e);
                }
              }
            },
            close(ws, code, reason) {
              const result = server_handler.ws.conns.get(ws);

              if (result) {
                const sid = `${result.uid}-${result.sid}`;
                if (server_handler.ws.sids[sid]) {
                  server_handler.ws.sids[sid] = server_handler.ws.sids[
                    sid
                  ].filter((e) => e !== ws);

                  session_store.update(
                    { sid: result.sid },
                    {
                      wsid: Object.values(server_handler.ws.sids[sid]).map(
                        (e) => server_handler.ws.conns.get(e)?.sid || ""
                      ),
                    }
                  );
                }

                delete server_handler.ws.index[result.wsid];
                server_handler.ws.conns.delete(ws);
              }
            },
          };
        },
      },
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

        if (arg.router) {
          const res = await arg.router.handle(route_arg);
          if (res) return res;
        }

        return handle(req);
      },
    };

    server.ws = server_handler.ws.init();
    server.session = server_handler;
  } catch (e) {
    console.log(e);
  }
};
