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

export const sessionServer = (arg: { encrypt?: boolean }): ServerSession => {
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
