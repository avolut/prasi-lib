import { newClientRouter } from "../server-route";
import { sessionRouter } from "./router/session-router";
import { sessionClientStore } from "./store/client-store";
import { ClientSession } from "./type";

export const newClientSession = <T>(arg?: {
  on: Partial<{
    messageReceived: (session: ClientSession<T>) => Promise<void>;
    afterLogin: (session: ClientSession<T>) => Promise<void>;
    afterLogout: (session: ClientSession<T>) => Promise<void>;
    afterRecheck: (session: ClientSession<T>) => Promise<void>;
  }>;
}) => {
  const store = sessionClientStore<T>();
  const client = newClientRouter(sessionRouter);

  const session: ClientSession<T> = {
    status: "checking",
    current: null,
    async connect() {
      const url = new URL(location.href);
      url.protocol = "wss:";
      const ws = new WebSocket(url);

      ws.onopen = () => {
        ws.send("ok");
      };
      ws.onmessage = (m) => {
        console.log(m);
      };
      // const current = await store.load();
      // if (!current) {
      //   this.status = "guest";
      // } else {
      //   this.status = await client.check(current.uid, current.sid);
      // }
      return { status: this.status };
    },
    async login(arg: {
      method: "user-pass";
      username: string;
      password: string;
    }) {},
    async logout() {},
  };

  session.connect();
  return session;
};
