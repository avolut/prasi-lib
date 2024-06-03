import { FC } from "react";
import { prasi_user } from "./utils/user";

const w = window as unknown as {
  prasi_home: Record<string, string>;
};

export type LGProps = {
  salt: string;
  url_home: Array<Record<string, string>>;
  body: any;
};

export const Login: FC<LGProps> = (props) => {
  w.prasi_home = props.url_home[0];
  console.log("render?");
  try {
    const home = prasi_user.prasi_home[prasi_user.user.m_role.name];
    navigate(home);
  } catch (e: any) {
  }
  return <>{props.body}</>;
};
