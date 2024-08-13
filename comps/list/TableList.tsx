import { GFCol, parseGenField } from "@/gen/utils";
import { cn } from "@/utils";
import { fields_map } from "@/utils/format-value";
import { useLocal } from "@/utils/use-local";
import { set } from "lib/utils/set";
import get from "lodash.get";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Sticker,
} from "lucide-react";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import DataGrid, {
  ColumnOrColumnGroup,
  RenderCellProps,
  Row,
  SELECT_COLUMN_KEY,
  SortColumn,
} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { call_prasi_events } from "../../..";
import { filterWhere } from "../filter/parser/filter-where";
import { getFilter } from "../filter/utils/get-filter";
import { MDLocal } from "../md/utils/typings";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/toast";
import { sortTree } from "./utils/sort-tree";
import { getPathname } from "lib/exports";

type OnRowClick = (arg: {
  row: any;
  rows: any[];
  idx: any;
  event: React.MouseEvent<HTMLDivElement>;
}) => void;
let EMPTY_SET = new Set() as ReadonlySet<any>;

type SelectedRow = (arg: { row: any; rows: any[]; idx: any }) => boolean;
type TableListProp = {
  child: any;
  PassProp: any;
  name: string;
  value?: any[];
  on_load?: (arg: {
    reload: () => Promise<void>;
    orderBy?: Record<string, "asc" | "desc" | Record<string, "asc" | "desc">>;
    paging: { take: number; skip: number };
    mode: "count" | "query";
  }) => Promise<any[]>;
  on_init: (arg?: any) => any;
  mode: "table" | "list" | "grid" | "auto";
  _item: PrasiItem;
  __props?: any;
  gen_fields: string[];
  row_click: OnRowClick;
  selected: SelectedRow;
  show_header?: boolean;
  id_parent?: string;
  feature?: Array<any>;
  filter_name: string;
  render_row?: (child: any, data: any) => ReactNode;
  row_height?: number | ((row: any) => number);
  render_col?: (arg: {
    props: RenderCellProps<any, unknown>;
    tbl: any;
    child: any;
  }) => ReactNode;
  softdel_field?: string;
  gen_table?: string;
  softdel_type?: string;
  cache_row?: boolean;
  md?: MDLocal;
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
  mode: _mode,
  on_init,
  _item,
  gen_fields,
  row_click,
  selected,
  id_parent,
  feature,
  filter_name,
  row_height: rowHeight,
  render_col,
  show_header,
  value,
  cache_row,
  __props,
  md,
}) => {
  let mode = _mode;
  if (mode === "auto") {
    if (w.isMobile) {
      mode = "list";
    } else {
      mode = "table";
    }
  }

  let ls_sort = localStorage.getItem(
    `sort-${location.pathname}-${location.hash}-${name}`
  ) as unknown as { columns: any; orderBy: any };
  if (ls_sort) {
    ls_sort = JSON.parse(ls_sort as any);
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
    status: "init" as
      | "loading"
      | "ready"
      | "resizing"
      | "reload"
      | "init"
      | "error",
    where: null as any,
    firstKey: "",
    should_toast: true,
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
    collapsed: new Set<number>(),
    cached_row: new WeakMap<any, ReactElement>(),
    filtering: "" as ReactNode | string | true,
    reload: (arg?: { toast: boolean }) => {
      return new Promise<void>((done) => {
        let should_toast = true;
        if (arg?.toast === false) should_toast = false;
        local.should_toast = should_toast;

        local.filtering = "";
        if (typeof on_load === "function") {
          local.status = "loading";
          local.render();

          const orderBy = local.sort.orderBy || undefined;
          const where = filterWhere(filter_name, __props);

          if (where?.OR?.length > 0) {
            const key = Object.keys(where.OR[0])[0];
            if (key && where.OR[0][key]) {
              let filtering = where.OR[0][key].contains;
              if (typeof local.filtering === "string") {
                filtering = filtering.slice(1, -1);
              } else {
                filtering = "";
              }

              if (filtering) {
                local.filtering = (
                  <div className="c-pt-2">
                    Searching for: <pre>"{filtering.trim()}"</pre>
                  </div>
                );
              }
            }
          }

          if (md) {
            const last = md.params.links[md.params.links.length - 1];

            if (last && last.where) {
              if ((last.name && last.name === md.name) || !last.name) {
                for (const [k, v] of Object.entries(last.where)) {
                  where[k] = v;
                }
              }
            }
          }

          call_prasi_events("tablelist", "where", [__props?.gen__table, where]);

          const load_args: any = {
            async reload() {},
            orderBy,
            where,
            paging: {
              take: local.paging.take > 0 ? local.paging.take : undefined,
              skip: local.paging.skip,
            },
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
            done();
          };

          if (result instanceof Promise) {
            (async () => {
              try {
                callback(await result);
              } catch (e) {
                console.error(e);
                local.status = "error";
                toast.dismiss();
                toast.error(
                  <div className="c-flex c-text-red-600 c-items-center">
                    <AlertTriangle className="c-h-4 c-w-4 c-mr-1" />
                    Failed to load data
                  </div>,
                  {
                    dismissible: true,
                    className: css`
                      background: #ffecec;
                      border: 2px solid red;
                    `,
                  }
                );
              }
            })();
          } else callback(result);
        }
      });
    },
    sort: {
      columns: (ls_sort?.columns || []) as SortColumn[],
      on_change: (cols: SortColumn[]) => {
        if (feature?.find((e) => e === "sorting")) {
          local.sort.columns = cols;
          local.paging.skip = 0;
          if (cols.length > 0) {
            let { columnKey, direction } = cols[0];

            if (columnKey.includes(".")) {
              let root: any = {};
              set(root, columnKey, direction === "ASC" ? "asc" : "desc");
              local.sort.orderBy = root;
            } else {
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
                    } else if (rel.relation) {
                      local.sort.orderBy = {
                        [columnKey]: {
                          [rel.relation.to.fields[0]]:
                            direction === "ASC" ? "asc" : "desc",
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
            }
          } else {
            local.sort.orderBy = null;
          }
          localStorage.setItem(
            `sort-${location.pathname}-${location.hash}-${name}`,
            JSON.stringify({
              columns: local.sort.columns,
              orderBy: local.sort.orderBy,
            })
          );

          local.status = "reload";
          local.render();
        }
      },
      orderBy: (ls_sort?.orderBy || null) as null | Record<
        string,
        "asc" | "desc" | Record<string, "asc" | "desc">
      >,
    },
    soft_delete: {
      field: null as any,
    },
  });

  const reload = local.reload;
  if (md) {
    md.master.reload = reload;
  }

  if (filter_name) {
    const f = getFilter(filter_name);
    if (f) {
      f.list.ref[_item.id] = { reload };
    }
  }

  // code ini digunakan untuk mengambil nama dari pk yang akan digunakan sebagai key untuk id
  const pk = local.pk?.name || "id";

  useEffect(() => {
    if (isEditor || value) {
      on_init(local);
      return;
    }
    (async () => {
      on_init(local);
      if (
        (local.status === "init" || local.status === "reload") &&
        typeof on_load === "function"
      ) {
        reload();
      }
    })();
  }, [local.status, on_load, local.sort.orderBy]);

  const raw_childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );
  let childs: any[] = [];

  let sub_name: string[] = [];

  switch (mode) {
    case "table":
      sub_name = ["tbl-col", "table: columns"];
      break;
    case "list":
      sub_name = ["list-row", "list: fields"];
      break;
  }

  // passing local data ke variable baru (biar gak panjang nulisnya hehe)
  let rowData = local.data;

  // function untuk menghandle checkbox di header (digunakan untuk check all)
  const headerCheckboxClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && Array.isArray(rowData)) {
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
    (e: any) => sub_name.includes(e.name) || e.name === mode
  );
  if (mode_child) {
    const tbl = _item.edit.childs[0].edit.childs.find(
      (e: any) => get(e, "id") === mode_child.id
    );
    const meta = tbl;
    if (meta && meta.childs) {
      childs = meta.childs;
    }
  }
  let columns: ColumnOrColumnGroup<any>[] = [];
  let isCheckbox = false;
  let isTree = false;
  try {
    if (feature?.find((e) => e === "checkbox")) isCheckbox = true;
    if (feature?.find((e) => e === "tree")) isTree = true;
  } catch (e) {}

  if (local.status === "init") {
    const fields = parseGenField(gen_fields);
    for (const field of fields) {
      if (field.is_pk) {
        local.pk = field;
      }
    }
  }

  if (typeof value !== "undefined") {
    local.data = value;
    local.status = "ready" as any;
  } else {
    if (isEditor && local.status !== "ready") {
      if (local.data.length === 0) {
        const load_args: any = {
          async reload() {},
          where: {},
          paging: {
            take: local.paging.take > 0 ? local.paging.take : undefined,
            skip: local.paging.skip,
          },
        };
        if (id_parent) load_args.paging = {};
        if (typeof on_load === "function") {
          let res = on_load({ ...load_args, mode: "query" }) as any;
          if (typeof res === "object" && res instanceof Promise) {
            res.then((e) => {
              local.data = e;
            });
          } else {
            local.data = res;
          }
        }
      }
      local.status = "ready";
    }
  }
  let data = Array.isArray(local.data) ? local.data : [];
  if (typeof local.data === "string") console.error(local.data);

  if (isEditor) {
    if (data.length > 0) {
      w.prasi_table_list_temp_data = data;
    } else if (
      w.prasi_table_list_temp_data &&
      w.prasi_table_list_temp_data.length > 0
    ) {
      data = w.prasi_table_list_temp_data;
    }
  }

  if (isTree && id_parent && local.pk && local.sort.columns.length === 0) {
    data = sortTree(local.data, id_parent, local.pk.name).filter((e) => {
      if (local.pk && local.collapsed.has(e?.__parent?.[local.pk.name])) {
        return false;
      }
      return true;
    });
  }

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

  let first = true;
  for (const child of childs) {
    let key = getProp(child, "name", {});
    const name = getProp(child, "title", "");
    const type = getProp(child, "type", "");
    const width = parseInt(getProp(child, "width", {}));
    if (type === "checkbox") {
      columns.push({
        key,
        name,
        width: 35,
        minWidth: 45,
        resizable: true,
        sortable: true,
        frozen: true,
        renderHeaderCell(props) {
          return (
            <div>
              {/* <CheckboxList value={false} on_click={on_click} /> */}
            </div>
          );
        },
        renderCell(props) {
          if (typeof render_col === "function")
            return render_col({
              props,
              tbl: local,
              child,
            });

          return (
            <PassProp
              idx={props.rowIdx}
              row={props.row}
              col={{
                name: props.column.key,
                value: get(props.row, props.column.key),
                depth: props.row.__depth || 0,
              }}
              rows={local.data}
            >
              {child}
            </PassProp>
          );
        },
      });
    } else {
      columns.push({
        key,
        name,
        width: width > 0 ? width : undefined,
        resizable: true,
        sortable: true,
        renderCell(props) {
          if (typeof render_col === "function")
            return render_col({
              props,
              tbl: local,
              child,
            });

          return (
            <>
              {isTree && local.firstKey === key && local.pk && (
                <div
                  className={cx(
                    css`
                      padding-left: ${3 + props.row.__depth * 8}px;
                    `,
                    "c-flex c-items-center c-cursor-pointer"
                  )}
                  onClick={(e) => {
                    console.log(props.row);
                    if (!local.pk) return;
                    if (props?.row?.__children?.length > 0) {
                      e.stopPropagation();
                      if (!local.collapsed.has(props.row?.[local.pk.name])) {
                        local.collapsed.add(props.row?.[local.pk.name]);
                      } else {
                        local.collapsed.delete(props.row?.[local.pk.name]);
                      }
                      local.render();
                    }
                  }}
                >
                  <div
                    className={cx(
                      css`
                        width: 16px;
                      `
                    )}
                  >
                    {props.row?.__children?.length > 0 && (
                      <>
                        {local.collapsed.has(props.row?.[local.pk.name]) ? (
                          <ChevronRight size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </>
                    )}
                  </div>
                  {props.row?.__parent &&
                    (props.row?.__children || []).length === 0 && (
                      <div
                        className={cx(
                          " c-border-l c-border-b c-border-black c-w-[10px] c-h-[15px]",
                          css`
                            margin-top: -10px;
                          `
                        )}
                      ></div>
                    )}
                </div>
              )}
              <PassProp
                idx={props.rowIdx}
                row={props.row}
                col={{
                  name: props.column.key,
                  value: get(props.row, props.column.key),
                  depth: props.row.__depth || 0,
                }}
                rows={local.data}
              >
                {child}
              </PassProp>
            </>
          );
        },
      });

      if (first) {
        first = false;
        local.firstKey = key;
      }
    }
  }
  if (mode === "list") {
    if (columns.length > 1) columns = columns.slice(0, 0 + 1);
  }

  if (!isEditor) {
    let should_toast = true;
    if (md && md.props.mode !== "full") {
      should_toast = false;
    }
    if (should_toast) {
      if (local.status === "loading") {
        toast.dismiss();
        toast.loading(
          <>
            <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
            Loading Data ...
          </>
        );
      } else {
        toast.dismiss();
      }
    }
  }

  if (local.status === "resizing" && !isEditor) {
    local.status = "ready";
    local.render();
    return null;
  }

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  if (mode === "table") {
    return (
      <div
        className={cx(
          "table-list c-w-full c-h-full c-flex-1 c-relative c-overflow-hidden",
          dataGridStyle(local),
          css`
            .rdg {
              display: grid !important;

              .rdg-cell,
              .rdg-header-sort-name {
                display: flex;
                flex-direction: row;
                align-items: stretch;

                &.rdg-header-sort-name {
                  align-items: center;
                }
              }
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
        <div className="table-list-inner c-absolute c-inset-0">
          {toaster_el && createPortal(<Toaster cn={cn} />, toaster_el)}
          {local.status === "init" ? (
            <DataGrid
              style={{ opacity: 0 }}
              className="rdg-light"
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
                rowHeight={rowHeight || 35}
                sortColumns={local.sort.columns}
                onSortColumnsChange={local.sort.on_change}
                columns={columns}
                rows={data}
                className="rdg-light"
                onScroll={local.paging.scroll}
                selectedRows={EMPTY_SET}
                onSelectedCellChange={() => {}}
                onSelectedRowsChange={() => {}}
                headerRowHeight={show_header === false ? 0 : undefined}
                renderers={
                  local.status !== "ready"
                    ? undefined
                    : {
                        renderRow(key, props) {
                          if (
                            cache_row === true &&
                            local.cached_row.has(props.row)
                          ) {
                            return local.cached_row.get(props.row);
                          }
                          const isSelect = selected({
                            idx: props.rowIdx,
                            row: props.row,
                            rows: local.data,
                          });
                          const child_row = (
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
                                (isSelect ||
                                  md?.selected?.[local.pk?.name || ""] ===
                                    props.row[local.pk?.name || ""]) &&
                                  "row-selected"
                              )}
                            />
                          );
                          if (cache_row) {
                            local.cached_row.set(props.row, child_row);
                          }
                          return child_row;
                        },
                        noRowsFallback: (
                          <div className="c-flex-1 c-w-full absolute inset-0 c-flex c-flex-col c-items-center c-justify-center">
                            <div className="c-max-w-[15%] c-flex c-flex-col c-items-center">
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
        {toaster_el && createPortal(<Toaster cn={cn} />, toaster_el)}

        {local.status !== "ready" ? (
          <div className="c-flex c-flex-col c-space-y-2 c-m-4 c-absolute c-left-0 c-top-0">
            <Skeleton className={cx("c-w-[200px] c-h-[11px]")} />
            <Skeleton className={cx("c-w-[170px] c-h-[11px]")} />
            <Skeleton className={cx("c-w-[180px] c-h-[11px]")} />
          </div>
        ) : (
          <div className="c-absolute c-inset-0">
            <>
              {Array.isArray(data) && data.length > 0 ? (
                <div
                  className="w-full h-full overflow-y-auto c-flex-col"
                  onScroll={local.paging.scroll}
                >
                  {data.map((e, idx) => {
                    return (
                      <div
                        className="c-flex-grow c-flex"
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
  } else {
  }
};
const CheckboxList: FC<{
  on_click: (e: any) => void;
  value?: boolean;
}> = ({ value, on_click }) => {
  const local = useLocal({
    value: false as boolean,
  });
  return (
    <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
      <div className={cx(`c-flex c-flex-col c-space-y-1 c-p-0.5`)}>
        <div
          onClick={() => {
            local.value = !local.value;
            on_click(local.value);
            local.render();
          }}
          className="c-flex c-flex-row c-space-x-1 cursor-pointer c-items-center rounded-full p-0.5"
        >
          {local.value ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="c-fill-sky-500"
            >
              <path
                fill="currentColor"
                d="m10.6 14.092l-2.496-2.496q-.14-.14-.344-.15q-.204-.01-.364.15t-.16.354q0 .194.16.354l2.639 2.638q.242.243.565.243q.323 0 .565-.243l5.477-5.477q.14-.14.15-.344q.01-.204-.15-.363q-.16-.16-.354-.16q-.194 0-.353.16L10.6 14.092ZM5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H5.615Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H5.615Zm0-1h12.77q.23 0 .423-.192q.192-.193.192-.423V5.615q0-.23-.192-.423Q18.615 5 18.385 5H5.615q-.23 0-.423.192Q5 5.385 5 5.615v12.77q0 .23.192.423q.193.192.423.192Z"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
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
    background: #bddfff !important;
  }
`;

function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}

function getProp(child: any, name: string, defaultValue?: any) {
  const fn = new Function(
    `return ${get(child, `component.props.${name}.valueBuilt`) || `null`}`
  );

  return fn() || defaultValue;
}
