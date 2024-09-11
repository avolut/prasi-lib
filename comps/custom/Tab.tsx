import { FC, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocal } from "lib/utils/use-local";

export const Tab: FC<{
  tabs: (arg: { count: (string | number)[] }) => {
    label: string;
    navigate: string;
    count: string;
    width?: number;
    color?: string;
    onClick?: () => Promise<void> | void;
  }[];
  active: string;
  body: any;
  on_load?: () => any;
  PassProp: any;
}> = ({ tabs, active, body, PassProp, on_load }) => {
  const local = useLocal(
    {
      activeIndex: active,
      count: [] as (number | string)[],
      mode: "number" as "number" | "hash",
      status: "init" as "init" | "load" | "ready",
    },
    () => {
      if (local.mode === "hash") {
      }
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
    }
  );

  const all_tabs = tabs({ count: local.count || [] });

  if (local.activeIndex === "#") {
    local.mode = "hash";
  }

  if (!parseInt(local.activeIndex)) {
    if (local.mode === "hash") {
      local.activeIndex = location.hash.substring(1);
      if (!parseInt(local.activeIndex)) {
        local.activeIndex = "0";
      }
    } else {
      local.activeIndex = "0";
    }
  }

  if (!isEditor) {
    useEffect(() => {
      if (local.mode === "hash") {
        local.activeIndex = location.hash.substring(1);
        if (!parseInt(local.activeIndex)) {
          local.activeIndex = "0";
        }
        local.render();
      }
    }, [location.hash]);
  }
  return (
    <div className="c-flex c-flex-1 c-w-full c-flex-col c-items-stretch">
      <Tabs
        value={local.activeIndex}
        className={cx(
          css`
            padding: 0;
            button {
              border-radius: 0;
            }
          `
        )}
      >
        <TabsList
          className={cx(
            "c-flex c-w-full c-rounded-none c-border-b c-border-gray-300",
            css`
              padding: 0 !important;
              height: auto !important;
            `
          )}
        >
          {all_tabs.map((e, idx) => {
            if (e.navigate) {
              preload(e.navigate);
            }
            let has_count =
              local.status !== "ready" ||
              typeof e.count === "number" ||
              typeof e.count === "string";
            return (
              <TabsTrigger
                value={idx + ""}
                onClick={() => {
                  local.activeIndex = idx.toString();
                  if (local.mode === "hash") {
                    location.hash = `#${local.activeIndex}`;
                  }
                  local.render();
                  if (e.navigate) {
                    navigate(e.navigate);
                  }
                }}
                className={cx(
                  css`
                    padding: 0 !important;
                    margin: 0 0 0 ${idx !== 0 ? "5px" : 0};
                  `,
                  e.width
                    ? css`
                        max-width: ${e.width}px;
                        overflow: hidden;
                      `
                    : "c-flex-1"
                )}
              >
                <div
                  className={cx(
                    "c-p-1 c-h-10 c-flex c-items-center",
                    e.width ? "" : " c-flex-1 ",
                    e.count ? " c-justify-between" : "",
                    local.activeIndex === idx.toString()
                      ? css`
                          border-bottom: 2px solid
                            ${e.color ? e.color : "#3c82f6"};
                        `
                      : "border-b-transparent"
                  )}
                >
                  <div className={cx("c-mr-1 c-flex-1 c-px-1 c-flex")}>
                    {e.label}
                  </div>
                  {has_count && (
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
        <PassProp activeIndex={parseInt(local.activeIndex)}>{body}</PassProp>
      </div>
    </div>
  );
};
