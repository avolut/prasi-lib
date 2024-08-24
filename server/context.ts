import { ServerContext, SessionContext } from "./server-route";

export const sessionContext = <T>(sf: any) => {
  return sf as unknown as SessionContext<T>;
};

export const serverContext = (sf: any) => {
  return sf as unknown as ServerContext;
};
