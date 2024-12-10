import { parseGenField } from "lib/gen/utils";
import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Sticker,
} from "lucide-react";
import { ChangeEvent, FC, MouseEvent, useEffect } from "react";
import DataGrid, { ColumnOrColumnGroup, Row } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { createPortal } from "react-dom";
import { getFilter } from "../filter/utils/get-filter";
import { Skeleton } from "../ui/skeleton";
import { toast, Toaster } from "../ui/toast";
import { TableListProp, useTableListLocal } from "./TableListLocal";
import { TLList } from "./TLList";
import { TLSlider } from "./TLSlider";
import { sortTree } from "./utils/sort-tree";

let EMPTY_SET = new Set() as ReadonlySet<any>;

const w = window as any;
const selectCellClassname = css`
  display: flex;
  align-items: center;
  justify-content: center;

  > input {
    margin: 0;
  }
`;

export const TableList: FC<TableListProp> = (props) => {
  const {
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
  } = props;
  let mode = _mode;
  if (mode === "auto") {
    if (w.isMobile) {
      mode = "list";
    } else {
      mode = "table";
    }
  }

  const local = useTableListLocal(props);

  const reload = local.reload;
  if (md) {
    md.master.list = local;
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
      if (isEditor && local.data.length === 0 && local.status === "ready") {
        reload();
      } else {
        local.render();
      }
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
      local.selectedAllRows = true;
      local.render();
    } else {
      // jika tidak, maka local selected rows akan dikosongkan
      local.selectedAllRows = false;
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
      local.selectedAllRows = false;
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

  if (typeof local.data === "string") {
    console.error(local.data);
    local.data = [];
  }

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
  let first = true;
  for (const child of childs) {
    let key = getProp(child, "name", {});
    const name = getProp(child, "title", "");
    const sort = getProp(child, "sortir", "");
    let show = getProp(child, "show", "");
    if (typeof show === "function") {
      show = show();
      if (typeof show === "object" && show instanceof Promise) {
        show.then((e) => {
          show = e;
        });
      }
    }
    show = show === "n" ? false : show;
    if (show) {
      const type = getProp(child, "type", "");
      const width = parseInt(getProp(child, "width", {}));
      if (type === "checkbox") {
        columns.push({
          key,
          name,
          width: 35,
          minWidth: 45,
          resizable: true,
          sortable: sort === "n" ? false : true,
          frozen: true,
          renderHeaderCell(props) {
            return (
              <div
                className={cx(
                  css`
                    width: 100%;
                    height: 100%;
                  `,
                  "c-flex c-items-center c-justify-center"
                )}
              >
                {isCheckbox ? (
                  <input
                    type="checkbox"
                    checked={local.selectedAllRows}
                    onChange={headerCheckboxClick}
                  />
                ) : (
                  <></>
                )}
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
            if (isCheckbox) {
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
                    checked={local.selectedAllRows ? true : isChecked}
                  />
                </div>
              );
            }
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
          sortable: sort === "n" ? false : true,
          renderHeaderCell(props) {
            return (
              <div
                className="flex flex-row flex-grow items-center"
                onClick={() => {
                  const msg = `The ${props?.column?.name} column cannot be sorted!`;
                  if (!props?.column?.sortable) {
                    toast.dismiss();
                    toast.error(
                      <div className="c-flex c-text-red-600 c-items-center">
                        <AlertTriangle className="c-h-4 c-w-4 c-mr-1" />
                        {msg}
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
                }}
              >
                {props?.column?.name}
                {props.sortDirection ? (
                  <>
                    {" "}
                    <div className="px-1">
                      {props.sortDirection === "ASC" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12.53 7.97a.75.75 0 0 0-1.06 0l-7 7A.75.75 0 0 0 5 16.25h14a.75.75 0 0 0 .53-1.28z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5 7.75a.75.75 0 0 0-.53 1.28l7 7a.75.75 0 0 0 1.06 0l7-7A.75.75 0 0 0 19 7.75z"
                          />
                        </svg>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
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
                      className={cx(css`
                        width: 16px;
                      `)}
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
                            " c-border-l c-border-b c-border-black c-w-[10px] c-h-[15px] rows",
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
  }
  if (mode === "list") {
    if (columns.length > 1) columns = columns.slice(0, 0 + 1);
  }

  if (!isEditor) {
    let should_toast = true;
    if (md) {
      if (md.props.mode !== "full") {
        should_toast = false;
      }
    }

    if (should_toast) {
      if (local.status === "loading") {
        toast.dismiss();
        toast.loading(
          <>
            <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
            Loading Data ...
          </>,
          { dismissible: true }
        );
      } else {
        toast.dismiss();
      }
    }
  }

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  if (mode === "table") {
    if (local.status === "resizing" && !isEditor) {
      local.status = "ready";
      local.render();
      return null;
    }

    return (
      <>
        <div
          className={cx(
            "table-list c-w-full c-h-full c-flex-1 c-relative c-overflow-hidden",
            dataGridStyle(local)
          )}
        >
          {local.status !== "ready" && (
            <div className="c-flex c-flex-col c-space-y-2 c-m-4 c-absolute c-left-0 c-top-0">
              <Skeleton className={cx("c-w-[200px] c-h-[11px]")} />
              <Skeleton className={cx("c-w-[170px] c-h-[11px]")} />
              <Skeleton className={cx("c-w-[180px] c-h-[11px]")} />
            </div>
          )}
          <div
            className="table-list-inner c-absolute c-inset-0"
            ref={(e) => {
              local.el = e;
              if (e) local.height = e.offsetHeight;
            }}
          >
            {toaster_el && createPortal(<Toaster />, toaster_el)}
            {local.status === "init" ? (
              <DataGrid
                style={{ opacity: 0 }}
                className="rdg-light"
                columns={[
                  {
                    key: "_",
                    name: "",
                    renderCell({ rowIdx }) {
                      clearTimeout(local.paging.timeout);
                      local.paging.timeout = setTimeout(() => {
                        local.status = "reload";
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
                  ref={(e) => {
                    local.grid_ref = e?.element as any;
                  }}
                  onScroll={(e) => {
                    local.paging.scroll(e.currentTarget);
                  }}
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
                            const isSelect = local.selectedAllRows
                              ? true
                              : selected({
                                  idx: props.rowIdx,
                                  row: props.row,
                                  rows: local.data,
                                  select: local.selectedAllRows
                                    ? true
                                    : local.selectedRows.some(
                                        (checked) => checked.pk === props.row.id
                                      ),
                                  data: local.selectedAllRows
                                    ? local.data
                                    : local.selectedRows,
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
                                    (md?.selected?.[local.pk?.name || ""] ===
                                      props.row[local.pk?.name || ""] &&
                                      props.row[local.pk?.name || ""])) &&
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
      </>
    );
  } else if (mode === "list") {
    return (
      <>
        {toaster_el && createPortal(<Toaster />, toaster_el)}
        {list.type !== "slider" && list.type !== "grid" && (
          <TLList
            row_click={row_click}
            PassProp={PassProp}
            local={local}
            mode_child={mode_child}
            data={data}
            dataGridStyle={dataGridStyle}
          />
        )}
        {list.type === "slider" && (
          <TLSlider
            row_click={row_click}
            PassProp={PassProp}
            local={local}
            mode_child={mode_child}
            data={data}
            item_w={list.item_w}
            dataGridStyle={dataGridStyle}
          />
        )}
      </>
    );
  }
};
const CheckboxList: FC<{
  on_click: (e: any) => void;
  checked?: boolean;
  value?: boolean;
}> = ({ value, checked, on_click }) => {
  const local = useLocal({
    checked: false as any,
    value: false as boolean,
  });
  useEffect(() => {
    local.checked = checked;
    local.render();
  }, []);
  return (
    <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
      <div className={cx(`c-flex c-flex-col c-space-y-1 c-p-0.5`)}>
        <div
          onClick={() => {
            local.checked = !local.checked;
            on_click(typeof value === "boolean" ? !local.checked : value);
            local.render();
          }}
          className="c-flex c-flex-row c-space-x-1 cursor-pointer c-items-center rounded-full p-0.5"
        >
          {local.checked ? (
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

const dataGridStyle = (local: { el: null | HTMLDivElement }) => {
  return css`
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
    .rdg {
      height: ${local.el?.clientHeight || 100}px;
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
};

function getProp(child: any, name: string, defaultValue?: any) {
  const fn = new Function(
    `return ${get(child, `component.props.${name}.valueBuilt`) || `null`}`
  );

  return fn() || defaultValue;
}
