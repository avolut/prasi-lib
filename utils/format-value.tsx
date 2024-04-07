import { GFCol } from "@/gen/utils";
import { FC } from "react";

export const fields_map = new Map<string, (GFCol & { checked?: GFCol[] })[]>();

export const FormatValue: FC<{
  value: any;
  name: string;
  gen_fields: string[];
}> = (prop) => {
  const { value, gen_fields, name } = prop;

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
            checked: e.checked.map(JSON.parse),
          };
        }
      })
    );
  }

  const fields = fields_map.get(gf);

  if (typeof value === "object" && value) {
    const rel = fields?.find((e) => e.name === name);
    if (rel && rel.checked) {
      const result = rel.checked
        .filter((e) => !e.is_pk)
        .map((e) => {
          return value[e.name];
        })
        .join(" - ");

      if (Array.isArray(value)) {
        const len = value.length;
        if (len === 0) return ` - `;
        return `${len} item${len > 1 ? "s" : ""}`;
      }
      return result;
    }

    return JSON.stringify(value);
  }
  return <>{value}</>;
};
