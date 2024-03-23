import { Popover } from "@/comps/custom/Popover";
import { Input } from "@/comps/ui/input";
import { useLocal } from "@/utils/use-local";
import { ChevronDown } from "lucide-react";
import { FC } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

export const Dropdown: FC<ControllerRenderProps<FieldValues, string>> = ({
  value,
}) => {
  const local = useLocal({
    open: false,
    ref: { input: null as null | HTMLInputElement },
  });
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
            "c-px-3 c-py-2",
            css`
              width: ${local.ref.input?.clientWidth || 100}px;
            `
          )}
        ></div>
      }
    >
      <div
        className={cx(
          "c-relative",
          css`
            cursor: pointer !important;
          `
        )}
      >
        <div className="c-absolute c-pointer-events-none c-inset-0 c-left-auto c-flex c-items-center c-pr-4">
          <ChevronDown size={14} />
        </div>
        <Input
          spellCheck={false}
          onFocus={() => {
            local.open = true;
            local.render();
          }}
          className="cursor-pointer"
          ref={(el) => {
            local.ref.input = el;
          }}
          type="text"
        />
      </div>
    </Popover>
  );
};
