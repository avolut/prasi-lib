import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import get from "lodash.get";
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
  return (
    <div
      className={cx(
        "breadcrumb c-w-full c-flex c-items-center c-flex-wrap",
        className
      )}
    >
      {(value || []).map((cur, index): ReactNode => {
        const lastIndex = (value || []).length - 1;

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
      })}
    </div>
  );
};
