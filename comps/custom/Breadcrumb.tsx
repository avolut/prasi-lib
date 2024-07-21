import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { FieldLoading } from "../ui/field-loading";

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

export const Breadcrumb: FC<BreadcrumbProps> = ({ value, className }) => {
  const local = useLocal({ value: value, loading: false, loaded: false });

  useEffect(() => {
    if (local.loaded) {
      local.loaded = false;
      local.render();
    }
  }, [location.pathname, location.hash]);

  if (value instanceof Promise) {
    if (!local.loaded) {
      local.loading = true;
      value.then((v) => {
        local.value = v;
        local.loading = false;
        local.loaded = true;
        local.render();
      });
    }
  } else {
    local.value = value;
  }

  return (
    <div
      className={cx(
        "breadcrumb c-w-full c-flex c-items-center c-flex-wrap",
        className
      )}
    >
      {local.loading ? (
        <FieldLoading />
      ) : (
        <>
          {(!local.value || local.value.length === 0) &&
            isEditor &&
            "Breadcrumb"}
          {(Array.isArray(local.value) ? local.value : []).map(
            (cur, index): ReactNode => {
              const lastIndex = (local.value || []).length - 1;

              return (
                <>
                  {index === lastIndex ? (
                    <h1 className="c-font-semibold c-text-xs md:c-text-base">
                      {cur?.label}
                    </h1>
                  ) : (
                    <h1
                      className="c-font-normal c-text-xs md:c-text-base hover:c-cursor-pointer hover:c-underline"
                      onClick={(ev) => {
                        if (isEditor) return;
                        if (cur.url) navigate(cur.url || "");
                        if (cur.onClick) cur.onClick(ev);
                      }}
                    >
                      {cur?.label}
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
            }
          )}
        </>
      )}
    </div>
  );
};
