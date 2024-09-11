import { useLocal } from "lib/utils/use-local";
import { cx } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { formatName } from "lib/gen/utils";

export const Detail: FC<{
  detail: (
    item: any
  ) => Record<string, [string, string, string | (() => void)]>;
  on_load:
    | Record<string, any>
    | ((arg: {
        params: any;
        bind: (fn: (on_load: any) => void) => void;
      }) => Promise<any>);
  mode: "standard" | "compact" | "inline";
}> = ({ detail: _detail, mode, on_load }) => {
  const local = useLocal({
    status: "init" as "init" | "loading" | "ready",
    detail: null as any,
    pathname: "",
    mode: mode,
    on_load,
    bound: false,
    resolved_value: null as any,
  });

  local.on_load = on_load;

  let detail = _detail;
  if (typeof detail !== "function") {
    detail = (load: any) => {
      const result: any = {};
      if (typeof load === "object" && !!load) {
        for (const [k, v] of Object.entries(load)) {
          if (k !== "id")
            if (typeof v !== "object") result[k] = [formatName(k), v];
        }
      }
      return result;
    };
  }

  let values = {};

  if (local.status !== "loading") {
    if (typeof on_load === "function") {
      if (local.resolved_value) {
        values = detail(local.resolved_value);
        local.resolved_value = null;
        local.status = "ready";
      } else {
        const result = on_load({} as any);
        if (result instanceof Promise) {
          local.status = "loading";
          values = detail({});
          result.then((e) => {
            local.resolved_value = e;
            local.status = "ready";
            local.render();
          });
        } else {
          values = detail(result);
          local.status = "ready";
        }
      }
    } else {
      values = detail(on_load);
      local.status = "ready";
    }
  }

  if (typeof values !== "object" || values === null) return null;
  const entries = Object.entries(values);

  return (
    <div
      className={cx(
        "c-flex c-relative items-stretch",
        mode === "inline"
          ? "c-flex-row c-my-2"
          : "c-flex-col  c-flex-1  c-w-full c-h-full ",
        isDesktop &&
          entries.length > 3 &&
          mode === "compact" &&
          css`
            flex-direction: row !important;
            flex-wrap: wrap !important;
            border: 1px solid #ddd;
            border-radius: 10px;
            margin-top: 10px;
            margin-bottom: 10px;

            &::before {
              content: " ";
              position: absolute;
              left: 49%;
              bottom: 0px;
              top: 0px;
              border-right: 1px solid #ddd;
            }

            > div {
              border-top: 0px;
              padding-right: 10px;
              padding-left: 10px;
              width: 49% !important;
            }
          `
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
        let [label, sample, link] = data;

        if (typeof on_load === "object" && on_load[name]) {
          sample = on_load[name];
        }

        if (typeof link === "string") {
          preload(link);
        }

        if (mode === "standard") {
          return (
            <div
              key={idx}
              className="detail-row c-flex c-flex-col c-items-stretch c-pt-3"
            >
              <div className="detail-label c-flex c-font-bold">{label}</div>
              <div className="detail-value c-flex">
                <Linkable
                  sample={sample}
                  mode={mode}
                  link={link}
                  status={local.status}
                />
              </div>
            </div>
          );
        } else if (mode === "compact") {
          return (
            <div
              key={idx}
              className={cx(
                "detail-row c-flex c-flex-row c-items-center",
                !is_first && "border-t",
                css`
                  min-height: 30px;
                `,
                isMobile && "c-justify-between"
              )}
            >
              <div className="detail-label c-flex c-font-bold c-min-w-[30%] c-overflow-hidden c-text-sm">
                {label}
              </div>
              <div
                className={cx(
                  "detail-value c-flex c-flex-1 c-ml-2 c-flex-col c-items-end "
                )}
              >
                <div>
                  <Linkable
                    mode={mode}
                    sample={sample}
                    link={link}
                    status={local.status}
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div
              key={idx}
              className={cx(
                "detail-row c-flex c-flex-col c-items-stretch",
                !is_last && `c-border-r c-pr-2 c-mr-2`,
                !is_first && `c-ml-1`
              )}
            >
              <div className={"detail-label c-flex c-font-bold"}>{label}</div>
              <div className="detail-value c-flex">
                <Linkable
                  mode={mode}
                  sample={sample}
                  link={link}
                  status={local.status}
                />
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
  link?: string | (() => void);
  mode: "standard" | "compact" | "inline";
  status: "init" | "loading" | "ready";
}> = ({ sample, link, status, mode }) => {
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
    if (status !== "ready") return status;
    return sample || "-";
  }

  return (
    <div
      className={cx(
        "c-flex-1 c-my-1 c-px-2 c-rounded-md c-border c-flex c-items-center cursor-pointer",
        css`
          margin-left: -4px;
        `,
        mode !== "standard" && "text-sm"
      )}
      onClick={() => {
        if (typeof link === "function") {
          link();
        } else {
          if (link.startsWith("http://") || link.startsWith("https://")) {
            window.open(link, "_blank");
          }
          if (!isEditor) {
            navigate(link);
          }
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
                padding: 3px 0px;
              `
            )}
          >
            {sample || "-"}
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
      <div
        className={cx(
          "c-flex c-items-center c-justify-center",
          css`
            width: 20px;
            height: 80%;
            padding: 0px;
            margin: 0px;
            margin-left: 10px;
            margin-right: -5px;
            border-left: 1px solid #ececeb;
            padding-left: 3px;
          `
        )}
      >
        <ArrowRight width={12} height={12} />
      </div>
    </div>
  );
};
