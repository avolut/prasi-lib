import { LoginResult } from "app/server/router/login";
import {
  newClientRouter,
  SingleRoute,
  SingleRouteWithOption,
} from "../server/server-route";
import { ClientSession, SessionAuth } from "./type";

export const newClientSession = <T>(arg: {
  tracker?: { enabled?: boolean };
  route: {
    login: SingleRoute | SingleRouteWithOption;
  };
  on: {
    save: (data: T) => Promise<void>;
    load: () => Promise<T | null>;
    clear: () => Promise<void>;
    messageReceived?: (session: ClientSession<T>) => Promise<void>;
    afterLogin: (arg: LoginResult, session: ClientSession<T>) => Promise<void>;
    afterLogout?: (session: ClientSession<T>) => Promise<void>;
    afterInit: (session: ClientSession<T>) => Promise<void>;
  };
}) => {
  const router = { login: arg.route.login };
  const client = newClientRouter(router);

  const login_promise = { resolve: null as any, reject: null as any };
  const logout_promise = { resolve: null as any, reject: null as any };

  const session: ClientSession<T> = {
    status: "checking",
    current: null,
    connected: false,
    save: arg.on.save,
    load: arg.on.load,
    clear: arg.on.clear,
    async init() {
      arg.on.afterInit(session);

      return { status: this.status };
    },
    login(auth: SessionAuth) {
      return new Promise<T>(async (resolve, reject) => {
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

        if (this.status !== "active") {
          const result: LoginResult = await client.login(auth);
          arg.on.afterLogin(result, session);
        } else {
          console.error(
            `\
Session login failed, current status is: ${this.status}. 
Login is prevented, please logout first before re-login!`
          );
        }

        if (this.current) {
          resolve(this.current);
        } else {
          if (auth) {
          } else {
            reject("Current session not found");
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

        if (arg.on.afterLogout) {
          arg.on.afterLogout(session);
        }
      });
    },
  };

  if (!isEditor) {
    session.init();
  }
  return session;
};
