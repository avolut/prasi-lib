import day from "dayjs";

const w = window as any;
export type RG = {
  data: any;
  expired: number; // second
};
export type UserSession = {
  data: any;
  expired: Date; // second
};
export const registerSession = (session: RG) => {
  const data = {
    data: session.data,
    expired: session.expired ? day().add(session.expired, "seconds") : null,
  };
  localStorage.setItem("user", JSON.stringify(data));
  w.user = session.data;
};
