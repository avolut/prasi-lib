import { GFCol, parseGenField } from "@/gen/utils";
import { cn } from "@/utils";
import { fields_map } from "@/utils/format-value";
import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { Loader2 } from "lucide-react";
import { ChangeEvent, FC, MouseEvent, useEffect } from "react";
import DataGrid, {
  ColumnOrColumnGroup,
  Row,
  SELECT_COLUMN_KEY,
  SortColumn,
} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { createPortal } from "react-dom";
import { Toaster, toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { sortTree } from "./utils/sort-tree";
import { filterWhere } from "../filter/utils/filter-where";

type OnRowClick = (arg: {
  row: any;
  rows: any[];
  idx: any;
  event: React.MouseEvent<HTMLDivElement>;
}) => void;
type SelectedRow = (arg: { row: any; rows: any[]; idx: any }) => boolean;
type TableListProp = {
  child: any;
  PassProp: any;
  name: string;
  on_load: (arg: {
    reload: () => Promise<void>;
    orderBy?: Record<string, "asc" | "desc" | Record<string, "asc" | "desc">>;
    paging: { take: number; skip: number };
    mode: "count" | "query";
  }) => Promise<any[]>;
  on_init: (arg?: any) => any;
  mode: "table" | "list" | "grid" | "auto";
  // _meta: Record<string, any>;
  _item: PrasiItem;
  gen_fields: string[];
  row_click: OnRowClick;
  selected: SelectedRow;
  id_parent?: string;
  feature?: Array<any>;
  filter_name: string;
};
const w = window as any;
const selectCellClassname = css`
  display: flex;
  align-items: center;
  justify-content: center;

  > input {
    margin: 0;
  }
`;
export const TableList: FC<TableListProp> = ({
  name,
  on_load,
  child,
  PassProp,
  mode,
  on_init,
  _item,
  gen_fields,
  row_click,
  selected,
  id_parent,
  feature,
  filter_name,
}) => {
  const where = get(w, `prasi_filter.${filter_name}`) ?? "hello";
  const whereQuery = filterWhere("hello");
  if (mode === "auto") {
    if (w.isMobile) {
      mode = "list";
    } else {
      mode = "table";
    }
  }
  const local = useLocal({
    selectedRows: [] as {
      pk: string | number;
      rows: any;
    }[],
    el: null as null | HTMLDivElement,
    width: 0,
    height: 0,
    selectedRowIds: [] as (string | number)[],
    rob: new ResizeObserver(([e]) => {
      local.height = e.contentRect.height;
      local.width = e.contentRect.width;
      if (local.status === "ready") local.status = "resizing";
      local.render();
    }),
    pk: null as null | GFCol,
    scrolled: false,
    data: [] as any[],
    status: "init" as "loading" | "ready" | "resizing" | "reload" | "init",
    where: null as any,
    paging: {
      take: 0,
      skip: 0,
      timeout: null as any,
      total: 0,
      scroll: (event: React.UIEvent<HTMLDivElement>) => {
        if (local.status === "loading" || !isAtBottom(event)) return;
        if (local.data.length >= local.paging.skip + local.paging.take) {
          local.paging.skip += local.paging.take;
          local.status = "reload";
          local.render();
        }
      },
    },
    sort: {
      columns: [] as SortColumn[],
      on_change: (cols: SortColumn[]) => {
        local.sort.columns = cols;
        local.paging.skip = 0;

        if (cols.length > 0) {
          const { columnKey, direction } = cols[0];

          let should_set = true;
          const gf = JSON.stringify(gen_fields);
          const fields = fields_map.get(gf);

          if (fields) {
            const rel = fields?.find((e) => e.name === columnKey);
            if (rel && rel.checked) {
              should_set = false;

              if (rel.type === "has-many") {
                local.sort.orderBy = {
                  [columnKey]: {
                    _count: direction === "ASC" ? "asc" : "desc",
                  },
                };
              } else {
                const field = rel.checked.find((e) => !e.is_pk);
                if (field) {
                  local.sort.orderBy = {
                    [columnKey]: {
                      [field.name]: direction === "ASC" ? "asc" : "desc",
                    },
                  };
                }
              }
            }
          }

          if (should_set) {
            local.sort.orderBy = {
              [columnKey]: direction === "ASC" ? "asc" : "desc",
            };
          }
        } else {
          local.sort.orderBy = null;
        }
        local.status = "reload";
        local.render();
      },
      orderBy: null as null | Record<
        string,
        "asc" | "desc" | Record<string, "asc" | "desc">
      >,
    },
  });
  // code ini digunakan untuk mengambil nama dari pk yang akan digunakan sebagai key untuk id
  const pk = local.pk?.name || "id";
  useEffect(() => {
    if (isEditor) return;
    (async () => {
      on_init(local);
      if (local.status === "reload" && typeof on_load === "function") {
        local.status = "loading";
        local.render();

        const orderBy = local.sort.orderBy || undefined;
        const load_args: any = {
          async reload() { },
          where,
          orderBy,
          paging: { take: local.paging.take, skip: local.paging.skip },
        };
        if (id_parent) {
          load_args.paging = {};
        }
        const result = on_load({ ...load_args, mode: "query" });
        const callback = (data: any[]) => {
          if (local.paging.skip === 0) {
            local.data = data;
          } else {
            local.data = [...local.data, ...data];
          }
          local.status = "ready";
          local.render();
        };
        if (result instanceof Promise) result.then(callback);
        else callback(result);
      }
    })();
  }, [local.status, on_load, local.sort.orderBy]);

  const raw_childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );
  let childs: any[] = [];

  let checkedBox: any[] = [];

  let sub_name = "fields";
  // if (mode === "table") sub_name = "columns";

  switch (mode) {
    case "table":
      sub_name = "tbl-col";
      break;
    case "list":
      sub_name = "md-list";
      break;
  }

  // passing local data ke variable baru (biar gak panjang nulisnya hehe)
  let rowData = local.data;

  // function untuk menghandle checkbox di header (digunakan untuk check all)
  const headerCheckboxClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // jika checbox checked, maka semua rowData akan dimasukkan ke dalam local selected rows
      rowData.forEach((data) => {
        local.selectedRows.push({
          pk: data[pk],
          rows: data,
        });
      });
      local.render();
    } else {
      // jika tidak, maka local selected rows akan dikosongkan
      local.selectedRows = [];
      local.render();
    }
  };

  // function untuk menghandle checkbox pada setiap row (digunakan untuk check setiap rowData)
  const checkboxClick = (rowId: any) => (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const checked = !!local.selectedRows.find((data) => data.pk === rowId);
    if (!checked) {
      // jika checkbox tercheck, maka rowData akan diambil jika memiliki id yang sama dengan rowId yang dikirim
      const checkedRowData = rowData.filter((row) => row[pk] === rowId);
      local.selectedRows.push({
        pk: rowId,
        rows: checkedRowData,
      });
      local.render();
    } else {
      // jika tidak, maka akan dihapus
      local.selectedRows = local.selectedRows.filter(
        (data) => data.pk !== rowId
      );
      local.render();
    }
  };

  const mode_child = raw_childs.find(
    (e: any) => e.name === sub_name || e.name === mode
  );
  if (mode_child) {
    const tbl = _item.edit.childs[0].edit.childs.find(
      (e) => get(e, "id") === mode_child.id
    );
    const meta = tbl;
    if (meta && meta.childs) {
      childs = meta.childs;
    }
  }
  let columns: ColumnOrColumnGroup<any>[] = [];
  let isCheckbox = false;
  try {
    if (feature?.find((e) => e === "checkbox")) isCheckbox = true;
  } catch (e) { }
  if (childs.length && isCheckbox) {
    columns.push({
      key: SELECT_COLUMN_KEY,
      name: "",
      width: 35,
      minWidth: 35,
      maxWidth: 35,
      resizable: false,
      sortable: false,
      frozen: true,
      renderHeaderCell(props) {
        return <input type="checkbox" onChange={headerCheckboxClick} />;
      },
      renderCell(props) {
        // digunakan untuk mengecek apakah local selected rows memiliki pk dari props.row.id
        const isChecked = local.selectedRows.some(
          (checked) => checked.pk === props.row.id
        );
        return (
          <div
            onClick={checkboxClick(props.row.id)}
            className={cx(
              css`
                width: 100%;
                height: 100%;
              `,
              "c-flex c-items-center c-justify-center"
            )}
          >
            <input
              className="c-pointer-events-none"
              type="checkbox"
              checked={isChecked}
            />
          </div>
        );
      },
      headerCellClass: selectCellClassname,
      cellClass: selectCellClassname,
    });
  }
  for (const child of childs) {
    let key = getProp(child, "name", {});
    const name = getProp(child, "title", {});
    const width = parseInt(getProp(child, "width", {}));

    columns.push({
      key,
      name,
      width: width > 0 ? width : undefined,
      resizable: true,
      sortable: true,
      renderCell(props) {
        return (
          <PassProp
            idx={props.rowIdx}
            row={props.row}
            col={{
              name: props.column.key,
              value: props.row[props.column.key],
              depth: props.row.__depth || 0,
            }}
            rows={local.data}
          >
            {child}
          </PassProp>
        );
      },
    });
  }
  if (mode === "list") {
    if (columns.length > 1) columns = columns.slice(0, 0 + 1);
  }

  if (local.status === "resizing" && !isEditor) {
    local.status = "ready";
    local.render();

    return null;
  }

  if (!isEditor) {
    if (local.status === "loading") {
      toast.loading(
        <>
          <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
          Loading {local.paging.skip === 0 ? "Data" : "more rows"} ...
        </>,
        {
          dismissible: true,
          className: css`
            background: #e4f7ff;
          `,
        }
      );
    } else {
      toast.dismiss();
    }
  }

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  if (local.status === "init") {
    const fields = parseGenField(gen_fields);
    for (const field of fields) {
      if (field.is_pk) {
        local.pk = field;
      }
    }
  }

  if (isEditor && local.status !== "ready") {
    if (local.data.length === 0) {
      const load_args: any = {
        async reload() { },
        where,
        paging: { take: local.paging.take, skip: local.paging.skip },
      };

      if (id_parent) load_args.paging = {};
      if (typeof on_load === "function") {
        local.data = on_load({ ...load_args, mode: "query" }) as any;
      }
    }
    local.status = "ready";
  }

  let selected_idx = -1;

  let data = local.data || [];
  if (id_parent && local.pk && local.sort.columns.length === 0) {
    data = sortTree(local.data, id_parent, local.pk.name);
  }
  // return "pagi"
  if (mode === "table") {
    return (
      <div
        className={cx(
          "c-w-full c-h-full c-flex-1 c-relative c-overflow-hidden",
          dataGridStyle(local),
          css`
            .rdg {
              display: grid !important;
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
        {local.status !== "ready" && (
          <div className="c-flex c-flex-col c-space-y-2 c-m-4 c-absolute c-left-0 c-top-0">
            <Skeleton className={cx("c-w-[200px] c-h-[11px]")} />
            <Skeleton className={cx("c-w-[170px] c-h-[11px]")} />
            <Skeleton className={cx("c-w-[180px] c-h-[11px]")} />
          </div>
        )}
        <div className="c-absolute c-inset-0">
          {toaster_el && createPortal(<Toaster cn={cn} />, toaster_el)}
          {local.status === "init" ? (
            <DataGrid
              style={{ opacity: 0 }}
              columns={[
                {
                  key: "_",
                  name: "",
                  renderCell({ rowIdx }) {
                    if (local.paging.take < rowIdx) {
                      local.paging.take = rowIdx;
                    }
                    clearTimeout(local.paging.timeout);
                    local.paging.timeout = setTimeout(() => {
                      local.status = "reload";
                      local.paging.take = local.paging.take * 5;
                      local.render();
                    }, 100);
                    return <></>;
                  },
                },
              ]}
              rows={genRows(200)}
            />
          ) : (
            <>
              <DataGrid
                sortColumns={local.sort.columns}
                onSortColumnsChange={local.sort.on_change}
                columns={columns}
                rows={data}
                onScroll={local.paging.scroll}
                renderers={
                  local.status !== "ready"
                    ? undefined
                    : {
                      renderRow(key, props) {
                        const is_selected = selected_idx === props.rowIdx;
                        const isSelect = selected({
                          idx: props.rowIdx,
                          row: props.row,
                          rows: local.data,
                        });

                        return (
                          <Row
                            key={key}
                            {...props}
                            onClick={(ev) => {
                              if (
                                !isEditor &&
                                typeof row_click === "function"
                              ) {
                                row_click({
                                  event: ev,
                                  idx: props.rowIdx,
                                  row: props.row,
                                  rows: local.data,
                                });
                              }
                            }}
                            isRowSelected={true}
                            className={cx(
                              props.className,
                              isSelect && "row-selected"
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
              />
            </>
          )}
        </div>
      </div>
    );
  } else if (mode === "list") {
    return (
      <div
        className={cx(
          "c-w-full c-h-full c-flex-1 c-relative c-overflow-hidden",
          dataGridStyle(local)
        )}
        ref={(el) => {
          if (!local.el && el) {
            local.el = el;
            local.rob.observe(el);
          }
        }}
      >
        <div className="c-absolute c-inset-0">
          {toaster_el && createPortal(<Toaster cn={cn} />, toaster_el)}
          {local.status === "init" ? (
            <DataGrid
              style={{ opacity: 0 }}
              columns={[
                {
                  key: "_",
                  name: "",
                  renderCell({ rowIdx }) {
                    if (local.paging.take < rowIdx) {
                      local.paging.take = rowIdx;
                    }
                    clearTimeout(local.paging.timeout);
                    local.paging.timeout = setTimeout(() => {
                      local.status = "reload";
                      local.paging.take = local.paging.take * 5;
                      local.render();
                    }, 100);
                    return <></>;
                  },
                },
              ]}
              rows={genRows(200)}
            />
          ) : (
            <>
              <div
                className="w-full h-full overflow-y-auto"
                onScroll={local.paging.scroll}
              >
                {data.map((e, idx) => {
                  return (
                    <div
                      className="flex-grow hover:c-bg-[#e2f1ff]"
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
                        {child}
                      </PassProp>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
  }
};

const genRows = (total: number) => {
  const result = [] as any[];
  for (let i = 0; i < total; i++) {
    result.push({ _: i });
  }
  return result;
};

const dataGridStyle = (local: { height: number }) => css`
  .rdg {
    block-size: ${local.height}px;
  }
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
    /* color: #ffffff */
  }
  div[aria-selected="true"] {
    outline: none;
  }
  div[role="gridcell"] {
    padding-inline: 0px;
  }

  .row-selected {
    background: #e2f1ff;
  }
`;

function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}

function getProp(child: IItem, name: string, defaultValue?: any) {
  const fn = new Function(
    `return ${get(child, `component.props.${name}.valueBuilt`) || `null`}`
  );

  return fn() || defaultValue;
}
