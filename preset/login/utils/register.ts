import { EsensiSession } from "app/server/session";
import day from "dayjs";

const w = window as any;
export type RG = {
  data: any;
  role: string;
  expired: number; // second
};

export type UserSession = {
  data: EsensiSession;
  expired: Date; // second
};
export const registerSession = (session: RG) => {
  if (session.role) {
    session.data.role = session.role;
  }
  const data = {
    data: session.data,
    expired: session.expired ? day().add(session.expired, "seconds") : null,
  };

  let id_site = "";
  if (
    location.hostname === "prasi.avolut.com" ||
    location.host === "localhost:4550"
  ) {
    const parts = location.pathname.split("/");
    id_site = parts[2];
  }

  localStorage.setItem("user" + id_site, JSON.stringify(data));
  localStorage.setItem(
    "expiry_date",
    data.expired ? data.expired?.format("YYYY-MM-DD HH:mm:ss") : ""
  );
  w.user = session.data;
  w.user.role = session.role;
};
