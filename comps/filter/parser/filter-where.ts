import { GFCol, parseGenField } from "lib/gen/utils";
import { getFilter } from "../utils/get-filter";
import { parseSingleFilter } from "./single-filter";
import { softDeleteFilter } from "./soft-delete-filter";

export const filterWhere = (filter_name: string, p: any) => {
  const f = getFilter(filter_name);
  let where: any = {};
  if (f) {
    let fields: GFCol[] = [];
    //
    if (p.gen__fields) {
      fields = parseGenField(p.gen__fields);
    }
    for (const pf of Object.values(f.filter.ref)) {
      if (pf.mode === "raw") {
        const data = pf.data?._where ? pf.data?._where : pf.data
        for (const [k, v] of Object.entries(data)) {
          where[k] = v;
        }
      } else {
        const w = parseSingleFilter(pf, fields);
        for (const [k, v] of Object.entries(w)) {
          where[k] = v;
        }
      }
    }
  }

  if (p && p.opt__feature && p.sft__fields && p.sft__type) {
    where = softDeleteFilter(where, {
      feature: p.opt_feature,
      field: p.sft__fields,
      type: p.sft__type,
    });
  }
console.log({where})
  return where;
};
