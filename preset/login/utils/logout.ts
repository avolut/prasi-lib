import { getPathname } from "lib/utils/pathname";
import get from "lodash.get";

const w = window as any;
export type RGSession = {
  data: any;
  expired: number; // second
};

export const logout = (url_login?: string) => {
  console.log("halo")
  if (typeof get(w, "user") === "object") {
    w.user = null;
  }
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
  }
  if (!getPathname().startsWith("/dev")) {
    if (url_login) navigate(url_login);
  }
};
