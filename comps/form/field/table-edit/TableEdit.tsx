import { FC, MouseEvent } from "react";
import { FMLocal } from "../../typings";
import { useLocal } from "lib/utils/use-local";
import { BaseForm } from "../../base/BaseForm";
import { TableList } from "lib/comps/list/TableList";
import get from "lodash.get";

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
  const local = useLocal({}, () => {
    //
  });
  const value = fm.data[name] || [];
  return (
    <>
      <div className="c-w-full c-h-full c-flex c-flex-col">
        <div className="c-h-[250px] c-w-full">
          <TableList
            rowHeight={50}
            feature={["checkbox"]}
            child={child}
            PassProp={PassProp}
            name={""}
            on_init={() => {}}
            mode={"table"}
            _item={item}
            gen_fields={[]}
            row_click={() => {}}
            selected={() => {
              return false;
            }}
            filter_name={""}
            on_load={async (arg: {
              reload: () => Promise<void>;
              orderBy?:
                | Record<
                    string,
                    "desc" | "asc" | Record<string, "desc" | "asc">
                  >
                | undefined;
              paging: { take: number; skip: number };
              mode: "count" | "query";
            }) => {
              return value;
            }}
            render_col={(arg: any) => {
              const { props, tbl, child } = arg;
              const fm_row = { ...fm };
              fm_row.data = props.row;
              fm_row.render = fm.render;
              return (
                <PassProp
                  idx={props.rowIdx}
                  row={props.row}
                  col={{
                    name: props.column.key,
                    value: props.row[props.column.key],
                    depth: props.row.__depth || 0,
                  }}
                  rows={tbl.data}
                  fm={fm_row}
                  ext_fm={{
                    remove: () => {
                        console.log(fm.data)
                        console.log(props.row)
                      if (Array.isArray(fm.data[name])) {
                        fm.data[name] = value.filter(
                          (e: any) => e !== props.row
                        );
                        fm.render();
                        tbl.data = fm.data[name];
                        tbl.render();
                        console.log(fm.data)
                      }
                    },
                    add: () => {
                      if (Array.isArray(value)) {
                        value.push({});
                      } else {
                        alert("value bukan array");
                      }
                    },
                  }}
                >
                  {child}
                </PassProp>
              );
            }}
            render_row={(child, data) => {
              return (
                <div className="c-contents">
                  <BaseForm
                    data={data}
                    on_submit={(form) => {}}
                    render={fm.render}
                  >
                    {(form) => {
                      return <>{child}</>;
                    }}
                  </BaseForm>
                </div>
              );
            }}
          />
        </div>
        {bottom}
      </div>
    </>
  );
};
