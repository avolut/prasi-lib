import { newClientRouter } from "../server-route";
import { sessionRouter } from "./router/session-router";
import { sessionClientStore } from "./store/client-store";
import { ClientSession } from "./type";

export const newClientSession = <T>(arg?: {
  on: Partial<{
    session: ClientSession<T>;
    messageReceived: () => Promise<void>;
    afterLogin: () => Promise<void>;
    afterLogout: () => Promise<void>;
    afterRecheck: () => Promise<void>;
  }>;
}) => {
  const store = sessionClientStore<T>();
  const client = newClientRouter(sessionRouter);

  const session: ClientSession<T> = {
    status: "checking",
    current: null,
    async recheck() {
      const current = await store.load();
      if (!current) {
        this.status = "guest";
      } else {
        this.status = await client.check(current.uid, current.sid);
      }
      return { status: this.status };
    },
    async login(arg: {
      method: "user-pass";
      username: string;
      password: string;
    }) {},
    async logout() {},
  };

  session.recheck().then((e) => {
    console.log(e);
  });

  return session;
};
