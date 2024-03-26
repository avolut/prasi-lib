import capitalize from "lodash.capitalize";
import { GFCol } from "../utils";
import { gen_columns } from "./columns";
import { newField } from "./new_field";
import { on_load } from "./on_load";

export const gen_table = (modify: (data: any) => void, data: any) => {
  const table = JSON.parse(data.gen_table.value) as string;
  const fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const select = {} as any;
  const columns = [] as GFCol[];
  let pk = "";
  let pks: Record<string, string> = {};

  for (const f of fields) {
    if (typeof f === "string") {
      const col = JSON.parse(f) as GFCol;
      columns.push(col);
      select[col.name] = true;
      if (col.is_pk) pk = col.name;
    } else {
      const col = JSON.parse(f.value) as GFCol;
      const subsel: any = {};
      for (const s of f.checked) {
        const sel = JSON.parse(s) as GFCol;
        if (sel.is_pk) {
          pks[col.name] = sel.name;
          col.relation = { table: col.name, pk: sel.name };
        }
        subsel[sel.name] = true;
      }
      select[col.name] = { select: subsel };
      columns.push(col);
    }
  }

  const result = {} as any;
  if (data["columns"]) {
    result["columns"] = data["columns"];
    result["columns"].value = gen_columns(columns);
  }
  if (data["on_load"]) {
    result["on_load"] = data["on_load"];
    result["on_load"].value = on_load({ pk, table, select, pks });
  }
  if (data["child"]) {
    result["child"] = data["child"];
    result["child"].content.childs = newField(select, pks);
  }
  modify(result);

  alert("Prop Generated!");
};

const formatName = (name: string) => {
  return name
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
