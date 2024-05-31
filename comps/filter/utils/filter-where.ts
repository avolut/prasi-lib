import { getPathname } from "lib/utils/pathname";
import { filter_window } from "./types";

export const filterWhere = (filter_name: string) => {
  const pf = filter_window.prasi_filter?.[getPathname()]?.[filter_name];
  const where: any = {};
  const AND: any[] = [];

  if (pf) {
    for (const [k, filter] of Object.entries(pf)) {
      for (const [name, value] of Object.entries(filter.data)) {
        const type = filter.types[name];
        const modifier = filter.modifiers[name];

        switch (type) {
          case "text":
            {
              if (modifier === "contains")
                where[name] = {
                  contains: value,
                  mode: "insensitive",
                };
            }
            break;
          case "date": {
            let is_value_valid = false;
            // TODO: pastikan value bisa diparse pakai any-date-parser
            if (is_value_valid) {
              if (modifier === "between") {
                AND.push({ [name]: { gt: value } });
                AND.push({ [name]: { lt: value } });
              }
            }
          }
        }
      }
    }
    if (AND.length > 0) where.AND = AND;
  }
  return where;
};
