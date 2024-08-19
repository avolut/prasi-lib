import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { OnRowClick } from "./utils/type";
import { Sticker } from "lucide-react";

export const TLSlider: FC<{
  local: Record<string, any> & {
    el: null | HTMLDivElement;
    render: () => void;
  };
  data: any[];
  PassProp: any;
  row_click: OnRowClick;
  mode_child: any;
  item_w: string;
  dataGridStyle: (local: { el: null | HTMLDivElement }) => string;
}> = ({
  local,
  data,
  dataGridStyle,
  item_w,
  mode_child,
  PassProp,
  row_click,
}) => {
  return (
    <>
      {local.status !== "ready" ? (
        <div className="c-flex c-flex-col c-space-y-2 c-m-4 c-absolute c-left-0 c-top-0">
          <Skeleton className={cx("c-w-[200px] c-h-[11px]")} />
          <Skeleton className={cx("c-w-[170px] c-h-[11px]")} />
          <Skeleton className={cx("c-w-[180px] c-h-[11px]")} />
        </div>
      ) : (
        <>
          {Array.isArray(data) && data.length > 0 ? (
            <div
              className={cx(
                "c-overflow-x-auto c-snap-x c-h-full c-w-full c-flex",
                css`
                  padding-right: 50px;
                `
              )}
              ref={(e) => {
                local.grid_ref = e;
              }}
              onScroll={(e) => local.paging.scroll(e.currentTarget)}
            >
              {data.map((e, idx) => {
                return (
                  <div
                    className={cx(
                      "list-item c-snap-start c-flex c-shrink-0",
                      css`
                        width: ${item_w}px;
                      `
                    )}
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
                    <PassProp
                      idx={idx}
                      item_w={item_w}
                      is_last={idx == data.length - 1}
                      row={e}
                      col={{}}
                      rows={local.data}
                    >
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
      )}
    </>
  );
};
