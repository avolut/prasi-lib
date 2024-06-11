import { TableList } from "lib/comps/list/TableList";
import { useLocal } from "lib/utils/use-local";
import { FC } from "react";
import { BaseForm } from "../../base/BaseForm";
import { FMLocal } from "../../typings";
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
  const local = useLocal(
    {
      tbl: null as any,
    },
    () => {}
  );
  const value = isEditor ? [{}] :Array.isArray(fm.data[name]) ? fm.data[name] : [];
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
            `
          )}
          style={{
            height: isEditor
              ? 100
              : value.length === 0
              ? 50
              : value.length * 50 + 50,
          }}
        >
          <TableList
            rowHeight={50}
            feature={[]}
            child={child}
            PassProp={PassProp}
            name={""}
            value={value}
            on_init={() => {}}
            mode={"table"}
            _item={item}
            gen_fields={[]}
            row_click={() => {}}
            selected={() => {
              return false;
            }}
            filter_name={""}
            render_col={(arg: any) => {
              const { props, tbl, child } = arg;
              const fm_row = { ...fm };
              fm_row.data = props.row;
              fm_row.render = fm.render;
              local.tbl = tbl;
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
                      if (Array.isArray(fm.data[name])) {
                        fm.data[name] = value.filter(
                          (e: any) => e !== props.row
                        );
                        fm.render();
                        tbl.data = fm.data[name];
                        tbl.render();
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
                    is_form={false}
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
        <PassProp
          ext_fm={{
            add: () => {
              if (Array.isArray(value)) {
                value.push({});
                fm.data[name] = value;
                fm.render();
              } else {
                fm.data[name] = [{}];
                fm.render();
              }
            },
          }}
        >
          {bottom}
        </PassProp>
      </div>
    </>
  );
};

export const Footer = (
  fm: FMLocal,
  name: string,
  PassProp: any,
  child: any,
  value: Array<any>
) => {
  return (
    <>
      {/* <div>
    <PassProp 
                  ext_fm={{
                    remove: () => {
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
                  }}></PassProp>
  </div> */}
    </>
  );
};
