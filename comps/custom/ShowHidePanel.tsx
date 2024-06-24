import { FC, ReactNode, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocal } from "@/utils/use-local";

export const ShowHidePanel: FC<{
  head: ReactNode;
  body: ReactNode;
  open: string;
  PassProp: any;
  on_init: (e?: any) => void
}> = ({ head, body, open, PassProp, on_init}) => {
  const local = useLocal(
    {
      open: true,
      clickPanel: () => {
        local.open = !local.open;
        local.render();
      },
    },
    () => {
    }
  );
  useEffect(() => {
    local.open = open === "true" ? true : false;
    local.render();
    // on_init(local);
  }, [open]);

  return (
    <div className="c-flex c-flex-row c-flex-grow c-w-full">
      <div className="c-flex c-flex-col c-flex-grow">
        <PassProp pn={local} open={local.open}>
          {head}
        </PassProp>
        <div
          className={cx(
            !local.open ? "c-hidden" : "",
            "c-flex c-flex-row c-flex-grow c-w-full"
          )}
        >
          <PassProp pn={local} open={local.open}>
            {body}
          </PassProp>
        </div>
      </div>
    </div>
  );
};
