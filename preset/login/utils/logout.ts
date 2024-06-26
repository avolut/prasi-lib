import { getPathname } from "lib/utils/pathname";
import get from "lodash.get";

const w = window as any;
export type RGSession = {
  data: any;
  expired: number; // second
};

export const logout = (url_login?: string) => {
  if (typeof get(w, "user") === "object") {
    w.user = null;
  }

  let id_site = "";
  if (location.hostname === "prasi.avolut.com") {
    const parts = location.pathname.split("/");
    id_site = parts[2];
  }
  if (localStorage.getItem("user" + id_site)) {
    localStorage.removeItem("user" + id_site);
  }
  if (url_login) navigate(url_login);
};
