import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import get from "lodash.get";

export type BreadItem = {
  label: React.ReactNode;
  url?: string;
  onClick?: (ev: any) => void;
};

type BreadcrumbProps = {
  on_load?: (e?: any) => Promise<BreadItem[]>;
  className?: string;
  value?: BreadItem[];
  item?: PrasiItem;
};

export const Breadcrumb: FC<BreadcrumbProps> = ({
  value,
  className,
  on_load,
  item,
}) => {
  const local = useLocal({
    list: [] as BreadItem[],
    status: "init" as "init" | "loading" | "ready",
    params: {},
    reload: () => {
      if (typeof on_load === "function") {
        local.status = "loading";
        on_load(local).then((res: any) => {
          if(typeof res === "object"){
            local.list = get(res, "list") || [];
          }
          local.status = "ready";
          local.render();
        });
      }
      local.render();
    }
  });

  useEffect(() => {
    if (value) {
      local.list = value;
      local.status = "ready";
    }
    local.reload();
  }, []);
  return (
    <div
      className={cx(
        "breadcrumb c-w-full c-flex c-items-center c-flex-wrap",
        className
      )}
    >
      {local.status !== "ready" ? (
        <Skeleton className="c-h-4 c-w-[80%]" />
      ) : (
        <>
          {local.list &&
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
            })}
        </>
      )}
    </div>
  );
};
