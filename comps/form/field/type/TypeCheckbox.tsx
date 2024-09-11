import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../../typings";
import { Button } from "lib/comps/ui/button";

export const FieldCheckbox: FC<{
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  const local = useLocal({
    list: [] as any[],
  });
  useEffect(() => {
    const callback = (res: any[]) => {
      if (Array.isArray(res)) {
        const list: any = res.map((e: any, idx) => {
          const prev = res[idx - 1];
          const next = res[idx + 1];
          return {
            label: arg.opt_get_label(e, "list", { prev, next }),
            value: e.value,
            data: e.data,
          };
        });
        local.list = list;
      } else {
        local.list = [];
      }
      local.render();
    };
    const res = arg.on_load({ field });
    if (res instanceof Promise) res.then(callback);
    else callback(res);
  }, []);

  let value =
    typeof arg.opt_get_value === "function"
      ? arg.opt_get_value({
          fm,
          name: field.name,
          options: local.list,
          type: field.type,
        })
      : fm.data[field.name];

  let className = "";
  let is_tree = false;
  if (arg.__props) {
    const { rel__feature, rel__id_parent } = arg.__props;
    if (
      typeof rel__feature !== "undefined" &&
      Array.isArray(rel__feature) &&
      rel__feature.includes("tree") &&
      typeof rel__id_parent === "string" &&
      rel__id_parent
    ) {
      is_tree = true;
      className = cx(
        css`
          .opt-item {
            padding-top: 0px;
            padding-bottom: 0px;
            line-height: 18px;
            font-size: 13px;
            border: 0px;
            white-space: pre-wrap;
            font-family: monospace;
            height: 18px;
            border-radius: 0px;

            &:hover,
            &.active {
              background: #d3e1ff;
            }
            svg {
              width: 15px;
              height: 15px;
              color: #04268b;
            }
          }
        `,
        "c-font-mono"
      );
    }
  }
  const applyChanges = (selected: any[]) => {
    if (typeof arg.opt_set_value === "function") {
      arg.opt_set_value({
        fm,
        name: field.name,
        selected: selected.map((e) => e.value),
        options: local.list,
        type: field.type,
      });
    } else {
      fm.data[field.name] = selected.map((e) => e.value);
      fm.render();
    }
  };
  return (
    <>
      <div
        className={cx(className, "c-flex c-items-center c-w-full c-flex-row")}
      >
        <div
          className={cx(
            `c-flex c-flex-col c-p-0.5 c-flex-1`,
            !is_tree && "c-space-y-1 "
          )}
        >
          {local.list.map((item, idx) => {
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
                  applyChanges(selected);
                }}
                className={cx(
                  "opt-item c-flex c-flex-row c-space-x-1 cursor-pointer c-items-center rounded-full p-0.5",
                  isChecked && "active"
                )}
              >
                {isChecked ? (
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
                <div className="">{item.label}</div>
              </div>
            );
          })}
          <div
            className={cx(
              "c-flex c-mt-2 c-space-x-2",
              is_tree &&
                css`
                  svg {
                    width: 15px;
                    height: 15px;
                    color: #04268b;
                  }
                `
            )}
          >
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                applyChanges(local.list);
              }}
            >
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
              &nbsp;Check All
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                applyChanges([]);
              }}
            >
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
              &nbsp;Uncheck All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
