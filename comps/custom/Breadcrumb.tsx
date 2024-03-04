import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

type BreadcrumbProps = {
  on_load: () => Promise<any[]>;
  props: any;
};

export const Breadcrumb: FC<BreadcrumbProps> = (_arg) => {
  const { on_load } = _arg;

  const local = useLocal({
    list: [] as { label: string; url: string }[],
    status: "init" as "init" | "loading" | "ready",
    params: {},
  });

  useEffect(() => {
    (async () => {
      if (local.status === "init") {
        local.status = "loading";
        local.render();

        local.list = await on_load();

        local.status = "ready";
        local.render();
      }
    })();
  }, [on_load]);

  return (
    <div className="c-w-full c-flex c-items-center c-px-4 c-flex-wrap c-py-2 c-border-b">
      {local.status !== "ready" ? (
        <Skeleton className="c-h-4 c-w-[80%]" />
      ) : (
        <>
          {local.list === null ? (
            <>
              <h1 className="c-font-semibold c-text-xs md:c-text-base">
                Dummy
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
                      className="c-font-normal c-text-xs md:c-text-base hover:c-cursor-pointer"
                      onClick={() => {
                        navigate(item?.url);
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
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
