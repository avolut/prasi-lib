import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

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
    const res = arg.on_load({ field });
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);

  let value = arg.opt_get_value({
    fm,
    name: field.name,
    options: local.list,
    type: field.type,
  });
  return (
    <>
      <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
        <div className={cx(`c-flex c-flex-col c-space-y-1 c-p-0.5`)}>
          {local.list.map((e) => {
            return (
              <div
                className="flex items-center mb-4"
                onClick={() => {
                  arg.opt_set_value({
                    fm,
                    name: field.name,
                    selected: [e.value],
                    options: local.list,
                    type: field.type,
                  });
                }}
              >
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                  aria-labelledby="country-option-1"
                  aria-describedby="country-option-1"
                  checked={get(e, arg.pk) === value}
                />
                <label className="text-sm font-medium text-gray-900 ml-2 block">
                  {arg.opt_get_label(e, "list")}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
