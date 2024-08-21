export type ServerArg = {
  req: Request;
  handle: (req: Request) => Promise<Response>;
  mode: "dev" | "prod";
  url: {
    raw: URL;
    pathname: string;
  };
};
export const newRoute = (arg: {
  url: string;
  handler: (arg: ServerArg) => Promise<Response | void> | Response | void;
}) => {};
