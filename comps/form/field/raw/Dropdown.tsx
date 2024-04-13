import { Popover } from "@/comps/custom/Popover";
import { useLocal } from "@/utils/use-local";
import { ChevronDown } from "lucide-react";
import { FC, ReactNode } from "react";

type OptionItem = { value: string; label: string; el?: ReactNode };

export const RawDropdown: FC<{
  options: OptionItem[];
  className?: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}> = ({ value, options, className, onFocus, onBlur, onChange }) => {
  const local = useLocal({
    open: false,
    input: {
      value: "",
      el: null as any,
    },
    filter: "",
    width: 0,
    selected: undefined as undefined | OptionItem,
  });

  let filtered = options;

  if (local.filter) {
    filtered = options.filter((e) => {
      if (e.label.toLowerCase().includes(local.filter)) return true;
      return false;
    });
  }
  local.selected = options.find((e) => e.value === value);

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
              width: ${local.width || 100}px;
            `
          )}
        >
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
                    idx === filtered.length - 1 && "c-rounded-b-sm"
                  )}
                  onClick={() => {
                    if (onChange) onChange(item.value);
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </>
        </div>
      }
    >
      <div
        className={cx(
          "c-relative",
          className,
          css`
            cursor: pointer !important;
          `
        )}
        tabIndex={0}
        onFocus={() => {
          local.open = true;
          if (local.selected) local.input.value = local.selected.label;
          local.filter = "";
          local.render();
          setTimeout(() => {
            local.input.el?.focus();
          });
        }}
        ref={(el) => {
          if (local.width === 0 && el) {
            const box = el.getBoundingClientRect();
            if (box && box.width) {
              local.width = box.width;
              local.render();
            }
          }
        }}
      >
        <div className="c-w-full c-h-full c-relative">
          <input
            spellCheck={false}
            value={local.open ? local.input.value : "Halo"}
            className={cx(
              "c-absolute c-inset-0 c-w-full c-h-full c-outline-none c-p-0",
              local.open
                ? "c-cursor-pointer"
                : "c-pointer-events-none c-invisible"
            )}
            onChange={(e) => {
              local.input.value = e.currentTarget.value;
              local.filter = local.input.value.toLowerCase();
              local.render();
            }}
            ref={(el) => {
              local.input.el = el;
            }}
            type="text"
            onFocus={onFocus}
            onBlur={onBlur}
          />

          {!local.open && local.selected && (
            <div className="c-absolute c-inset-0 c-z-10 c-w-full c-h-full c-text-sm c-flex c-items-center">
              {local.selected.el || local.selected.label}
            </div>
          )}
        </div>
        <div
          className={cx(
            "c-absolute c-pointer-events-none c-z-10 c-inset-0 c-left-auto c-flex c-items-center ",
            "c-bg-white c-justify-center c-w-6 c-mr-1 c-my-2"
          )}
        >
          <ChevronDown size={14} />
        </div>
      </div>
    </Popover>
  );
};
