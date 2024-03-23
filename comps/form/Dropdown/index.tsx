import { Popover } from "@/comps/custom/Popover";
import { Input } from "@/comps/ui/input";
import { useLocal } from "@/utils/use-local";
import { ChevronDown } from "lucide-react";
import { FC, useEffect } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FieldListItem, FieldOptions } from "../type";
import { FormHook } from "../utils/utils";
import { Skeleton } from "@/comps/ui/skeleton";

export const Dropdown: FC<
  ControllerRenderProps<FieldValues, string> & {
    options: FieldOptions;
    form?: FormHook;
    name: string;
  }
> = ({ value, options, form, name }) => {
  const local = useLocal({
    status: "loading" as "loading" | "ready",
    open: false,
    ref: { input: null as null | HTMLInputElement },
    list: [] as FieldListItem[],
    input: "",
    label: "",
    filter: "",
  });

  useEffect(() => {
    if (form) {
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

        const found = local.list.find((e) => e.value === value);
        if (found) {
          local.label = found.label;
        }

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

  let filtered = local.list;

  if (local.filter) {
    filtered = local.list.filter((e) => {
      if (e.value.toLowerCase().includes(local.filter)) return true;
      return false;
    });
  }

  return (
    <Popover
      open={local.open}
      onOpenChange={() => {
        local.open = false;
        local.render();
      }}
      arrow={false}
      className={cx("c-rounded-sm c-bg-white")}
      content={
        <div
          className={cx(
            "c-text-sm",
            css`
              width: ${local.ref.input?.clientWidth || 100}px;
            `
          )}
        >
          {local.status === "loading" && (
            <>
              <div className="c-flex c-flex-col c-space-y-1 c-px-3 c-py-2">
                <Skeleton className="c-h-[10px] c-w-[90px]" />
                <Skeleton className="c-h-[10px] c-w-[60px]" />
              </div>
            </>
          )}
          {local.status === "ready" && (
            <>
              {filtered.map((item, idx) => {
                return (
                  <div
                    tabIndex={0}
                    key={item.value + "_" + idx}
                    className={cx(
                      "c-px-3 c-py-1 cursor-pointer option-item",
                      item.value === value
                        ? "c-bg-blue-600 c-text-white"
                        : "hover:c-bg-blue-50",
                      idx > 0 && "c-border-t",
                      idx === 0 && "c-rounded-t-sm",
                      idx === local.list.length - 1 && "c-rounded-b-sm"
                    )}
                    onClick={() => {
                      if (form) {
                        local.open = false;
                        form.hook.setValue(name, item.value);
                        form.render();
                      }
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </>
          )}
        </div>
      }
    >
      <div
        className={cx(
          "c-relative",
          css`
            cursor: pointer !important;
          `
        )}
        tabIndex={0}
        onFocus={() => {
          local.open = true;
          local.input = local.label;
          local.filter = "";
          local.render();
          setTimeout(() => {
            local.ref.input?.focus();
          });
        }}
      >
        <div className="c-absolute c-pointer-events-none c-inset-0 c-left-auto c-flex c-items-center c-pr-4">
          <ChevronDown size={14} />
        </div>
        <Input
          spellCheck={false}
          value={local.open ? local.input : ""}
          className={cx(
            local.open ? "c-cursor-pointer" : "c-pointer-events-none"
          )}
          onChange={(e) => {
            local.input = e.currentTarget.value;
            local.filter = local.input.toLowerCase();
            local.render();
          }}
          ref={(el) => {
            local.ref.input = el;
          }}
          type="text"
        />
        {!local.open && (
          <div className="c-absolute c-text-sm c-inset-0 c-px-3 c-flex c-items-center">
            {local.label}
          </div>
        )}
      </div>
    </Popover>
  );
};
