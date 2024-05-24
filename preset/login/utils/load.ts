import parser from "any-date-parser";
import { UserSession } from "./register";
import { logout } from "./logout";
const w = window as any;
const parse = parser.exportAsFunctionAny("en-US");
export const loadSession = (url_login?: string) => {
  try {
    const user = localStorage.getItem("user");
    console.log({user})
    if (user) {
      const raw = JSON.parse(user);
      w.user = raw.data;
      if (typeof raw === "object") {
        const session: UserSession = raw;
        const expired = parse(session.expired);
        if (
          typeof expired === "object" &&
          expired instanceof Date
        ) {
          if (new Date() > expired) {
            logout(url_login);
          }
        }
      }
    } else {
      logout(url_login);
    }
  } catch (e) {
    logout(url_login);
  }
};
