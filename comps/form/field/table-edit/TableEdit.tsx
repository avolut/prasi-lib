import { TableList } from "lib/comps/list/TableList";
import { useLocal } from "lib/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { FMLocal } from "../../typings";
import get from "lodash.get";

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

  let columns: any[] = [];
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
          // return <></>;
          const { props, tbl } = arg;
          const fm_row = { ...fm, render: local.render };
          return (
            <PassProp
              idx={props.rowIdx}
              row={props.row}
              fm_parent={parent}
              col={{
                name: props.column.key,
                value: get(props.row, props.column.key),
                depth: 0,
              }}
              fm={fm_row}
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
          const fm_row = { ...fm, render: local.render };
          fm_row.data = props.row;
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
              fm={fm_row}
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
          `
        )}
      >
        <table
          className={cx(
            "c-table-auto",
            css`
              height: 1px;
              border-collapse: collapse;
              table-layout: auto; /* Kolom akan menyesuaikan konten */
            `
          )}
        >
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
                      header.width > 0
                        ? css`
                            width: ${header.width}px;
                          `
                        : ""
                    )}
                  >
                    <div
                      className={cx(
                        "rdg-cell c-py-2 c-px-4 c-flex c-flex-row c-items-center c-h-full",

                        header.width > 0
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
          <tbody className="c-pb-2">
            {Array.isArray(value) && value.length ? (
              <>
                {value.map((row: any, idx: number) => {
                  return (
                    <tr>
                      {columns.map((header) => {
                        return (
                          <td>
                            <div className="c-flex c-flex-row c-py-2 c-w-full c-h-full">
                              {header.renderCell({
                                props: {
                                  row: row,
                                  rowIdx: idx,
                                  column: header,
                                },
                                tbl: {
                                  data: value,
                                },
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
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
                fm.data[name].push({});
              } else {
                fm.data[name] = [{}];
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
  return (
    <>
      <div className="c-w-full c-h-full c-flex c-flex-col">
        <div
          className={cx(
            "c-w-full",
            css`
              .rdg {
                overflow-y: hidden !important;
                height: var(--rdg-scroll-height) !important;
              }
              .rdg-cell > div {
                flex-direction: row;
                align-items: center;
                padding-right: 5px;
                .field {
                  flex: 1;
                  padding-top: 0px;
                }
              }
              .field-error {
                display: none;
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
            `,
            value.length === 0 &&
              (show_header === "n"
                ? css`
                    display: none;
                  `
                : css`
                    min-height: 35px;
                  `),
            show_header === "n" &&
              css`
                .rdg-header-row {
                  display: none;
                }
              `
          )}
          ref={ref}
        >
          <TableList
            row_height={(row) => {
              let h = 50;
              if (local.tbl) {
                const data = local.tbl.data;
                const el = local.tbl.el as HTMLDivElement;
                let idx = 0;
                if (Array.isArray(data)) {
                  for (let k = 0; k < data.length; k++) {
                    if (data[k] === row) {
                      idx = k;
                      break;
                    }
                  }
                }

                const rowdiv = el.querySelectorAll(`.rdg-row`)[
                  idx
                ] as HTMLDivElement;
                if (rowdiv) {
                  rowdiv.querySelectorAll(".field").forEach((field) => {
                    const div = field as HTMLDivElement;
                    h = Math.max(h, div.offsetHeight + 10);
                  });
                }
              }

              return h;
            }}
            feature={[]}
            child={child}
            PassProp={PassProp}
            name={""}
            value={value}
            on_init={(tbl) => {
              local.tbl = tbl;
              local.render();
            }}
            mode={"table"}
            _item={item}
            gen_fields={[]}
            row_click={({ event }) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            show_header={show_header === "y"}
            selected={() => {
              return false;
            }}
            filter_name={""}
            render_col={(arg) => {
              const { props, tbl, child } = arg;
              const fm_row = { ...fm, render: local.render };
              fm_row.data = props.row;
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
                  fm={fm_row}
                  fm_parent={parent}
                  ext_fm={{
                    idx: props.rowIdx,
                    change: () => {},
                    remove: () => {
                      fm.data[name] = tbl.data.filter(
                        (e: any) => e !== props.row
                      );
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
            }}
          />
        </div>
        <PassProp
          ext_fm={{
            add: (e: any) => {
              local.tbl.data.push(e ? e : {});
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
