import { GFCol } from "lib/gen/utils";
import { FilterLocal } from "../utils/types";

export const parseSingleFilter = (filter: FilterLocal, fields: GFCol[]) => {
  const where: any = {};
  const AND: any[] = [];
  const OR: any[] = [];
  if (filter) {
    for (const [name, value] of Object.entries(filter.data)) {
      const type = filter.types[name];
      const modifier = filter.modifiers[name];

      switch (type) {
        case "search-all":
          fields
            .filter(
              (e) =>
                e.type === "varchar" ||
                e.type === "text" ||
                e.type === "string" ||
                e.type === "has-one"
            )
            .map((e) => {
              if (e.type === "has-one") {
                for (const f of e.relation?.fields || []) {
                  if (
                    !f.is_pk &&
                    (f.type === "varchar" ||
                      f.type === "text" ||
                      f.type === "string")
                  ) {
                    OR.push({
                      [e.name]: {
                        [f.name]: {
                          contains: "%" + value + "%",
                          mode: "insensitive",
                        },
                      },
                    });
                  }
                }
              } else {
                OR.push({
                  [e.name]: {
                    contains: "%" + value + "%",
                    mode: "insensitive",
                  },
                });
              }
            });
          break;
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
            let is_value_valid = true;
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
  if (OR.length > 0) where.OR = OR;
  return where;
};
