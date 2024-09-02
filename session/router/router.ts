import { newServerRouter } from "lib/server/server-route";

export const sessionRouter = newServerRouter({
  check: ["/_session/check", () => import("./session-check")],
  login: ["/_session/login", () => import("./session-login")],
  logout: ["/_session/logout", () => import("./session-logout")],
  track: ["/_session/track", () => import("./session-track")],
});
