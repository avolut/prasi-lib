import { ConsoleLogWriter } from "drizzle-orm";
import { newClientRouter } from "../server/server-route";
import { sessionRouter } from "./router/router";
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
    current: null,
    connected: false,
    async connect(auth) {},
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
