import { GFCol } from "lib/gen/utils";
import { fields_map } from "lib/utils/format-value";
import { call_prasi_events } from "lib/utils/prasi-events";
import { set } from "lib/utils/set";
import { useLocal } from "lib/utils/use-local";
import { AlertTriangle } from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { RenderCellProps, SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { filterWhere } from "../filter/parser/filter-where";
import { MDLocal } from "../md/utils/typings";
import { toast } from "../ui/toast";
import { OnRowClick } from "./utils/type";

type SelectedRow = (arg: {
  row: any;
  rows: any[];
  idx: any;
  select?: boolean;
  data?: any[];
}) => boolean;

export type TableListProp = {
  child: any;
  PassProp: any;
  list: { type: string; item_w: string };
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
  gen_table?: string;
  softdel_type?: string;
  paging?: boolean;
  cache_row?: boolean;
  md?: MDLocal;
};
export type TableListLocal = ReturnType<typeof useTableListLocal>;
export const useTableListLocal = ({
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
  list,
  value,
  paging,
  cache_row,
  __props,
  md,
}: TableListProp) => {
  let ls_sort = localStorage.getItem(
    `sort-${location.pathname}-${location.hash}-${name}`
  ) as unknown as { columns: any; orderBy: any };
  if (ls_sort) {
    ls_sort = JSON.parse(ls_sort as any);
  }

  const local = useLocal(
    {
      times: 0,
      selectedRows: [] as {
        pk: string | number;
        rows: any;
      }[],
      el: null as null | HTMLDivElement,
      width: 0,
      height: 0,
      selectedAllRows: false as boolean,
      selectedRowIds: [] as (string | number)[],
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
        take: 100,
        skip: 0,
        timeout: null as any,
        total: 0,
        last_length: 0,
        scroll: (currentTarget: HTMLDivElement) => {
          if (
            isEditor ||
            local.data.length < local.paging.take ||
            local.data.length === 0 ||
            local.status !== "ready" ||
            !isAtBottom(currentTarget) ||
            local.reloading
          )
            return;

          if (local.paging.last_length <= local.data.length) {
            local.paging.skip = local.data.length;
            local.reload();
          }
        },
      },
      grid_ref: null as null | HTMLDivElement,
      collapsed: new Set<number>(),
      cached_row: new WeakMap<any, ReactElement>(),
      filtering: "" as ReactNode | string | true,
      reloading: null as any,
      reload: (arg?: { toast: boolean }) => {
        if (local.reloading) return local.reloading;

        local.reloading = new Promise<void>(async (done) => {
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
                if (typeof local.filtering === "string" && filtering) {
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
              await new Promise<void>((resolve) => {
                const ival = setInterval(() => {
                  if (!md.header.loading) {
                    clearInterval(ival);
                    resolve();
                  }
                }, 10);
              });
              if (
                Array.isArray(md?.params?.links) &&
                md?.params?.links?.length
              ) {
                const last = md.params.links[md.params.links.length - 1];

                if (last && last.where) {
                  if ((last.name && last.name === md.name) || !last.name) {
                    for (const [k, v] of Object.entries(last.where)) {
                      where[k] = v;
                    }
                  }
                }
              }
            }

            call_prasi_events("tablelist", "where", [
              __props?.gen__table,
              where,
            ]);

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
              if (
                id_parent ||
                !local.paging ||
                (local.paging && !local.paging.take) ||
                local.paging.skip === 0
              ) {
                local.data = data;
              } else {
                local.data = [...local.data, ...data];
              }

              local.paging.last_length = local.data.length;

              local.status = "ready";
              local.reloading = null;
              local.render();

              done();
              setTimeout(() => {
                if (
                  local.grid_ref &&
                  !id_parent &&
                  (paging !== undefined || paging)
                ) {
                  local.paging.scroll(local.grid_ref);
                }
              }, 100);
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

        return local.reloading;
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
    },
    ({ setDelayedRender }) => {
      setDelayedRender(true);
    }
  );

  return local;
};

function isAtBottom(currentTarget: HTMLDivElement): boolean {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}
