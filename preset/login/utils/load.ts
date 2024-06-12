import parser from "any-date-parser";
import { UserSession } from "./register";
import { logout } from "./logout";
const w = window as any;
const parse = parser.exportAsFunctionAny("en-US");
export const loadSession = (url_login?: string) => {
  if (!isEditor) {
    try {
      const user = localStorage.getItem("user");
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
      } else {
        if (url_login) logout(url_login);
      }
    } catch (e) {
      if (url_login) logout(url_login);
    }
  }
};
