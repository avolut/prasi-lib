import { useLocal } from "@/utils/use-local";
import { FC, useEffect, useRef } from "react";
import DataGrid, {
  ColumnOrColumnGroup,
  DataGridHandle,
  Row,
  SortColumn,
} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Skeleton } from "../ui/skeleton";

type OnRowClick = {
  row: any;
  rows: any[];
  idx: any;
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
};

type RowSelected = {
  row: any;
  rows: any[];
  idx: any;
};
export const Table: FC<{
  columns: () => Promise<ColumnOrColumnGroup<any>[]>;
  on_load: (opt: { reload: () => Promise<void> }) => Promise<any[]>;
  child: any;
  PassProp: any;
  row_click: (arg: OnRowClick) => void;
  selected: (arg: RowSelected) => boolean;
}> = ({ columns, on_load, child, PassProp, row_click, selected }) => {
  const local = useLocal({
    loading: false,
    data: undefined as unknown as any[],
    columns: [] as ColumnOrColumnGroup<any>[],
  });

  useEffect(() => {
    local.loading = true;
    columns().then((col) => {
      local.columns = col.map((e) => ({
        ...e,
        resizable: true,
        renderCell(props) {
          return (
            <PassProp
              idx={props.rowIdx}
              row={props.row}
              cell={{
                key: props.column.key,
                value: props.row[props.column.key],
              }}
              rows={local.data}
            >
              {child}
            </PassProp>
          );
        },
      }));
      if (!!local.data) {
        local.loading = false;
      }
      local.render();
    });
  }, [columns]);

  useEffect(() => {
    local.loading = true;
    const arg = {
      reload: async () => {
        local.loading = true;
        local.render();

        const data = await on_load(arg);

        local.data = data;
        local.loading = false;
        local.render();
      },
    };
    on_load(arg).then((data) => {
      local.data = data;
      local.loading = false;
      local.render();
    });
  }, [on_load]);

  return (
    <TableInternal
      selected={selected}
      row_click={row_click}
      columns={local.columns}
      data={local.loading ? undefined : local.data}
      render={local.render}
    />
  );
};

const TableInternal: FC<{
  columns: ColumnOrColumnGroup<any>[];
  data?: any[];
  render: () => void;
  row_click: (arg: OnRowClick) => void;
  selected: (arg: RowSelected) => boolean;
}> = ({ columns, data, render, row_click, selected }) => {
  const local = useLocal({
    width: 0,
    height: 0,
    rob: new ResizeObserver(([e]) => {
      local.height = e.contentRect.height;
      local.width = e.contentRect.width;
      local.render();
    }),
    el: null as any,
    sort: [] as SortColumn[],
    scrolled: false,
  });
  const rdg = useRef<null | DataGridHandle>(null);

  useEffect(() => {
    return () => {
      local.rob.disconnect();
    };
  }, []);
  const sort = local.sort;

  // let sorted = data;
  // if (sort.length > 0 && data) {
  //   sorted = data.sort((a, b) => {
  //     const va = a[sort[0].columnKey];
  //     const vb = b[sort[0].columnKey];
  //     if (typeof va === "string" && typeof vb === "string") {
  //       if (sort[0].direction === "ASC") {
  //         return va.localeCompare(vb);
  //       } else {
  //         return vb.localeCompare(va);
  //       }
  //     }
  //     return 0;
  //   });
  // }

  let selected_idx = -1;
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (
        typeof selected === "function"
          ? selected({
              idx: i,
              row: row,
              rows: data,
            })
          : false
      ) {
        selected_idx = i;
        break;
      }
    }
  }

  useEffect(() => {
    rdg.current!.scrollToCell({ rowIdx: selected_idx, idx: 0 });
  }, [selected_idx]);

  return (
    <div
      className={cx(
        "c-w-full c-h-full",
        css`
          div[role="row"]:hover {
            background: #e2f1ff;
            .num-edit {
              display: flex;
            }
            .num-idx {
              display: none;
            }
          }
          div[role="columnheader"] span svg {
            margin: 12px 2px;
          }
          div[aria-selected="true"] {
            outline: none;
          }

          .row-selected {
            background: #e2f1ff;
          }
        `
      )}
      ref={(el) => {
        if (!local.el && el) {
          local.el = el;
          local.rob.observe(el);
        }
      }}
    >
      <DataGrid
        columns={columns}
        sortColumns={sort}
        ref={rdg}
        onSortColumnsChange={([col]) => {
          local.sort = [];
          if (col) {
            if (sort.length > 0) {
              const first = sort[0];

              if (first && first.columnKey === col.columnKey) {
                local.sort.push({
                  columnKey: col.columnKey,
                  direction: first.direction === "ASC" ? "DESC" : "ASC",
                });
                render();
                return;
              }
            }
            local.sort.push(col);
          }
          render();
        }}
        className="fill-grid rdg-light"
        renderers={
          typeof data === "undefined"
            ? undefined
            : {
                renderRow(key, props) {
                  const is_selected = selected_idx === props.rowIdx;

                  return (
                    <Row
                      key={key}
                      {...props}
                      onClick={(ev) => {
                        if (typeof row_click === "function") {
                          row_click({
                            event: ev,
                            idx: props.rowIdx,
                            row: props.row,
                            rows: data,
                          });
                        }
                      }}
                      isRowSelected={is_selected}
                      className={cx(
                        props.className,
                        is_selected && "row-selected"
                      )}
                    />
                  );
                },
                noRowsFallback: (
                  <div className="c-flex-1 c-w-full absolute inset-0 c-flex c-flex-col c-items-center c-justify-center">
                    <div className="c-max-w-[15%] c-flex c-flex-col c-items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 140"
                      >
                        <path d="M52.77 74.89a2 2 0 002.83 0l8.4-8.4 8.4 8.4a2 2 0 002.83-2.83l-8.4-8.4 8.4-8.4a2 2 0 00-2.83-2.83l-8.4 8.4-8.4-8.4a2 2 0 00-2.83 2.83l8.4 8.4-8.4 8.4a2 2 0 000 2.83z"></path>
                        <path d="M127.11 36.34l-24-16A2 2 0 00102 20H2a2 2 0 00-1.49.68A2 2 0 000 22v68a2 2 0 00.89 1.66l24 16A2.29 2.29 0 0026 108h100a2 2 0 002-2V38a2 2 0 00-.89-1.66zM104 25.74L119.39 36H104zm-80 76.52L8.61 92H24zM24 88H4V25.74l20 13.33zM8.61 24H100v12H26.61zM100 40v48H28V40zm-72 64V92h73.39l18 12zm96-1.74l-20-13.33V40h20z"></path>
                      </svg>
                      <div className="c-text-lg">No Data</div>
                    </div>
                  </div>
                ),
              }
        }
        style={{
          height: typeof data === "undefined" ? 50 : local.height,
          width: local.width,
        }}
        rows={data || []}
      />
      {typeof data === "undefined" && (
        <div className="c-flex c-flex-col c-space-y-1 c-m-4">
          <Skeleton className={cx("c-w-[200px] c-h-[15px]")} />
          <Skeleton className={cx("c-w-[150px] c-h-[15px]")} />
        </div>
      )}
    </div>
  );
};
