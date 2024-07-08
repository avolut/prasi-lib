import { FC } from "react";
import { Popover } from "../custom/Popover";
import { useLocal } from "lib/utils/use-local";

export type OptionItem = { value: string; label: string };
export const TypeaheadOptions: FC<{
  popup?: boolean;
  open?: boolean;
  children: any;
  onOpenChange?: (open: boolean) => void;
  options: OptionItem[];
  className?: string;
  showEmpty: boolean;
  selected?: (arg: {
    item: OptionItem;
    options: OptionItem[];
    idx: number;
  }) => boolean;
  onSelect?: (value: string) => void;
  searching?: boolean;
  width?: number;
}> = ({
  popup,
  children,
  open,
  onOpenChange,
  className,
  options,
  selected,
  onSelect,
  searching,
  showEmpty,
  width,
}) => {
  if (!popup) return children;
  const local = useLocal({
    selectedIdx: 0,
  });

  let content = (
    <div
      className={cx(
        className,
        width
          ? css`
              min-width: ${width}px;
            `
          : css`
              min-width: 150px;
            `,
        css`
          max-height: 400px;
          overflow: auto;
        `
      )}
    >
      {options.map((item, idx) => {
        const is_selected = selected?.({ item, options, idx });

        if (is_selected) {
          local.selectedIdx = idx;
        }

        return (
          <div
            tabIndex={0}
            key={item.value + "_" + idx}
            className={cx(
              "opt-item c-px-3 c-py-1 cursor-pointer option-item text-sm",
              is_selected ? "c-bg-blue-600 c-text-white" : "hover:c-bg-blue-50",
              idx > 0 && "c-border-t"
            )}
            onClick={() => {
              onSelect?.(item.value);
            }}
          >
            {item.label || <>&nbsp;</>}
          </div>
        );
      })}

      {searching ? (
        <div className="c-px-4 c-w-full c-text-xs c-text-slate-400">
          Loading...
        </div>
      ) : (
        <>
          {options.length === 0 && (
            <div className="c-p-4 c-w-full c-text-center c-text-sm c-text-slate-400">
              &mdash; Empty &mdash;
            </div>
          )}
        </>
      )}
    </div>
  );

  if (!showEmpty && options.length === 0) content = <></>;

  return (
    <Popover
      open={open}
      arrow={false}
      onOpenChange={onOpenChange}
      backdrop={false}
      placement="bottom-start"
      className="c-flex-1"
      content={content}
    >
      {children}
    </Popover>
  );
};
