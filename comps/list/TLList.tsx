import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { OnRowClick } from "./utils/type";
import { Sticker } from "lucide-react";

export const TLList: FC<{
  local: Record<string, any> & {
    el: null | HTMLDivElement;
    render: () => void;
  };
  data: any[];
  PassProp: any;
  row_click: OnRowClick;
  mode_child: any;
  dataGridStyle: (local: { el: null | HTMLDivElement }) => string;
}> = ({ local, data, dataGridStyle, mode_child, PassProp, row_click }) => {
  return (
    <div
      className={cx(
        "c-w-full c-h-full c-flex-1 c-relative c-overflow-hidden",
        dataGridStyle(local)
      )}
      ref={(el) => {
        if (!local.el && el) {
          local.el = el;
        }
      }}
    >
      {local.status !== "ready" ? (
        <div className="c-flex c-flex-col c-space-y-2 c-m-4 c-absolute c-left-0 c-top-0">
          <Skeleton className={cx("c-w-[200px] c-h-[11px]")} />
          <Skeleton className={cx("c-w-[170px] c-h-[11px]")} />
          <Skeleton className={cx("c-w-[180px] c-h-[11px]")} />
        </div>
      ) : (
        <div
          className={cx(
            "c-absolute c-inset-0",
            !isEditor &&
              css`
                @keyframes flasher {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0px);
                  }
                }
                .list-row {
                  animation: flasher 0.5s;
                }
              `
          )}
        >
          <>
            {Array.isArray(data) && data.length > 0 ? (
              <div
                className="w-full h-full overflow-y-auto c-flex-col"
                ref={(e) => {
                  local.grid_ref = e;
                }}
                onScroll={(e) => local.paging.scroll(e.currentTarget)}
              >
                {data.map((e, idx) => {
                  return (
                    <div
                      className={cx("list-row c-flex-grow c-flex")}
                      onClick={(ev) => {
                        if (!isEditor && typeof row_click === "function") {
                          row_click({
                            event: ev,
                            idx: idx,
                            row: e,
                            rows: local.data,
                          });
                        }
                      }}
                    >
                      <PassProp idx={idx} row={e} col={{}} rows={local.data}>
                        {mode_child}
                      </PassProp>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="c-flex c-items-center c-justify-center c-flex-1 w-full h-full c-flex-col ">
                <Sticker size={35} strokeWidth={1} />
                <div className="c-pt-1 c-text-center">
                  No&nbsp;Data
                  <br />
                  {local.filtering && (
                    <div
                      className={css`
                        color: gray;
                        font-style: italic;
                        font-size: 90%;
                      `}
                    >
                      {local.filtering}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};
