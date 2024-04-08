import { Popover } from "@/comps/custom/Popover";
import { Input } from "@/comps/ui/input";
import { Skeleton } from "@/comps/ui/skeleton";
import { useLocal } from "@/utils/use-local";
import { ChevronDown, Loader2 } from "lucide-react";
import { FC, useEffect } from "react";
import { FieldListItem, FieldOptions } from "../type";
import { FormHook } from "../utils/utils";

type RelationProps = {
  value: string;
  relation: {
    table: string;
    fields: string[];
    query: () => Promise<any>;
  };
  form?: FormHook;
  name: string;
};

export const Relation: FC<RelationProps> = ({
  relation,
  value,
  form,
  name,
}) => {
  const local = useLocal({
    status: "init" as "init" | "loading" | "ready",
    open: false,
    ref: { input: null as null | HTMLInputElement },
    list: [] as FieldListItem[],
    input: "",
    label: "",
    filter: "",
    pk_field: "",
    timeout: null as any,
  });

  useEffect(() => {
    clearTimeout(local.timeout);
    local.timeout = setTimeout(async () => {
      if (form) {
        local.status = "loading";
        local.render();

        if (form.cache[name]) {
          local.pk_field = form.cache[name].pk_field;
          local.list = form.cache[name].list;
        } else {
          const table_fn = (db as any)[relation.table];
          const select = {} as any;
          local.pk_field = "";
          for (const f of relation.fields) {
            if (typeof f === "string") {
              if (f.startsWith("::")) {
                select[f.substring(2)] = true;
                local.pk_field = f.substring(2);
              } else {
                select[f] = true;
              }
            }
          }
          let q = {};

          if (typeof relation.query === "function") {
            q = await relation.query();
          }

          const list = await table_fn.findMany({ select, ...q });
          if (Array.isArray(list)) {
            local.list = list.map((item: any) => {
              let label = [];
              for (const [k, v] of Object.entries(item)) {
                if (k !== local.pk_field) label.push(v);
              }
              return { value: item[local.pk_field], label: label.join(" - ") };
            });
          }
          form.cache[name] = { list: local.list, pk_field: local.pk_field };
        }

        const found = local.list.find((e) => {
          if (typeof value === "object") {
            if (value["connect"]) {
              return e.value === value["connect"][local.pk_field];
            }
            return e.value === value[local.pk_field];
          } else {
            return e.value === value;
          }
        });
        if (found) {
          local.label = found.label;
        }

        local.status = "ready";
        local.render();
      }
    }, 100);
  }, [relation, location.hash, location.pathname, value]);

  let filtered = local.list;

  if (local.filter) {
    filtered = local.list.filter((e) => {
      if (e.label.toLowerCase().includes(local.filter)) return true;
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
            "c-text-sm c-relative c-overflow-auto",
            css`
              width: ${local.ref.input?.clientWidth || 100}px;
              max-height: 300px;
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
            <div className="c-flex c-flex-1 c-flex-col">
              {filtered.map((item, idx) => {
                let is_active = false;
                if (typeof value === "object") {
                  const c = (value as any)?.connect;
                  if (c) {
                    is_active = item.value === c[local.pk_field];
                  }
                } else {
                  is_active = item.value === value;
                }

                return (
                  <div
                    tabIndex={0}
                    key={item.value + "_" + idx}
                    className={cx(
                      "c-px-3 c-py-1 cursor-pointer option-item",
                      is_active
                        ? "c-bg-blue-600 c-text-white"
                        : "hover:c-bg-blue-50",
                      idx > 0 && "c-border-t",
                      idx === 0 && "c-rounded-t-sm",
                      idx === local.list.length - 1 && "c-rounded-b-sm"
                    )}
                    onClick={() => {
                      if (form) {
                        local.open = false;
                        form.hook.setValue(name, {
                          connect: { [local.pk_field]: item.value },
                        });
                        form.render();
                      }
                    }}
                  >
                    {item.label || "-"}
                  </div>
                );
              })}
            </div>
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
            {local.status !== "ready" ? (
              <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
            ) : (
              <> {local.label || "-"}</>
            )}
          </div>
        )}
      </div>
    </Popover>
  );
};
