import { useLocal } from "@/utils/use-local";
import { cx } from "class-variance-authority";
import { FC, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const Detail: FC<{
  detail: (item: any) => Record<string, [string, string, string]>;
  on_load: (arg: { params: any }) => Promise<any>;
  mode: "standard" | "compact" | "inline";
}> = ({ detail, mode, on_load }) => {
  const local = useLocal({
    status: "init" as "init" | "loading" | "ready",
    detail: null as any,
  });

  if (!isEditor) {
    useEffect(() => {
      if (local.status === "init" && typeof on_load === "function") {
        local.status = "loading";
        local.detail = detail({});
        local.render();
        const res = on_load({ params: {} });
        if (typeof res === "object" && res instanceof Promise) {
          res.then((item) => {
            local.detail = detail(item);
            local.status = "ready";
            local.render();
          });
        } else {
          local.detail = detail(res);
          local.status = "ready";
          local.render();
        }
      }
    }, [on_load]);
  }
  let values = {};

  if (!isEditor && typeof on_load === "function") {
    values = local.detail || {};
  } else {
    values = detail(null);
    local.status = "ready";
  }

  const entries = Object.entries(values);
  return (
    <div
      className={cx(
        "c-flex c-relative items-stretch",
        mode === "inline"
          ? "c-flex-row c-my-2"
          : "c-flex-col  c-flex-1  c-w-full c-h-full "
      )}
    >
      {entries.map(([name, data], idx) => {
        const is_first = idx === 0;
        const is_last = idx === entries.length - 1;
        if (
          typeof data !== "object" ||
          !data ||
          (typeof data === "object" && !Array.isArray(data))
        )
          return null;
        const [label, sample, link] = data;

        if (link) {
          preload(link);
        }

        if (mode === "standard") {
          return (
            <div key={idx} className="c-flex c-flex-col c-items-stretch mb-2">
              <div className="c-flex c-font-bold">{label}</div>
              <div className="c-flex">
                <Linkable sample={sample} link={link} status={local.status} />
              </div>
            </div>
          );
        } else if (mode === "compact") {
          return (
            <div
              key={idx}
              className="c-flex c-flex-row c-items-center mb-1 border-b"
            >
              <div className="c-flex c-font-bold c-min-w-[30%] c-overflow-hidden c-text-sm">
                {label}
              </div>
              <div className={cx("c-flex c-flex-1 c-ml-2 items-center")}>
                <Linkable sample={sample} link={link} status={local.status} />
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={idx}
              className={cx(
                "c-flex c-flex-col c-items-stretch mr-1",
                !is_last && `border-r pr-2`,
                !is_first && `ml-1`
              )}
            >
              <div className={"c-flex c-font-bold"}>{label}</div>
              <div className="c-flex">
                <Linkable sample={sample} link={link} status={local.status} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const Linkable: FC<{
  sample?: string;
  link?: string;
  status: "init" | "loading" | "ready";
}> = ({ sample, link, status }) => {
  const loading = (
    <Skeleton
      className={cx(
        css`
          flex: 1;
          height: 8px;
        `
      )}
    />
  );

  if (!link) {
    if (status !== "ready") return loading;
    return sample || "-";
  }

  return (
    <div
      className="c-flex-1 c-px-2 c-my-1 c-rounded-md c-border c-flex c-items-center cursor-pointer"
      onClick={() => {
        if (!isEditor) {
          navigate(link);
        }
      }}
    >
      {status === "ready" ? (
        <>
          <div
            className={cx(
              "c-flex-1",
              css`
                line-height: 1.1;
                padding: 5px 0px;
              `
            )}
          >
            {sample || '-'}
          </div>
        </>
      ) : (
        <div
          className={cx(
            css`
              flex: 1;
              padding: 5px;
              min-width: 30px;
              min-height: 19px;
            `
          )}
        >
          {loading}
        </div>
      )}
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="c-ml-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>
  );
};
