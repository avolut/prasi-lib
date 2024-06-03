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
                  contains: "%" + value + "%",
                  mode: "insensitive",
                };
              else if (modifier === "starts_with")
                where[name] = {
                  contains: value + "%",
                  mode: "insensitive",
                };
              else if (modifier === "ends_with")
                where[name] = {
                  contains: "%" + value,
                  mode: "insensitive",
                };
              else if (modifier === "not_equal") {
                where[name] = {
                  NOT: value,
                };
              } else if (modifier === "equal") {
                where[name] = {
                  value,
                };
              }
            }
            break;
          case "date":
            {
              let is_value_valid = false;
              // TODO: pastikan value bisa diparse pakai any-date-parser
              if (is_value_valid) {
                if (modifier === "between") {
                  AND.push({ [name]: { gt: value } });
                  AND.push({ [name]: { lt: value } });
                } else if (modifier === "greater_than") {
                  AND.push({ [name]: { gt: value } });
                } else if (modifier === "less_than") {
                  AND.push({ [name]: { lt: value } });
                }
              }
            }
            break;
          case "number":
            {
              if (modifier === "equal") {
                AND.push({ [name]: { value } });
              } else if (modifier === "not_equal") {
                AND.push({ [name]: { NOT: value } });
              } else if (modifier === "greater_than") {
                AND.push({ [name]: { gt: value } });
              } else if (modifier === "less_than") {
                AND.push({ [name]: { lt: value } });
              } else if (modifier === "between") {
                AND.push({ [name]: { gt: value } });
                AND.push({ [name]: { lt: value } });
              }
            }
            break;
          case "boolean":
            {
              if (modifier === "is_true") {
                AND.push({ [name]: true });
              } else if (modifier === "is_false") {
                AND.push({ [name]: false });
              }
            }
            break;
          case "options":
            {
              if (modifier === "equal") {
                AND.push({ [name]: { value } });
              } else if (modifier === "not_equal") {
                AND.push({ [name]: { NOT: value } });
              } else if (modifier === "includes") {
                AND.push({ [name]: { hasEvery: value } });
              } else if (modifier === "excludes") {
                AND.push({ [name]: { notIn: value } });
              }
            }
            break;
        }
      }
    }
    if (AND.length > 0) where.AND = AND;
  }
  return where;
};
