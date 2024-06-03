import { useLocal } from "lib/utils/use-local";
import { ChevronDown, X } from "lucide-react";
import { FC, KeyboardEvent, useCallback, useEffect, useRef } from "react";
import { Badge } from "./badge";
import { TypeaheadOptions } from "./typeahead-opt";

export const Typeahead: FC<{
  value?: string[];
  placeholder?: string;
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
  onChange?: (selected: string[]) => void;
  unique?: boolean;
  allowNew?: boolean;
  localSearch?: boolean;
  autoPopupWidth?: boolean;
  focusOpen?: boolean;
  disabled?: boolean;
  mode?: "multi" | "single";
}> = ({
  value,
  options: options_fn,
  onSelect,
  unique,
  allowNew: allow_new,
  focusOpen: on_focus_open,
  localSearch: local_search,
  autoPopupWidth: auto_popup_width,
  placeholder,
  mode,
  disabled,
  onChange,
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
    allow_new: typeof allow_new === "undefined" ? false : allow_new,
    on_focus_open: typeof on_focus_open === "undefined" ? true : on_focus_open,
    local_search: typeof local_search === "undefined" ? true : local_search,
    mode: typeof mode === "undefined" ? "multi" : mode,
    auto_popup_width:
      typeof auto_popup_width === "undefined" ? false : auto_popup_width,
    select: null as null | { value: string; label: string },
  });
  const input = useRef<HTMLInputElement>(null);

  let select_found = false;
  let options = [...(local.search.result || local.options)];
  if (local.allow_new && local.search.input) {
    options.push({ value: local.search.input, label: local.search.input });
  }
  const added = new Set<string>();
  if (local.mode === "multi") {
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
  }

  useEffect(() => {
    if (!isEditor) {
      if (typeof value === "object" && value) {
        local.value = value;
        local.render();
      }
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
          return result;
        } else {
          return false;
        }
      } else {
        let val = false as any;
        if (arg.item) {
          local.value.push(arg.item.value);
          val = arg.item.value;
        } else {
          if (!arg.search) return false;
          local.value.push(arg.search);
          val = arg.search;
        }

        if (typeof onChange === "function") {
          onChange(local.value);
        }
        local.render();
        return val;
      }
      return true;
    },
    [onSelect, local.value, options]
  );

  const keydown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!local.open) {
        e.preventDefault();
        e.stopPropagation();
        local.open = true;
        local.render();
        return;
      }

      if (e.key === "Backspace") {
        if (local.value.length > 0 && e.currentTarget.selectionStart === 0) {
          local.value.pop();
          local.render();
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        const selected = select({
          search: local.search.input,
          item: local.select,
        });

        if (local.mode === "single") {
          local.open = false;
        }
        if (typeof selected === "string") {
          resetSearch();
          if (local.mode === "single") {
            const item = local.options.find((item) => item.value === selected);
            if (item) {
              local.search.input = item.label;
            }
          }
        }
        local.render();

        return;
      }
      if (options.length > 0) {
        local.open = true;
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
            if (idx - 1 >= 0) {
              local.select = options[idx - 1];
            } else {
              local.select = options[options.length - 1];
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

  if (local.mode === "single" && local.value.length > 1) {
    local.value = [local.value.pop() || ""];
  }
  const valueLabel = local.value.map((value) => {
    const item = local.options.find((item) => item.value === value);

    if (local.mode === "single") {
      if (!local.open) {
        local.select = item || null;
        local.search.input = item?.label || "";
      }
    }
    return item;
  });

  return (
    <div
      className={cx(
        local.mode === "single" ? "c-cursor-pointer" : "c-cursor-text",
        "c-flex c-relative c-space-x-2 c-flex-wrap c-pt-2 c-px-2 c-pb-0 c-items-center c-w-full c-h-full c-flex-1"
      )}
      onClick={() => {
        input.current?.focus();
      }}
    >
      {local.mode === "multi" ? (
        <>
          {valueLabel.map((e, idx) => {
            return (
              <Badge
                key={idx}
                variant={"outline"}
                className="c-space-x-1 c-mb-2 c-cursor-pointer hover:c-bg-red-100"
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  local.value = local.value.filter((val) => e?.value !== val);
                  local.render();
                  input.current?.focus();
                }}
              >
                <div>{e?.label}</div>
                <X size={12} />
              </Badge>
            );
          })}
        </>
      ) : (
        <></>
      )}

      <TypeaheadOptions
        popup={true}
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

          resetSearch();
          if (local.mode === "single") {
            const item = local.options.find((item) => item.value === value);
            if (item) {
              local.search.input = item.label;
              
              select({
                search: local.search.input,
                item,
              });
            }
          }

          local.render();
        }}
        width={local.auto_popup_width ? input.current?.offsetWidth : undefined}
        selected={({ item, options, idx }) => {
          if (item.value === local.select?.value) {
            return true;
          }
          return false;
        }}
      >
        <input
          placeholder={local.mode === "multi" ? placeholder : ""}
          type="text"
          ref={input}
          value={local.search.input}
          onClick={(e) => {
            e.stopPropagation();

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

                  if (
                    local.search.result.length > 0 &&
                    !local.search.result.find(
                      (e) => e.value === local.select?.value
                    )
                  ) {
                    local.select = local.search.result[0];
                  }
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
                    } else {
                      local.search.result = result.map((item) => {
                        if (typeof item === "string")
                          return { value: item, label: item };
                        return item;
                      });
                      local.search.searching = false;
                    }

                    if (
                      local.search.result.length > 0 &&
                      !local.search.result.find(
                        (e) => e.value === local.select?.value
                      )
                    ) {
                      local.select = local.search.result[0];
                    }

                    local.render();
                  }
                }, 100);
              }
            }
          }}
          spellCheck={false}
          className={cx(
            "c-flex-1 c-mb-2 c-text-sm c-outline-none",
            local.mode === "single" ? "c-cursor-pointer" : ""
          )}
          onKeyDown={keydown}
        />
      </TypeaheadOptions>

      {local.mode === "single" && (
        <div
          className={cx(
            "c-absolute c-pointer-events-none c-z-10 c-inset-0 c-left-auto c-flex c-items-center ",
            "c-bg-white c-justify-center c-w-6 c-mr-1 c-my-2",
            disabled && "c-hidden"
          )}
        >
          <ChevronDown size={14} />
        </div>
      )}
    </div>
  );
};