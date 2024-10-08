import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const FieldSingleCheckbox: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
    change_timeout: null as any,
  });
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  const renderOnChange = () => {
    local.render();
    if (field.on_change) {
      field.on_change({ value: fm.data[field.name], name: field.name, fm });
    }

    clearTimeout(local.change_timeout);
    local.change_timeout = setTimeout(fm.render, 300);
  };
  useEffect(() => {
    const callback = (res: any[]) => {
      if (Array.isArray(res)) {
        const list: any = res.map((e: any) => {
          return {
            label: arg.opt_get_label(e, "list"),
            value: e.value,
          };
        });
        local.list = list;
      } else {
        local.list = [];
      }
      local.render();
    };
    const res = arg.on_load({});
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);
  let value: boolean = fm.data[field.name];
  return (
    <>
      <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
        <div className={cx(`c-flex c-flex-col c-space-y-1 c-p-0.5`)}>
          <div
            onClick={() => {
              if(!disabled){
                fm.data[field.name] = !value;
                fm.render();
                if (field.on_change) {
                  field.on_change({
                    value: !value,
                    name: field.name,
                    fm,
                  });
                }
              }
            }}
            className="c-flex c-flex-row c-space-x-1 cursor-pointer c-items-center rounded-full p-0.5"
          >
            {value ? (
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
    </>
  );
};
