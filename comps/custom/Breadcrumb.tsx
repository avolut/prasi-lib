import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export type BreadItem = {
  label: React.ReactNode;
  url?: string;
  onClick?: (ev: any) => void;
};

const breadcrumbData = {} as Record<string, any>;

type BreadcrumbProps = {
  on_load?: () => Promise<BreadItem[]>;
  className?: string;
  props?: any;
  value?: BreadItem[];
  item?: any;
};

export const Breadcrumb: FC<BreadcrumbProps> = (_arg) => {
  const { on_load, item } = _arg;

  const local = useLocal({
    list: _arg.value || ([] as BreadItem[]),
    status: "init" as "init" | "loading" | "ready",
    params: {},
  });

  if (_arg.value) {
    local.list = _arg.value;
    local.status = "ready";
  }

  if (local.status === "init") {
    let should_load = true;

    if (isEditor && item && breadcrumbData[item.id]) {
      local.list = breadcrumbData[item.id];
      local.status = "ready";
      should_load = false;
    }

    if (should_load && typeof on_load === "function") {
      const callback = (res: any) => {
        local.list = res;
        if (item) breadcrumbData[item.id] = res;
        local.status = "ready";
      };
      const res = on_load();
      if (res instanceof Promise) {
        res.then((res) => {
          callback(res);
          local.render();
        });
      } else callback(res);
    }
  }

  if (isEditor && local.status !== "ready") {
    if (item && breadcrumbData[item.id]) {
      local.list = breadcrumbData[_arg.item.id];
    }
    local.status = "ready";
  }

  return (
    <div
      className={cx(
        "breadcrumb c-w-full c-flex c-items-center c-flex-wrap",
        _arg.className
      )}
    >
      {local.status !== "ready" ? (
        <Skeleton className="c-h-4 c-w-[80%]" />
      ) : (
        <>
          {local.list === null ? (
            <>
              <h1 className="c-font-semibold c-text-xs md:c-text-base">
                Null Breadcrumb
              </h1>
            </>
          ) : (
            (local.list || []).map((item, index): ReactNode => {
              const lastIndex = local.list.length - 1;

              return (
                <>
                  {index === lastIndex ? (
                    <h1 className="c-font-semibold c-text-xs md:c-text-base">
                      {item?.label}
                    </h1>
                  ) : (
                    <h1
                      className="c-font-normal c-text-xs md:c-text-base hover:c-cursor-pointer hover:c-underline"
                      onClick={(ev) => {
                        if (item.url) navigate(item.url || "");
                        if (item.onClick) item.onClick(ev);
                      }}
                    >
                      {item?.label}
                    </h1>
                  )}

                  {index !== lastIndex && (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </div>
                  )}
                </>
              );
            })
          )}
        </>
      )}
    </div>
  );
};
