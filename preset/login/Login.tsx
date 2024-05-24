import { FC } from "react";

const w = window as unknown as {
  prasi_home: Record<string, string>;
};

export type LGProps = {
  salt: string;
  url_home: Array<Record<string, string>>;
  body: any
};

export const Login: FC<LGProps> = (props) => {
  w.prasi_home = props.url_home[0];
  console.log(w.prasi_home)
  return <>{props.body}</>;
};
