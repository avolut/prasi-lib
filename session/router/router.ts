import { newServerRouter } from "lib/server/server-route";

export const sessionRouter = newServerRouter({
  check: ["/_session/check", () => import("./session-check")],
  logout: ["/_session/logout", () => import("./session-logout")],
  track: ["/_session/track", () => import("./session-track")],
});
