import { TableList } from "lib/comps/list/TableList";
import { useLocal } from "lib/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { FMLocal } from "../../typings";
import get from "lodash.get";
import { BaseForm } from "../../base/BaseForm";

export const TableEdit: FC<{
  on_init: () => FMLocal;
  name: string;
  child: any;
  PassProp: any;
  item: PrasiItem;
  show_header?: "y" | "n";
  bottom: any;
  body: any;
}> = ({ on_init, name, child, PassProp, item, bottom, show_header }) => {
  const fm = on_init();
  const local = useLocal(
    {
      tbl: null as any,
    },
    () => {}
  );
  const ref = useRef<HTMLDivElement>(null);
  const parent = fm;
  if (!Array.isArray(fm.data[name])) {
    if (typeof fm.data[name] === "object") {
      fm.data[name] = [JSON.parse(JSON.stringify(fm.data[name]))];
    } else {
      fm.data[name] = [];
    }
  }
  const value = fm.data[name];
  useEffect(() => {
    local.tbl = {
      data: value,
      render: () => {},
    };
    local.render();
  }, []);
  const raw_childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );

  let columns: {
    key: string;
    name?: string;
    label?: string;
    width?: number;
    minWidth?: number;
    resizable?: boolean;
    sortable?: boolean;
    frozen?: boolean;
    renderCell: (arg: any) => any;
  }[] = [];
  let childs: any[] = [];
  const mode_child = raw_childs.find((e: any) =>
    ["tbl-col", "table: columns"].includes(e.name)
  );
  const tbl = item.edit.childs[0].edit.childs.find(
    (e: any) => get(e, "id") === mode_child.id
  );
  const meta = tbl;
  if (meta && meta.childs) {
    childs = meta.childs;
  }
  for (const child of childs) {
    let key = getProp(child, "name", {});
    const label = getProp(child, "title", "");
    const type = getProp(child, "type", "");
    const width = parseInt(getProp(child, "width", {}));
    const show = getProp(child, "show", {});
    let is_show =
      typeof show === "function"
        ? show({ data: fm.data })
        : typeof show === "string"
        ? show === "n"
          ? false
          : true
        : true;
    if (is_show)
      if (type === "checkbox") {
        const on_click = getProp(child, "opt__on_click", "");
        columns.push({
          key,
          name,
          width: 35,
          minWidth: 45,
          resizable: true,
          sortable: true,
          frozen: true,
          renderCell(arg: any) {
            const { props, tbl } = arg;
            local.tbl = tbl;
            const key = props.column.key;
            return (
              <PassProp
                idx={props.rowIdx}
                row={props.row}
                col={{
                  name: key,
                  value: props.row[props.column.key],
                  depth: props.row.__depth || 0,
                }}
                rows={tbl.data}
                fm={props.fm}
                fm_parent={parent}
                ext_fm={{
                  idx: props.rowIdx,
                  change: () => {},
                  remove: () => {
                    const data =
                      tbl.data.filter((e: any) => e !== props.row) || [];
                    fm.data[name] = data;
                    fm.render();
                  },
                  add: (e: any) => {
                    tbl.data.push(e ? e : {});
                    fm.render();
                  },
                }}
              >
                {child}
              </PassProp>
            );
          },
        });
      } else {
        columns.push({
          key,
          label,
          width: width > 0 ? width : undefined,
          resizable: true,
          sortable: true,
          renderCell(arg: any) {
            const { props, tbl } = arg;
            local.tbl = tbl;
            const key = props.column.key;
            return (
              <PassProp
                idx={props.rowIdx}
                row={props.row}
                col={{
                  name: key,
                  value: props.row[props.column.key],
                  depth: props.row.__depth || 0,
                }}
                rows={tbl.data}
                fm={props.fm}
                fm_parent={parent}
                ext_fm={{
                  idx: props.rowIdx,
                  change: () => {},
                  remove: () => {
                    const data =
                      tbl.data.filter((e: any) => e !== props.row) || [];
                    fm.data[name] = data;
                    fm.render();
                  },
                  add: (e: any) => {
                    tbl.data.push(e ? e : {});
                    fm.render();
                  },
                }}
              >
                {child}
              </PassProp>
            );
          },
        });
      }
  }
  return (
    <>
      <div
        className={cx(
          `c-w-full c-h-full c-flex c-flex-col`,
          css`
            .rdg-cell > div {
              flex-direction: row;
              align-items: center;
              padding-right: 5px;
              .field {
                flex: 1;
                padding-top: 0px;
              }
            }
            .rdg-header-row {
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
            }
            .table-list-inner {
              position: relative !important;
            }
            .typeahead-arrow {
              margin-right: 10px;
            }
            tbody > .form {
              overflow: visible;
              & > .form-inner {
                position: relative;
              }
            }
          `
        )}
      >
        <table
          className={cx(
            "c-table-auto",
            css`
              height: 1px;
              border-collapse: collapse;
              table-layout: auto;

              .field {
                padding: 0px 0px 0px 10px;
              }
            `
          )}
        >
          {show_header !== "n" && (
            <thead>
              <tr className=" ">
                {columns.map((header) => {
                  return (
                    <th
                      key={header.key}
                      className={cx(
                        css`
                          background-color: #f9f9f9;
                        `,
                        header.width || 0 > 0
                          ? css`
                              width: ${header.width}px;
                            `
                          : ""
                      )}
                    >
                      <div
                        className={cx(
                          "rdg-cell c-py-2 c-px-4 c-flex c-flex-row c-items-center c-h-full",

                          header.width || 0 > 0
                            ? css`
                                width: ${header.width}px;
                              `
                            : ""
                        )}
                      >
                        {header.label}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody
            className={cx(
              "c-pb-2",
              css`
                label {
                  width: 100%;
                }
              `
            )}
          >
            {Array.isArray(value) && value.length ? (
              <>
                {value.map((row: any, idx: number) => {
                  return (
                    <BaseForm
                      key={idx}
                      name={`tef-${idx}`}
                      tag={"blank"}
                      data={row}
                    >
                      {(form) => {
                        return (
                          <tr
                            className={cx(
                              "c-border-t",
                              idx !== value.length - 1
                                ? "c-border-gray-300"
                                : ""
                            )}
                          >
                            {columns.map((header) => {
                              return (
                                <td
                                  className={cx(
                                    "c-py-1",
                                    css`
                                      vertical-align: top;
                                    `,
                                    header.width || 0 > 0
                                      ? css`
                                          width: ${header.width || 0}px;
                                        `
                                      : ""
                                  )}
                                >
                                  {header.renderCell({
                                    props: {
                                      row: row,
                                      rowIdx: idx,
                                      column: header,
                                      fm: {
                                        ...form.fm,
                                        data: row,
                                      },
                                    },
                                    tbl: {
                                      data: value,
                                    },
                                  })}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      }}
                    </BaseForm>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </tbody>
        </table>

        <PassProp
          ext_fm={{
            add: (e: any) => {
              if (Array.isArray(fm.data[name])) {
                fm.data[name].push({ ...e });
              } else {
                fm.data[name] = [{ ...e }];
              }
              fm.render();
              setTimeout(() => {
                const last = Array.from(
                  ref.current?.querySelectorAll(".rdg-row") || []
                ).pop();
                const input = last?.querySelector("input");
                if (input) {
                  input.focus();
                }
              }, 100);
            },
          }}
          fm_parent={parent}
        >
          {bottom}
        </PassProp>
      </div>
    </>
  );
};

function getProp(child: any, name: string, defaultValue?: any) {
  const fn = new Function(
    `return ${get(child, `component.props.${name}.valueBuilt`) || `null`}`
  );

  return fn() || defaultValue;
}
