import { ConsoleLogWriter } from "drizzle-orm";
import { newClientRouter } from "../server/server-route";
import { sessionRouter } from "./router/session-router";
import { sessionClientStore } from "./store/client-store";
import { ClientSession, SessionAuth, SessionData } from "./type";

export const newClientSession = <T>(arg?: {
  tracker?: { enabled?: boolean };
  on?: Partial<{
    messageReceived: (session: ClientSession<T>) => Promise<void>;
    afterLogin: (session: ClientSession<T>) => Promise<void>;
    afterLogout: (session: ClientSession<T>) => Promise<void>;
    afterInit: (session: ClientSession<T>) => Promise<void>;
  }>;
}) => {
  const store = sessionClientStore<T>();
  const client = newClientRouter(sessionRouter);

  const login_promise = { resolve: null as any, reject: null as any };
  const logout_promise = { resolve: null as any, reject: null as any };

  const session: ClientSession<T> = {
    status: "checking",
    wsid: "",
    current: null,
    connected: false,
    get connectURL() {
      const url = new URL(location.href);
      url.protocol = "wss:";
      url.hash = "";
      return url;
    },
    connect(auth?: SessionAuth) {
      return new Promise<void>(async (done, reject) => {
        const current = this.current;
        if (current || auth) {
          if (this.ws) {
            await wsReady(this.ws);
          }

          const ws = new WebSocket(this.connectURL);
          this.ws = ws;
          ws.onclose = () => {
            session.connected = false;
            console.log(this.status);
            if (this.status === "logout") {
              store.clear();
              this.current = null;
              if (arg?.on?.afterLogout) {
                arg.on.afterLogout(session);
              }
              logout_promise.resolve();
              logout_promise.resolve = null;
              logout_promise.reject = null;
            } else {
              setTimeout(() => {
                console.warn("Reconnecting Session WS...");
                this.connect();
              }, 2000);
            }
          };
          ws.onopen = () => {
            if (session.current) {
              ws.send(
                JSON.stringify({
                  uid: session.current.uid,
                  sid: session.current.sid,
                })
              );
            } else {
              if (auth) {
                ws.send(JSON.stringify(auth));
              } else {
                if (ws.readyState === ws.OPEN) {
                  ws.close();
                }
              }
            }
          };
          ws.onmessage = async (m) => {
            if (!session.connected) {
              try {
                const parsed = JSON.parse(m.data) as
                  | {
                      status: "ok";
                      wsid: string;
                      session: SessionData<T>;
                    }
                  | { status: "failed" };

                if (parsed.status === "ok") {
                  session.wsid = parsed.wsid;
                  session.current = parsed.session;
                  if (login_promise.resolve) {
                    session.connected = true;
                    login_promise.resolve(session.current);
                    await store.save(session.current);
                  }
                } else {
                  if (login_promise.reject) login_promise.reject();
                }
                login_promise.resolve = null;
                login_promise.reject = null;
                if (arg?.on?.afterLogin) {
                  arg.on.afterLogin(session);
                }
                done();

                return;
              } catch (e) {
                reject(e);
              }

              if (ws.readyState === ws.OPEN) {
                ws.close();
              }
            }
          };
        } else {
          done();
        }
      });
    },
    async init() {
      const current = await store.load();
      if (!current) {
        this.status = "guest";
      } else {
        this.current = current;
        this.status = await client.check(current.uid, current.sid);
        if (this.status !== "active") {
          await store.clear();
          this.current = null;
        } else {
          await this.connect();
        }
      }
      if (arg?.on?.afterInit) {
        arg.on.afterInit(session);
      }

      return { status: this.status };
    },
    login(auth: SessionAuth) {
      return new Promise<SessionData<T>>(async (resolve, reject) => {
        if (isEditor) {
          resolve({} as any);
          return;
        }

        login_promise.resolve = resolve;
        login_promise.reject = reject;
        if (this.status === "checking") {
          await new Promise<void>((done) => {
            const ival = setInterval(() => {
              if (this.status !== "checking") {
                clearInterval(ival);
                done();
              }
            }, 100);
          });
        }

        if (this.status === "guest") {
          this.connect(auth);
        } else {
          console.error(
            `\
Session login failed, current status is: ${this.status}. 
Login is prevented, please logout first before re-login!`
          );
          if (this.current) {
            resolve(this.current);
          } else {
            if (auth) {
              this.connect(auth);
            } else {
              reject("Current session not found");
            }
          }
        }
      });
    },
    logout() {
      return new Promise<void>(async (resolve, reject) => {
        if (isEditor) {
          resolve({} as any);
          return;
        }

        logout_promise.resolve = resolve;
        logout_promise.reject = reject;
        if (this.status === "active" && this.ws) {
          await wsReady(this.ws);
          this.status = "logout";

          this.ws.send(JSON.stringify({ action: "logout" }));
        }
      });
    },
  };

  if (!isEditor) {
    session.init();
  }
  return session;
};

const wsReady = async (ws: WebSocket) => {
  if (ws) {
    if (ws.readyState === ws.OPEN) return;
    else {
      ws.close();
      await new Promise<void>((done) => {
        const ival = setInterval(() => {
          if (ws.readyState === ws.CLOSED) {
            clearInterval(ival);
            done();
          }
        }, 100);
      });
    }
  }
};
