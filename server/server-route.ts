import { _post } from "lib/utils/post";
import { addRoute, createRouter, findRoute } from "rou3";
import { ServerSession } from "./session/server-session";
import { SessionData } from "./session/store/session-store";

export type ServerContext = {
  req: Request;
  handle: (req: Request) => Promise<Response>;
  mode: "dev" | "prod";
  url: {
    raw: URL;
    pathname: string;
  };
};

export interface SessionContext<T> extends ServerContext {
  session: ServerSession<T>;
}

type RouteFn = (...arg: any[]) => Promise<any>;

type SingleRoute = [string, () => Promise<{ default: RouteFn }>];
type SingleRouteWithOption = [
  string,
  () => Promise<{ default: RouteFn }>,
  RouteOption
];
type RouteOption = {
  request_as?: "json" | "raw";
  response_as?: "json" | "raw";
};
export const newServerRouter = <
  T extends Record<string, SingleRoute | SingleRouteWithOption>
>(
  arg: T
) => {
  return arg;
};

export const newClientRouter = <T extends ReturnType<typeof newServerRouter>>(
  router: T
) => {
  return new Proxy(
    {},
    {
      get(target, api_name, receiver) {
        return (...args: any[]) => {
          const [url, _, opt] = router[api_name as any];
          if (opt && opt.response_as)
            return _post(url, args, { response_as: opt.response_as });

          return _post(url, args);
        };
      },
    }
  ) as {
    [K in keyof T]: Awaited<ReturnType<T[K][1]>>["default"];
  };
};

export const useServerRouter = <T extends ReturnType<typeof newServerRouter>>(
  router: T
) => {
  const rou = createRouter<{
    handler: { default: RouteFn };
    opt?: RouteOption;
  }>();

  for (const item of Object.values(router)) {
    try {
      addRoute(rou, undefined, item[0], {
        handler: (item as any)[1](),
        opt: item[2],
      });
    } catch (e) {}
  }

  return {
    async handle(arg: ServerContext | SessionContext<any>) {
      const { url, req } = arg;
      const found = findRoute(rou, undefined, url.pathname);

      if (found) {
        const route = found.data;

        if (route.handler instanceof Promise) {
          route.handler = await route.handler;
        }

        let result = null;
        if (route.opt && route.opt?.request_as === "raw") {
          result = await route.handler.default.bind(arg)();
        } else {
          let params = [];
          try {
            params = await req.json();
          } catch (e) {}
          result = await route.handler.default.bind(arg)(...params);
        }

        if (typeof result === "object" && result instanceof Response) {
          return result;
        }

        return new Response(JSON.stringify(result));
      }
    },
  };
};
