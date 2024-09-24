import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";

export const FieldToggle: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
    value: [] as any[],
    ref: null as any,
  });

  useEffect(() => {
    const callback = (res: any[]) => {
      local.list = res;
      if (Array.isArray(res)) {
        local.value = res.map((e) => get(e, arg.pk));
      }
      local.render();
    };
    const res = arg.on_load({});
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);
  let value = arg.opt_get_value({
    fm,
    name: field.name,
    options: local.list,
    type: field.type,
  });
  let checked =
    typeof value === "boolean"
      ? value
      : local.value.indexOf(value) > 0
      ? true
      : false;
  return (
    <>
      <div className={cx("c-flex c-items-center c-justify-start c-w-full")}>
        <label
          className="c-flex c-items-center c-cursor-pointer"
        >
          <div className="c-mr-3 c-text-gray-700 c-font-medium">
            {get(local, "list[0].label")}
          </div>
          <div
            className={cx(
              "c-relative",
              css`
                input:checked ~ .dot {
                  transform: translateX(100%);
                }
                input:checked ~ .dot-wrap {
                  background-color: #125ad6;
                }
              `
            )}
          >
            <input
              ref={(ref) => (local.ref = ref)}
              type="checkbox"
              checked={checked}
              className="c-sr-only"
              onChange={(e) => {
                const check = e.target.checked;
                const find = local.list.findIndex((item) => {
                  if (typeof item.value === "boolean") {
                    return value ? item.value === true : item.value === false;
                  }
                  return item.value === value;
                });
                arg.opt_set_value({
                  fm,
                  name: field.name,
                  selected: [local.list[find ? 0 : 1]?.value],
                  options: local.list,
                  type: field.type,
                });
              }}
            />
            <div className="dot-wrap c-block c-bg-gray-600 c-w-8 c-h-5 c-rounded-full"></div>
            <div
              className={cx(
                "dot c-absolute c-left-1 c-top-1 c-bg-white c-w-3 c-h-3 c-rounded-full c-transition"
              )}
            ></div>
          </div>
          <div className="c-ml-3 c-text-gray-700 c-font-medium">
            {get(local, "list[1].label")}
          </div>
        </label>
      </div>
    </>
  );
};
