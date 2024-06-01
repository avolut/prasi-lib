import { useLocal } from "lib/utils/use-local";
import { X } from "lucide-react";
import { FC, KeyboardEvent, useCallback, useEffect, useRef } from "react";
import { Popover } from "../custom/Popover";
import { Badge } from "./badge";

export const Typeahead: FC<{
  value?: string[];
  options?: (arg: {
    search: string;
    existing: { value: string; label: string }[];
  }) =>
    | (string | { value: string; label: string })[]
    | Promise<(string | { value: string; label: string })[]>;
  onSelect?: (arg: {
    search: string;
    item?: null | { value: string; label: string };
  }) => string | false;
  unique?: boolean;
  allowNew?: boolean;
  localSearch?: boolean;
  focusOpen?: boolean;
}> = ({
  value,
  options: options_fn,
  onSelect,
  unique,
  allowNew: allow_new,
  focusOpen: on_focus_open,
  localSearch: local_search,
}) => {
  const local = useLocal({
    value: [] as string[],
    open: false,
    options: [] as { value: string; label: string }[],
    loaded: false,
    search: {
      input: "",
      timeout: null as any,
      searching: false,
      promise: null as any,
      result: null as null | { value: string; label: string }[],
    },
    unique: typeof unique === "undefined" ? true : unique,
    allow_new: typeof allow_new === "undefined" ? true : allow_new,
    on_focus_open: typeof on_focus_open === "undefined" ? false : on_focus_open,
    local_search: typeof local_search === "undefined" ? true : local_search,
    select: null as null | { value: string; label: string },
  });
  const input = useRef<HTMLInputElement>(null);

  let select_found = false;
  let options = [...(local.search.result || local.options)];
  if (local.allow_new && local.search.input) {
    options.push({ value: local.search.input, label: local.search.input });
  }
  const added = new Set<string>();
  options = options.filter((e) => {
    if (!added.has(e.value)) added.add(e.value);
    else return false;
    if (local.select && local.select.value === e.value) select_found = true;
    if (local.unique) {
      if (local.value.includes(e.value)) {
        return false;
      }
    }
    return true;
  });

  if (!select_found) {
    local.select = options[0];
  }

  useEffect(() => {
    if (typeof value === "object" && value) {
      local.value = value;
      local.render();
    }
  }, [value]);

  const select = useCallback(
    (arg: {
      search: string;
      item?: null | { value: string; label: string };
    }) => {
      if (!local.allow_new) {
        let found = null;
        if (!arg.item) {
          found = options.find((e) => e.value === arg.search);
        } else {
          found = options.find((e) => e.value === arg.item?.value);
        }
        if (!found) {
          return false;
        }
      }

      if (local.unique) {
        let found = local.value.find((e) => {
          return e === arg.item?.value || arg.search === e;
        });
        if (found) {
          return false;
        }
      }

      if (typeof onSelect === "function") {
        const result = onSelect(arg);

        if (result) {
          local.value.push(result);
          local.render();
        } else {
          return false;
        }
      } else {
        if (arg.item) {
          local.value.push(arg.item.value);
        } else {
          if (!arg.search) return false;
          local.value.push(arg.search);
        }
        local.render();
      }
      return true;
    },
    [onSelect, local.value, options]
  );

  const keydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (local.value.length > 0 && e.currentTarget.selectionStart === 0) {
          local.value.pop();
          local.render();
        }
      }
      if (e.key === "Enter") {
        const selected = select({
          search: local.search.input,
          item: local.select,
        });

        if (selected) {
          resetSearch();
          local.render();
        }
      }
      if (options.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const idx = options.findIndex((item) => {
            if (item.value === local.select?.value) return true;
          });
          if (idx >= 0) {
            if (idx + 1 <= options.length) {
              local.select = options[idx + 1];
            } else {
              local.select = options[0];
            }
          } else {
            local.select = options[0];
          }
          local.render();
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();

          const idx = options.findIndex((item) => {
            if (item.value === local.select?.value) return true;
          });
          if (idx >= 0) {
            if (idx + 1 < options.length) {
              local.select = options[idx + 1];
            } else {
              local.select = options[0];
            }
          } else {
            local.select = options[0];
          }
          local.render();
        }
      }
    },
    [local.value, local.select, select, options, local.search.input]
  );

  const openOptions = useCallback(async () => {
    if (typeof options_fn === "function") {
      local.loaded = true;
      const res = options_fn({
        search: local.search.input,
        existing: local.options,
      });
      if (res) {
        const applyOptions = (
          result: (string | { value: string; label: string })[]
        ) => {
          local.options = result.map((item) => {
            if (typeof item === "string") return { value: item, label: item };
            return item;
          });
          local.render();
        };
        if (res instanceof Promise) {
          applyOptions(await res);
        } else {
          applyOptions(res);
        }
      }
    }
  }, [options_fn]);

  const resetSearch = () => {
    local.search.searching = false;
    local.search.input = "";
    local.search.promise = null;
    local.search.result = null;
    local.select = null;
    clearTimeout(local.search.timeout);
  };

  return (
    <div
      className={cx(
        "c-flex c-cursor-text c-space-x-2 c-flex-wrap c-p-2 c-pb-0 c-items-center c-w-full c-h-full c-flex-1",
        css`
          min-height: 40px;
        `
      )}
      onClick={() => {
        input.current?.focus();
      }}
    >
      {local.value.map((e, idx) => {
        return (
          <Badge
            key={idx}
            variant={"outline"}
            className="c-space-x-1 c-mb-2 c-cursor-pointer hover:c-bg-red-100"
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              local.value = local.value.filter((val) => e !== val);
              local.render();
              input.current?.focus();
            }}
          >
            <div>{e}</div>
            <X size={12} />
          </Badge>
        );
      })}

      <WrapOptions
        wrap={true}
        onOpenChange={(open) => {
          if (!open) {
            local.select = null;
          }
          local.open = open;
          local.render();
        }}
        open={local.open}
        options={options}
        searching={local.search.searching}
        onSelect={(value) => {
          local.open = false;
          local.value.push(value);
          resetSearch();
          local.render();
        }}
        selected={local.select?.value}
      >
        <input
          type="text"
          ref={input}
          value={local.search.input}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onFocus={(e) => {
            if (!local.open) {
              if (local.on_focus_open) {
                openOptions();
                local.open = true;
                local.render();
              }
            }
          }}
          onChange={async (e) => {
            const val = e.currentTarget.value;
            if (!local.open) {
              local.open = true;
            }
            local.search.input = val;
            local.render();

            if (local.search.promise) {
              await local.search.promise;
            }

            local.search.searching = true;
            local.render();

            if (local.search.searching) {
              if (local.local_search) {
                if (!local.loaded) {
                  await openOptions();
                }
                const search = local.search.input.toLowerCase();
                if (search) {
                  local.search.result = local.options.filter((e) =>
                    e.label.toLowerCase().includes(search)
                  );
                } else {
                  local.search.result = null;
                }
                local.search.searching = false;
                local.render();
              } else {
                clearTimeout(local.search.timeout);
                local.search.timeout = setTimeout(async () => {
                  const result = options_fn?.({
                    search: local.search.input,
                    existing: local.options,
                  });
                  if (result) {
                    if (result instanceof Promise) {
                      local.search.promise = result;
                      local.search.result = (await result).map((item) => {
                        if (typeof item === "string")
                          return { value: item, label: item };
                        return item;
                      });
                      local.search.searching = false;
                      local.search.promise = null;
                      local.render();
                    } else {
                      local.search.result = result.map((item) => {
                        if (typeof item === "string")
                          return { value: item, label: item };
                        return item;
                      });
                      local.search.searching = false;
                      local.render();
                    }
                  }
                }, 100);
              }
            }
          }}
          spellCheck={false}
          className={cx("c-flex-1 c-mb-2 c-text-sm c-outline-none")}
          onKeyDown={keydown}
        />
      </WrapOptions>
    </div>
  );
};

const WrapOptions: FC<{
  wrap: boolean;
  children: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: { value: string; label: string }[];
  selected?: string;
  onSelect: (value: string) => void;
  searching?: boolean;
}> = ({
  wrap,
  children,
  open,
  onOpenChange,
  options,
  selected,
  onSelect,
  searching,
}) => {
  if (!wrap) return children;

  return (
    <Popover
      open={open}
      arrow={false}
      onOpenChange={onOpenChange}
      placement="bottom-start"
      content={
        <div
          className={cx(
            css`
              min-width: 150px;
            `
          )}
        >
          {options.map((item, idx) => {
            return (
              <div
                tabIndex={0}
                key={item.value + "_" + idx}
                className={cx(
                  "c-px-3 c-py-1 cursor-pointer option-item",
                  item.value === selected
                    ? "c-bg-blue-600 c-text-white"
                    : "hover:c-bg-blue-50",
                  idx > 0 && "c-border-t"
                )}
                onClick={() => {
                  onSelect(item.value);
                }}
              >
                {item.label}
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
      }
    >
      {children}
    </Popover>
  );
};
