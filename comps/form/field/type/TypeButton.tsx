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
  let value: any = fm.data[field.name];

  if (arg.type === "multi-option") {
    value = fm.data[field.name] || [];
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
                isChecked = value.some((e: any) => e[arg.pk] === item[arg.pk]);
              } catch (ex) {}
              return (
                <div
                  onClick={() => {
                    if (!Array.isArray(fm.data[field.name]))
                      fm.data[field.name] = [];
                    if (isChecked) {
                      fm.data[field.name] = fm.data[field.name].filter(
                        (e: any) => e[arg.pk] !== item[arg.pk]
                      );
                    } else {
                      fm.data[field.name].push(item);
                    }
                    fm.render();
                  }}
                  draggable="true"
                  role="button"
                  title="Hover chip"
                  className={cx(
                    isChecked ? "c-bg-gray-200" : "c-border c-border-gray-500",
                    " c-text-gray-700 c-h-8 c-px-3 c-w-max c-flex c-gap-2 c-items-center c-rounded-full  hover:c-bg-gray-300 hover:c-bg-opacity-75 "
                  )}
                >
                  <span className="block text-sm font-medium">
                    {arg.on_row(item)}
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
            `c-grid c-grid-cols- c-flex-grow c-gap-2 c-rounded-md c-bg-gray-200 c-p-0.5`,
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
                    fm.data[field.name] = get(e, arg.pk);
                    fm.render();
                  }}
                  className={cx(
                    `${checked ? "c-bg-blue-500 c-text-white" : ""} `,
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
