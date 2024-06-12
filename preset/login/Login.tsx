import { FC, useEffect } from "react";
import { loadSession } from "./utils/load";

const w = window as unknown as {
  user: any;
  prasi_home: Record<string, string>;
};

export type LGProps = {
  salt: string;
  url_home: Array<Record<string, string>>;
  body: any;
};

export const Login: FC<LGProps> = (props) => {
  w.prasi_home = props.url_home[0];
  useEffect(() => {
    try {
      loadSession();
      if (w.user) {
        const home = w.prasi_home[w.user.m_role.name];
        navigate(home);
      }
    } catch (e: any) {}
  }, []);
  return <>{props.body}</>;
};
