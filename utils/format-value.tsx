import { GFCol } from "@/gen/utils";
import { FC } from "react";

export const fields_map = new Map<string, (GFCol & { checked?: GFCol[] })[]>();

export const FormatValue: FC<{
  value: any;
  name: string;
  gen_fields: string[];
  tree_depth?: number;
}> = (prop) => {
  const { value, gen_fields, name, tree_depth } = prop;
  if (gen_fields) {
    const gf = JSON.stringify(gen_fields);
    if (!fields_map.has(gf)) {
      fields_map.set(
        gf,
        gen_fields.map((e: any) => {
          if (typeof e === "string") {
            return JSON.parse(e);
          } else {
            return {
              ...JSON.parse(e.value),
              checked: e.checked.map((ex: any) => {
                if (typeof ex === "string") {
                  return JSON.parse(e.value);
                }
                try {
                  return JSON.parse(ex["value"]);
                } catch (em) {
                  return null;
                }
              }),
            };
          }
        })
      );
    }

    const fields = fields_map.get(gf);
    if (Array.isArray(value)) {
      return `${value.length} item${value.length > 1 ? "s" : ""}`;
    } else if (typeof value === "object" && value) {
      const rel = fields?.find((e) => e.name === name);
      if (rel && rel.checked) {
        if (rel.type === "has-one") {
          const result = [];
          for (const [k, v] of Object.entries(value) as any) {
            if (!k.toLowerCase().includes("id")) result.push(v);
          }
          return result.join(" - ");
        }
        if (Array.isArray(value)) {
          const len = value.length;
          if (len === 0) return ` - `;
          return `${len} item${len > 1 ? "s" : ""}`;
        }
      }
      return JSON.stringify(value);
    } else {
    }
  }

  let prefix = <></>;
  if (typeof tree_depth === "number" && tree_depth > 0) {
    prefix = (
      <div
        className={css`
          padding-left: ${tree_depth * 5}px;
        `}
      >
        <div
          className={cx(
            " c-border-l c-border-b c-border-black c-w-[10px] c-h-[15px]",
            css`
              margin-top: -10px;
            `
          )}
        ></div>
      </div>
    );
  }

  return (
    <div className="c-flex c-space-x-2 c-items-center">
      {prefix}
      <div>{value}</div>
    </div>
  );
};
