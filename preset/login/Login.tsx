import { FieldLoading } from "lib/comps/ui/field-loading";
import { getBasename } from "lib/utils/pathname";
import { useLocal } from "lib/utils/use-local";
import { FC } from "react";
import { loadSession } from "./utils/load";

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
    if (w.user) {
      const home = props.url_home[w.user.role];
      if (home) {
        location.href = getBasename() + home;
        return;
      }
    }
    local.loading = false;
    local.render();
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
