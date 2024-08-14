import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { PFTypes } from "./typings";
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
