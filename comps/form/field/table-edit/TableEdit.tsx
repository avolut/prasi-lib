import { TableList } from "lib/comps/list/TableList";
import { useLocal } from "lib/utils/use-local";
import { FC, useRef } from "react";
import { FMLocal } from "../../typings";

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
      rowHeight: new WeakMap<any, Record<string, HTMLDivElement>>(),
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
              const rh = local.rowHeight.get(row);
              if (rh) {
                for (const div of Object.values(rh)) {
                  if (div.offsetHeight > 50) return div.offsetHeight + 6;
                }
              }
              return 50;
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
                  field_ref={(ref: any) => {
                    if (ref) {
                      if (!local.rowHeight.has(props.row)) {
                        local.rowHeight.set(props.row, {});
                      }
                      const rh = local.rowHeight.get(props.row);
                      if (rh) {
                        rh[props.column.key] = ref;
                      }
                    }
                  }}
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
