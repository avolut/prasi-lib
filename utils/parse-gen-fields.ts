import { GFCol } from "lib/gen/utils";

export const parseGenFields = (gen_fields: any) => {
  const fields_map = new Map<string, (GFCol & { checked?: GFCol[] })[]>();
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
  }
  return fields_map;
};
