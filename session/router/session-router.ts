import { newServerRouter } from "lib/server/server-route";

export const sessionRouter = newServerRouter({
  check: ["/_session/check", () => import("./session-check")],
});
