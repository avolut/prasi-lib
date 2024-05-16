import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { useLocal } from "@/utils/use-local";
import get from "lodash.get";

export const FieldRadio: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
    value: [] as any[],
  });
  useEffect(() => {
    const callback = (res: any[]) => {
      local.list = res;
      if (Array.isArray(res)) {
        local.value = res.map((e) => get(e, arg.pk));
      }
      local.render();
    };
    const res = arg.on_load();
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);
  let listValue = [];
  let value: any = fm.data[field.name];
  let checked = local.value.indexOf(value) > 0 ? true : false;
  return (
    <>
      <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
        <div className={cx(`c-flex c-flex-col c-space-y-1 c-p-0.5`)}>
          {local.list.map((e) => {
            return (
              <div
                className="flex items-center mb-4"
                onClick={() => {
                  fm.data[field.name] = get(e, arg.pk);
                  fm.render();
                }}
              >
                <input
                  id="country-option-1"
                  type="radio"
                  name="countries"
                  value="USA"
                  className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                  aria-labelledby="country-option-1"
                  aria-describedby="country-option-1"
                  checked={get(e, arg.pk) === value}
                />
                <label className="text-sm font-medium text-gray-900 ml-2 block">
                  {arg.on_row(e)}
                </label>
              </div>
            );
            return (
              <div>
                <label
                  className={cx(
                    `${
                      get(e, arg.pk) === value
                        ? "c-bg-blue-500 c-text-white"
                        : ""
                    } `,
                    "c-block c-cursor-pointer c-select-none c-rounded-md c-p-1 c-text-center peer-checked: peer-checked:c-font-bold"
                  )}
                >
                  {arg.on_row(e)}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
