import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { Button } from "../../ui/button";
import { FormHook, modify } from "../utils/utils";

export const Radio: FC<{
  on_select: (val: any) => void;
  options: () => Promise<(string | { value: string; label: string })[]>;
  value: string;
  PassProp: any;
  custom: "y" | "n";
  child: any;
  form?: FormHook;
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
}) => {
  const local = useLocal({
    list: [] as { value: string; label: string }[],
    status: "init" as "init" | "loading" | "ready",
    mod: false,
  });

  useEffect(() => {
    local.status = "loading";
    local.render();
    options().then((result) => {
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
    });
  }, [options]);

  let mod = null as any;
  if (form && !local.mod) {
    local.mod = true;
    mod = modify.bind({
      form,
      change_hook(opt) {
        const result = opt.options;
        if (result) {
          local.list = result.map((e) => {
            if (typeof e === "string") {
              return {
                value: e,
                label: e,
              };
            }
            return e;
          });
          local.render();
        }
      },
    });
    init_modify(mod);
  }

  return (
    <div className="c-flex c-flex-1">
      {!!local.list &&
        local.list.map((item, index) => {
          if (custom === "y" && form)
            return (
              <PassProp
                data={form.hook.getValues()}
                modify={mod}
                is_active={item.value === value}
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
