/// <reference types="bun-types" />

type ServerSession = {
  handle: (arg: {
    req: Request;
    handle: (req: Request) => Promise<Response>;
    mode: "dev" | "prod";
    url: {
      raw: URL;
      pathname: string;
    };
  }) => Promise<Response>;
};

export const sessionServer = <T>(arg: {
  encrypt?: boolean;
  on: {
    login: (arg: {
      mode: "user-pass";
      username: string;
      password: string;
    }) => Promise<false | T>;
  };
}): ServerSession => {
  const s: ServerSession = {
    async handle({ req, handle, mode, url }) {
      if (url.pathname.startsWith("/_session")) {
        return new Response("marjio");
      }

      return await handle(req);
    },
  };

  return s;
};
