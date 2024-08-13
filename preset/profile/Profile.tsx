import { getPathname } from "lib/utils/pathname";
import { FC, ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { loadSession } from "../login/utils/load";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { PFTypes } from "./typings";
import { useLocal } from "lib/utils/use-local";
export { PFTypes } from "./typings";
export { generateProfile } from "./utils/generate";
export const Profile: FC<PFTypes> = ({
  on_load,
  detail,
  on_delete,
  on_update,
  child,
  PassProp,
  pht__on_load,
}) => {
  const local = useLocal(
    {
      item: {} as any,
    },
    async () => {
      if (!isEditor) {
        const item = await on_load({
          params: {},
        });
        local.item = item;
        local.render();
      } else {
        local.item = detail({});
        local.render();
      }
    }
  );
  useEffect(() => {}, [on_load]);
  return (
    <>
      <PassProp
        item={local.item}
        profile={pht__on_load(local.item)}
        pf={{
          on_load,
          detail,
          on_update,
          internal: local,
        }}
      >
        {child}
      </PassProp>
    </>
  );
};
