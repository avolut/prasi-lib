import type { ServerContext, SessionContext } from "lib/session/type";

export const sessionContext = <T>(sf: any) => {
  return sf as unknown as SessionContext<T>;
};

export const serverContext = (sf: any) => {
  return sf as unknown as ServerContext;
};
