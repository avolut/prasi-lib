import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const HeaderProfile: FC<{
  load: () => Promise<Record<string, any>>;
  children: any;
  PassProp: any;
}> = ({ load, children, PassProp }) => {
  const local = useLocal({
    loading: false,
    data: null as any,
    actions: [] as [string, string | (() => void), ReactNode][],
  });

  useEffect(() => {
    if (typeof load === "function") {
      local.loading = true;
      local.render();
      const res = load();
      if (typeof res === "object" && res instanceof Promise) {
        res.then((e) => {
          local.data = e;
          local.loading = false;
          local.render();
        });
      } else {
        local.data = res;
        local.loading = false;
        local.render();
      }
    }
  }, []);

  return (
    <>
      <PassProp hp={local}>{children}</PassProp>
    </>
  );
};
