import get from "lodash.get";
import { on_load } from "./gen_form/on_load";
import { on_submit } from "./gen_form/on_submit";
import { GFCol as Col } from "./gen_form/type";
import { NewFieldArg, newField } from "./gen_form/new_field";
import capitalize from "lodash.capitalize";

export const gen_form = (modify: (data: any) => void, data: any) => {
  const mode = JSON.parse(data.gen_mode.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const table = JSON.parse(data.gen_table.value);
  const fields = JSON.parse(data.gen_fields.value);
  const select = {} as any;
  const new_fields: NewFieldArg[] = [];

  let pk: Col | null = null;
  let pks: Record<string, string> = {};

  for (let sel of fields) {
    if (typeof sel === "object") {
      const col = JSON.parse(sel.value) as Col;
      select[col.name] = {};
      const fields: string[] = [];
      for (let s of sel.checked) {
        const c = JSON.parse(s) as Col;
        if (c.is_pk) {
          pks[col.name] = c.name;
          fields.push(`::${c.name}`);
          select[col.name] = { select: { [c.name]: true } };
        } else {
          fields.push(c.name);
        }
      }

      new_fields.push({
        name: col.name,
        label: formatName(col.name),
        required: false,
        type: "relation",
        relation: {
          table: col.name,
          fields,
        },
      });
    } else {
      const col = JSON.parse(sel) as Col;
      if (col.is_pk) {
        pk = col;
      } else {
        new_fields.push({
          name: col.name,
          label: formatName(col.name),
          required: !col.optional,
          type: "text",
        });
      }
      select[col.name] = true;
    }
  }
  console.log(new_fields);

  const result: any = {};
  if (pk) {
    if (mode.includes("on_load")) {
      result["on_load"] = data["on_load"];
      result["on_load"].value = on_load({ pk, pks, select, table });
    }

    if (mode.includes("on_submit")) {
      result["on_submit"] = data["on_submit"];
      result["on_submit"].value = on_submit({ pk, table, select, pks });
    }

    result["body"] = data["body"];
    const childs = get(result, "body.content.childs");
    if (Array.isArray(childs)) {
      
      result.body.content.childs = new_fields.map(newField);
    }
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
