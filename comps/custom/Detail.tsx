import { useLocal } from "@/utils/use-local";
import { cx } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { FC, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const Detail: FC<{
  detail: (item: any) => Record<string, [string, string, string]>;
  on_load: (arg: {
    params: any;
    bind: (fn: (on_load: any) => void) => void;
  }) => Promise<any>;
  mode: "standard" | "compact" | "inline";
}> = ({ detail, mode, on_load }) => {
  const local = useLocal({
    status: "init" as "init" | "loading" | "ready",
    detail: null as any,
    pathname: "",
    mode: mode,
    on_load,
    bound: false,
  });

  if (!isEditor) {
    if (
      location.pathname !== local.pathname ||
      mode !== local.mode ||
      local.on_load !== on_load
    ) {
      local.status = "init";
      local.on_load = on_load;
      local.mode = mode;
    }

    useEffect(() => {
      if (local.status === "init" && typeof on_load === "function") {
        local.status = "loading";
        if (location.pathname === "") {
          local.detail = detail({});
        } else {
          local.detail = detail({});
          local.pathname = location.pathname;
        }
        local.render();

        const res = on_load({
          params: {},
          bind: (fn) => {
            if (!local.bound) {
              local.bound = true;
              local.render();

              fn(async () => {
                local.status = "loading";
                local.render();
                const item = await on_load({} as any);
                local.detail = detail(item);
                local.status = "ready";
                local.render();
              });
            }
          },
        });
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
    }, [local.status]);
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
        const [label, sample, link] = data;

        if (link) {
          preload(link);
        }

        if (mode === "standard") {
          return (
            <div key={idx} className="c-flex c-flex-col c-items-stretch c-pt-3">
              <div className="c-flex c-font-bold">{label}</div>
              <div className="c-flex">
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
                "c-flex c-flex-row c-items-center",
                !is_first && "border-t",
                css`
                  min-height: 30px;
                `,
                isMobile && "c-justify-between"
              )}
            >
              <div className="c-flex c-font-bold c-min-w-[30%] c-overflow-hidden c-text-sm">
                {label}
              </div>
              <div
                className={cx("c-flex c-flex-1 c-ml-2 c-flex-col c-items-end ")}
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
                "c-flex c-flex-col c-items-stretch",
                !is_last && `c-border-r c-pr-2 c-mr-2`,
                !is_first && `c-ml-1`
              )}
            >
              <div className={"c-flex c-font-bold"}>{label}</div>
              <div className="c-flex">
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
  link?: string;
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
    if (status !== "ready") return loading;
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
        if (link.startsWith("http://") || link.startsWith("https://")) {
          window.open(link, "_blank");
        }
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
