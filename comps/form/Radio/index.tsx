import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { Button } from "../../ui/button";
import { FormHook, modify } from "../utils/utils";
import { FieldOptions } from "../type";

export const Radio: FC<{
  name: string;
  on_select: (val: any) => void;
  options: FieldOptions;
  value: string | string[];
  PassProp: any;
  custom: "y" | "n";
  child: any;
  form?: FormHook;
  selection: "single" | "multi";
  init_modify: (modify: any) => void;
}> = ({
  options,
  on_select,
  form,
  value,
  custom,
  child,
  PassProp,
  init_modify,
  selection,
  name,
}) => {
  const local = useLocal({
    list: [] as { value: string; label: string }[],
    status: "init" as "init" | "loading" | "ready",
    mod: null as any,
    option_modified: false,
  });

  useEffect(() => {
    if (!local.option_modified && form) {
      local.status = "loading";
      local.render();
      const callback = (result: any[]) => {
        local.list = result.map((e) => {
          if (typeof e === "string") {
            return {
              value: e,
              label: e,
            };
          }
          return e;
        });

        local.status = "ready";
        local.render();
      };

      const res = options({ data: form.hook.getValues(), current_name: name });
      if (res instanceof Promise) {
        res.then(callback);
      } else {
        callback(res);
      }
    }
  }, [options]);

  if (form) {
    if (!local.mod) {
      local.mod = modify.bind({
        form,
        change_hook(opt) {
          const result = opt.options;
          if (result) {
            local.option_modified = true;
            local.list = result.map((e) => {
              if (typeof e === "string") {
                return {
                  value: e,
                  label: e,
                };
              }
              return e;
            });
          }
          form.render();
        },
      });
      init_modify(local.mod);
    }
  }

  return (
    <div className="c-flex c-flex-1 c-flex-wrap">
      {!!local.list &&
        local.list
          .filter((e) => e)
          .map((item, index: number) => {
            if (custom === "y" && form)
              return (
                <PassProp
                  data={form.hook.getValues()}
                  modify={local.mod}
                  is_active={item.value === value}
                  option_item={item}
                  current_name={name}
                  item_click={() => {
                    if (selection === "single") {
                      local.mod(name, { value: item.value });
                      local.render();
                    } else if (selection === "multi") {
                      local.mod(name, { value: item.value });
                      local.render();
                    } else {
                      null;
                    }
                  }}
                >
                  {child}
                </PassProp>
              );
            return (
              <Button
                key={index}
                onClick={() => {
                  on_select(item.value);
                  local.render();
                }}
                className={cx("c-mr-2")}
                variant={item.value === value ? "default" : "outline"}
              >
                <span>{item.label}</span>
              </Button>
            );
          })}
    </div>
  );
};
