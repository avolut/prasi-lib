import get from "lodash.get";
import { GFCol as Col, GFCol, formatName } from "../utils";
import { NewFieldArg } from "../gen_form/new_field";
import { gen_header } from "./gen_header";
import { gen_master } from "./gen_master";
import { on_load as table_on_load } from "../gen_table/on_load";
import { on_load as form_on_load } from "../gen_form/on_load";
import { on_submit as form_on_submit } from "../gen_form/on_submit";
import { newField as form_new_field } from "../gen_form/new_field";
import { gen_columns } from "../gen_table/columns";
import { newField as table_new_field } from "../gen_table/new_field";
import { gen_detail } from "./gen_detail";
import { form_before_load } from "./form_before_load";
import { createId } from "@paralleldrive/cuid2";

export const gen_md = (modify: (data: any) => void, data: any) => {
  const table = JSON.parse(data.gen_table.value);
  const fields = JSON.parse(data.gen_fields.value);
  const select = {} as any;
  const columns = [] as GFCol[];
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
          col.relation = { table: col.name, pk: sel.name };
        } else {
          fields.push(c.name);
        }
      }
      columns.push(col);
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
      columns.push(col);
    }
  }

  const result: any = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  if (pk) {
    result["header"] = data["header"];
    result["header"].content = gen_header();

    result["master"] = data["master"];
    const { content, props } = gen_master();
    props["columns"].value = gen_columns(columns);
    props["on_load"].value = table_on_load({ pk: pk.name, table, select, pks });
    props["child"].content.childs = table_new_field(select, pks);
    result["master"].content = content;

    result["detail"] = data["detail"];
    const detail = gen_detail();
    const title = parse(get(data, "title.value"));
    const label = parse(get(data, "gen_label.value"));
    const before_load = form_before_load(table, pk, title, label);

    detail.props["on_load"].value = form_on_load({
      pk,
      pks,
      select,
      table,
      opt: { before_load, after_load: `after_load(item);` },
    });
    detail.props["on_submit"].value = form_on_submit({
      pk,
      table,
      select,
      pks,
    });

    const childs = get(detail.props, "body.content.childs");
    if (Array.isArray(childs)) {
      detail.props.body.content.childs = new_fields.map(form_new_field) as any;
    }
    result["detail"].content = {
      id: createId(),
      name: "Detail",
      type: "item",
      dim: {
        w: "full",
        h: "full",
      },
      childs: [detail.content],
    };
  }
  modify(result);

  alert("Prop Generated! ");
};

const parse = (text: any) => {
  if (typeof text === "string") {
    let result = "";
    try {
      eval(`result = ${text}`);

      if (typeof result === "function") {
        result = (result as any)();
      }
    } catch (e) {}

    return result;
  }
  return "";
};
