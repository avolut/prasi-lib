import { FC, ReactNode, isValidElement, useEffect } from "react";
import * as card from "../ui/card";
import { cn } from "@/utils";
import { useLocal } from "@/utils/use-local";
import { Skeleton } from "../ui/skeleton";

export const Card: FC<{
  title: { left: ReactNode; right: ReactNode };
  desc: (() => Promise<ReactNode>) | ReactNode;
  value: (() => Promise<ReactNode>) | ReactNode;
}> = ({ title, desc, value }) => {
  const local = useLocal({
    value: "" as any,
    desc: "" as any,
    status_value: "init" as "init" | "loading" | "ready",
    status_desc: "init" as "init" | "loading" | "ready",
  });

  useEffect(() => {
    if (!isEditor) {
      if (!!value && typeof value === "function") {
        local.status_value = "loading";
        local.render();
        const result = value();
        if (typeof result === "object" && result instanceof Promise) {
          result.then((val) => {
            local.value = val;
            local.status_value = "ready";
            local.render();
          });
        } else {
          local.value = result;
          local.status_value = "ready";
          local.render();
        }
      }

      if (!!desc && typeof desc === "function") {
        local.status_desc = "loading";
        local.render();
        const result = desc();
        if (typeof result === "object" && result instanceof Promise) {
          result.then((val) => {
            local.desc = val;
            local.status_desc = "ready";
            local.render();
          });
        } else {
          local.desc = result;
          local.status_desc = "ready";
          local.render();
        }
      }
    }
  }, []);

  if (typeof desc !== "function") {
    local.status_desc = "ready";
    local.desc = desc;
  } else if (isEditor) {
    local.desc = typeof desc === "function" ? "..." : desc;
    local.status_desc = "ready";
  }

  if (typeof value !== "function") {
    local.status_value = "ready";
    local.value = value;
  } else if (isEditor) {
    local.value = "...";
    local.status_value = "ready";
  }

  return (
    <card.Card className="c-flex c-flex-1">
      <div className={cn("c-p-3 c-text-[14px] c-flex-1")}>
        {!!title && (title.left || title.right) && (
          <div className="c-tracking-tight c-text-sm c-font-medium c-flex c-justify-between c-space-x-1 mb-1 c-items-center">
            <div className="c-flex">{title.left}</div>
            {title.right && (
              <div className="c-flex c-opacity-70 c-text-xs">{title.right}</div>
            )}
          </div>
        )}
        <card.CardTitle className="c-whitespace-nowrap pb-1 h-[28px] c-overflow-hidden">
          {local.status_value === "ready" ? (
            formatObject(local.value)
          ) : (
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-[10px] c-w-[50px]" />
              <Skeleton className="h-[10px] c-w-[40px]" />
            </div>
          )}
        </card.CardTitle>
        <card.CardDescription className="c-text-xs c-whitespace-pre-wrap">
          {local.status_desc === "ready" ? (
            formatObject(local.desc)
          ) : (
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-[10px] c-w-[50px]" />
            </div>
          )}
        </card.CardDescription>
      </div>
    </card.Card>
  );
};

const formatObject = (val: any) => {
  if (typeof val === "object") {
    if (isValidElement(val)) return val;
    else return JSON.stringify(val);
  }
  return val;
};
