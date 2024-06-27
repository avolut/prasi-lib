import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { useLocal } from "@/utils/use-local";
import get from "lodash.get";

export const FieldButton: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
  });
  useEffect(() => {
    const callback = (res: any[]) => {
      local.list = res;
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
  if (arg.type === "multi-option") {
    return (
      <>
        <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
          <div
            className={cx(
              `c-flex`,
              css`
                gap: 0.5rem;
              `
            )}
          >
            {local.list.map((item) => {
              let isChecked = false;
              try {
                isChecked = value.some((e: any) => e === item.value);
              } catch (ex) {}
              return (
                <div
                  onClick={() => {
                    let selected = Array.isArray(value)
                      ? value.map((row) => {
                          return local.list.find((e) => e.value === row);
                        })
                      : [];
                    if (isChecked) {
                      selected = selected.filter(
                        (e: any) => e.value !== item.value
                      );
                    } else {
                      selected.push(item);
                    }
                    arg.opt_set_value({
                      fm,
                      name: field.name,
                      selected: selected.map((e) => e.value),
                      options: local.list,
                      type: field.type,
                    });
                  }}
                  draggable="true"
                  role="button"
                  title="Hover chip"
                  className={cx(
                    isChecked
                      ? "c-border c-border-blue-500 c-bg-blue-500 c-text-white"
                      : "c-border c-border-gray-500 hover:c-bg-gray-300 ",
                    "c-text-sm c-text-gray-700 c-h-8 c-px-3 c-w-max c-flex c-gap-2 c-items-center c-rounded-full  hover:c-bg-opacity-75 "
                  )}
                >
                  <span className="block text-sm font-medium">
                    {arg.opt_get_label(item, "label")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  } else {
    if (Array.isArray(value)) value = null;
  }
  return (
    <>
      <div className={cx("c-flex c-items-center c-w-full c-flex-row")}>
        <div
          className={cx(
            `c-grid c-grid-cols- c-flex-grow c-gap-2 c-rounded-md c-bg-gray-200 c-p-1`,
            css`
              grid-template-columns: repeat(
                ${local.list.length},
                minmax(0, 1fr)
              );
            `
          )}
        >
          {local.list.map((e) => {
            let checked = get(e, arg.pk) === value;
            return (
              <div>
                <label
                  onClick={() => {
                    arg.opt_set_value({
                      fm,
                      name: field.name,
                      selected: [e.value],
                      options: local.list,
                      type: field.type,
                    });
                  }}
                  className={cx(
                    `${checked ? "c-bg-blue-500 c-text-white" : ""} `,
                    "c-text-sm c-block c-cursor-pointer c-select-none c-rounded-md c-p-1 c-text-center peer-checked: peer-checked:c-font-bold"
                  )}
                >
                  {arg.opt_get_label(e, "label")}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
