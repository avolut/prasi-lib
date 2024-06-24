import { FC, useEffect } from "react";
import { loadSession } from "./utils/load";
import { useLocal } from "lib/utils/use-local";
import { FieldLoading } from "../../..";

const w = window as unknown as {
  user: any;
  prasi_home: Record<string, string>;
};

export type LGProps = {
  url_home: Record<string, string>;
  body: any;
};

export const Login: FC<LGProps> = (props) => {
  const local = useLocal({ loading: true }, () => {
    loadSession();
    setTimeout(() => {
      if (w.user) {
        const home = props.url_home[w.user.role];
        if (home) {
          navigate(home);
          return;
        }
      }
      local.loading = false;
      local.render();
    }, 500);
  });

  if (local.loading)
    return (
      <div
        className={css`
          padding: 10px;
        `}
      >
        <FieldLoading />
      </div>
    );
  return <>{props.body}</>;
};
