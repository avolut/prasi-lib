import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocal } from "@/utils/use-local";

export const Tab: FC<{
  tabs: (arg: { count: (string | number)[] }) => {
    label: string;
    navigate: string;
    count: string;
    color?: string;
    onClick?: () => Promise<void> | void;
  }[];
  active: string;
  body: any;
  on_load?: () => any;
  PassProp: any;
}> = ({ tabs, active, body, PassProp, on_load }) => {
  const local = useLocal({
    active,
    count: [] as (number | string)[],
    status: "init" as "init" | "load" | "ready",
  }, () => {
    if (local.status === "init") {
      if (typeof on_load === "function" && !isEditor) {
        local.status = "load";
        const res = on_load();
        if (typeof res === "object" && res instanceof Promise) {
          res.then((value) => {
            local.count = value;
            local.status = "ready";
            local.render();
          });
        } else {
          local.count = res;
          local.status = "ready";
        }
      } else {
        local.status = "ready";
      }
    }
  });
  
  const all_tabs = tabs({ count: local.count || [] });
  return (
    <div className="c-p-1 c-flex c-flex-1 c-w-full c-flex-col c-items-stretch">
      <Tabs value={local.active} className="">
        <TabsList
          className={cx(
            "c-grid c-w-full ",
            css`
              grid-template-columns: repeat(${all_tabs.length}, minmax(0, 1fr));
            `
          )}
        >
          {all_tabs.map((e, idx) => {
            if (e.navigate) {
              preload(e.navigate);
            }
            return (
              <TabsTrigger
                value={idx + ""}
                onClick={() => {
                  local.active = idx.toString();
                  local.render();
                  if (e.navigate) {
                    navigate(e.navigate);
                  }
                }}
                className={cx(
                  css`
                    padding: 0px !important;
                    margin: 0px 0px 0px ${idx === 0 ? 0 : 5}px;
                    border-bottom-right-radius: 0px;
                    border-bottom-left-radius: 0px;
                  `
                )}
              >
                <div
                  className={cx(
                    " c-flex-1 c-p-1",
                    e.count ? "c-flex c-justify-between" : "",
                    local.active === idx.toString()
                      ? css`
                          border-bottom: 2px solid
                            ${e.color ? e.color : "#3c82f6"};
                        `
                      : "border-b-transparent"
                  )}
                >
                  <div className="mr-1">{e.label}</div>
                  {e.count && (
                    <div
                      className={cx(
                        "c-rounded-sm c-px-2 c-text-white",
                        e.color
                          ? css`
                              background-color: ${e.color};
                            `
                          : `c-bg-blue-500`
                      )}
                    >
                      {local.status != "ready" ? "..." : e.count}
                    </div>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <div className="c-flex-1 c-flex c-flex-col">
        <PassProp activeIndex={parseInt(local.active)}>{body}</PassProp>
      </div>
    </div>
  );
};
