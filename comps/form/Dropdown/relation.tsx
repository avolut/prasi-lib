import { Popover } from "@/comps/custom/Popover";
import { Input } from "@/comps/ui/input";
import { Skeleton } from "@/comps/ui/skeleton";
import { useLocal } from "@/utils/use-local";
import { ChevronDown } from "lucide-react";
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
    status: "loading" as "loading" | "ready",
    open: false,
    ref: { input: null as null | HTMLInputElement },
    list: [] as FieldListItem[],
    input: "",
    label: "",
    filter: "",
    pk: "",
  });

  useEffect(() => {
    (async () => {
      if (form) {
        local.status = "loading";
        local.render();
        const table_fn = (db as any)[relation.table];
        const select = {} as any;
        local.pk = "";
        for (const f of relation.fields) {
          if (f.startsWith("::")) {
            select[f.substring(2)] = true;
            local.pk = f.substring(2);
          } else {
            select[f] = true;
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
              if (k !== local.pk) label.push(v);
            }
            return { value: item[local.pk], label: label.join(" - ") };
          });
        }

        const found = local.list.find((e) => e.value === value);
        if (found) {
          local.label = found.label;
        }

        local.status = "ready";
        local.render();
      }
    })();
  }, [relation]);

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
