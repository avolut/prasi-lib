import parser from "any-date-parser";
import { UserSession } from "./register";
import { logout } from "./logout";
const w = window as any;
const parse = parser.exportAsFunctionAny("en-US");
export const loadSession = (url_login?: string) => {
  if (!isEditor) {
    let id_site = "";
    if (location.hostname === "prasi.avolut.com" || location.host === "localhost:4550") {
      const parts = location.pathname.split("/");
      id_site = parts[2];
    }

    try {
      const user = localStorage.getItem("user" + id_site);
      if (user) {
        const raw = JSON.parse(user);
        w.user = raw.data;
        if (typeof raw === "object") {
          const session: UserSession = raw;
          const expired = parse(session.expired);
          if (expired instanceof Date) {
            if (new Date() > expired) {
              if (url_login) logout(url_login);
            }
          }
        }
        return w.user;
      } else {
        if (url_login) logout(url_login);
      }
    } catch (e) {
      if (url_login) logout(url_login);
    }
  }
};
