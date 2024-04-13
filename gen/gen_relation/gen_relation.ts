import { codeBuild } from "../master_detail/utils";
import { GFCol, parseGenField } from "../utils";
import { newField } from "./new_field";
import { on_load } from "./on_load";

export const gen_relation = async (modify: (data: any) => void, data: any) => {
  const table = JSON.parse(data.gen_table.value);
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const select = {} as any;
  let pk: null | GFCol = null;
  let pks: Record<string, string> = {};

  const fields = parseGenField(raw_fields);
  const result = {} as any;
  for (const f of fields) {
    select[f.name] = true;
    if (f.relation) {
      select[f.name] = {
        select: {},
      };
      for (const r of f.relation.fields) {
        select[f.name].select[r.name] = true;
      }
    }

    if (f.is_pk) {
      pk = f;
    }
  }

  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  if (pk) {
    const code = {} as any;
    if (data["on_load"]) {
      result["on_load"] = data["on_load"];
      result["on_load"].value = on_load({ pk, pks, select, table });
      code.on_load = result["on_load"].value;
    }

    const res = await codeBuild(code);
    for (const [k, v] of Object.entries(res)) {
      result[k].valueBuilt = v[1];
    }

    result["child"] = data["child"];
    result.child.content.childs = fields.filter((e) => !e.is_pk).map(newField);
  }
  modify(result);
};
