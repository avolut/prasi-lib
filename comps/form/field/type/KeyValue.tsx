import { update } from "autosize";
import { useLocal } from "lib/utils/use-local";
import { useEffect, useRef } from "react";

export const KeyValue = ({
  value,
  onChange,
  index,
}: {
  value: any;
  onChange: (val: any) => void;
  index?: "preserve" | "auto-sort";
}) => {
  const local = useLocal({
    entries: [] as [string, string][],
    new: { idx: -1, key: "", value: "" },
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let entries: any[] = [];
    if (index === "preserve") {
      if (Array.isArray(value)) {
        local.entries = value;
      } else {
        local.entries = Object.entries(value);
      }
    }

    if (local.entries.length > 0) {
      entries.forEach(([k, v], idx) => {
        const found = local.entries.find((e) => {
          if (e[0] === k) return true;
          return false;
        });
        if (found) {
          found[0] = k;
          found[1] = v;
        } else {
          local.entries.push([k, v]);
        }
      });
    } else {
      local.entries = entries;
    }

    local.render();
  }, [value]);

  if (typeof value !== "object") return null;

  const reverseEntries = (input: [string, unknown][]) => {
    return input
      .filter(([k, v]) => {
        return true; // some irrelevant conditions here
      })
      .reduce((accum: any, [k, v]) => {
        accum[k] = v;
        return accum;
      }, {});
  };
  return (
    <div className="c-flex c-relative c-flex-1" ref={ref}>
      <table
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={cx(
          "c-flex-1",
          css`
            input {
              width: 100%;
              height: 100%;
              outline: none;
              padding: 5px 10px;
              border: 1px solid transparent;
              &:focus {
                border: 1px solid #1c4ed8;
                outline: 1px solid #1c4ed8;
              }
            }
          `
        )}
      >
        <tbody>
          {local.entries.map((item, idx) => (
            <KVRow
              key={idx}
              item={item}
              idx={idx}
              update={(idx, k, v) => {
                local.entries[idx] = [k, v];

                if (k === "" && v === "") {
                  local.entries.splice(idx, 1);
                }

                local.render();
              }}
              onBlur={() => {
                if (index === "preserve") {
                  onChange([...local.entries]);
                } else {
                  onChange(reverseEntries(local.entries));
                }
              }}
            />
          ))}
          <KVRow
            item={[local.new.key, local.new.value]}
            idx={local.entries.length}
            update={(idx, k, v) => {
              local.new.key = k;
              local.new.value = v;
              local.render();
            }}
            onBlur={(field, val) => {
              if (field === "key" && val) {
                const idx = local.entries.length;
                local.entries[idx] = [local.new.key, local.new.value];
                local.new.key = "";
                local.new.value = "";
                local.render();
                if (index === "preserve") {
                  onChange([...local.entries]);
                } else {
                  onChange(reverseEntries(local.entries));
                }
                setTimeout(() => {
                  (
                    ref?.current?.querySelector(
                      `.kv-row-${idx} .kv-value input`
                    ) as HTMLInputElement
                  )?.focus();
                }, 10);
              }
            }}
          />
        </tbody>
      </table>
    </div>
  );
};

const KVRow = ({
  item,
  idx,
  update,
  onBlur,
}: {
  item: [string, unknown];
  idx: number;
  update: (idx: number, key: string, value: string) => void;
  onBlur?: (field: "key" | "value", val: string) => void;
}) => {
  const [k, v] = item as any;
  const keyref = useRef<HTMLInputElement>(null);
  const valref = useRef<HTMLInputElement>(null);

  return (
    <tr className={`kv-row-${idx}`}>
      <td
        className={cx(
          "kv-key",
          css`
            border-right: 1px solid #ececeb;
            width: 35%;
          `,
          idx > 0 &&
            css`
              border-top: 1px solid #ececeb;
            `
        )}
      >
        <input
          type="text"
          spellCheck={false}
          value={k}
          onChange={(e) => {
            update(idx, e.currentTarget.value, v || "");
          }}
          onBlur={
            onBlur
              ? (e) => {
                  onBlur("key", e.currentTarget.value);
                }
              : undefined
          }
          ref={keyref}
        ></input>
      </td>
      <td
        className={cx(
          "kv-value",
          idx > 0 &&
            css`
              border-top: 1px solid #ececeb;
            `
        )}
      >
        <input
          type="text"
          spellCheck={false}
          value={v || ""}
          onChange={(e) => {
            update(idx, k, e.currentTarget.value || "");
          }}
          onKeyUp={(e) => {
            if (e.key === "Backspace" && !e.currentTarget.value) {
              keyref.current?.focus();
            }
          }}
          onBlur={
            onBlur
              ? (e) => {
                  onBlur("value", e.currentTarget.value);
                }
              : undefined
          }
          ref={valref}
        ></input>
      </td>
    </tr>
  );
};
