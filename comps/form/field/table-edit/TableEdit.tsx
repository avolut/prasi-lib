import { TableList } from "lib/comps/list/TableList";
import { useLocal } from "lib/utils/use-local";
import { FC, ReactElement, useEffect, useRef } from "react";
import { BaseForm } from "../../base/BaseForm";
import { FMLocal } from "../../typings";

export const TableEdit: FC<{
  on_init: () => FMLocal;
  name: string;
  child: any;
  PassProp: any;
  item: PrasiItem;
  bottom: any;
  body: any;
}> = ({ on_init, name, child, PassProp, item, bottom, body }) => {
  const fm = on_init();
  const local = useLocal(
    {
      tbl: null as any,
    },
    () => {}
  );
  const ref = useRef<HTMLDivElement>(null);

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
            "c-h-[50px] c-w-full",
            css`
              > .rdg {
                overflow-y: hidden !important;
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
            `
          )}
          style={{
            height: isEditor
              ? 100
              : value.length === 0
              ? 50
              : value.length * 50 + 50,
          }}
          ref={ref}
        >
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              db.milestone.create({
                data: {
                  goal_setting: {
                    connect: {
                      id: "456222b4-4c0c-4f53-b62e-3e1f685f9c4a",
                    },
                  },
                  name: "124124",
                  goal: {
                    connect: {
                      id: "9fa14b83-2d8b-4c3d-a18c-c17d99a37813",
                    },
                  },
                },
              });
            }}
          >
            COBA
          </button> */}
          <TableList
            row_height={50}
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
                  ext_fm={{
                    change: () => {},
                    remove: () => {
                      fm.data[name] = tbl.data.filter(
                        (e: any) => e !== props.row
                      );
                      fm.render();
                    },
                    add: () => {
                      tbl.data.push({});
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
            add: () => {
              local.tbl.data.push({});
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
        >
          {bottom}
        </PassProp>
      </div>
    </>
  );
};
