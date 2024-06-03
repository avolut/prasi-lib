import { createItem, parseGenField } from "lib/gen/utils";
import get from "lodash.get";
import { newField } from "./fields";
import { generateSelect } from "../../md/gen/md-select";
import { on_load } from "../../md/gen/tbl-list/on_load";
import { on_submit } from "../../md/gen/tbl-list/on_submit";
import { createId } from "@paralleldrive/cuid2";

export const generateForm = async (
  modify: (data: any) => void,
  data: {
    gen__table: any;
    gen__fields: any;
    on_load: any;
    on_submit: any;
    body: any;
  },
  item: PrasiItem,
  commit: boolean
) => {
  const table = JSON.parse(data.gen__table.value);
  const raw_fields = JSON.parse(data.gen__fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  let pk = "";
  let pks: Record<string, string> = {};
  const fields = parseGenField(raw_fields);
  const res = generateSelect(fields);
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  console.log({ pk, table, select, pks })
  if (pk) {
    if (data["on_load"]) {
      result.on_load = {
        mode: "raw",
        value: on_load({ pk, table, select, pks }),
      };
    }
    if (data["on_submit"]) {
      result.on_submit = {
        mode: "raw",
        value: on_submit({ pk, table, select, pks }),
      };
    }
    result.body = data["body"];

    const childs = [];
    console.log({fields})
    for (const item of fields.filter((e) => !e.is_pk)) {
      let value = [] as Array<string>;
      if (["has-one", "has-many"].includes(item.type)) {
        value = get(item, "value.checked") as any;
      }
      const field = newField(item, { parent_table: table, value });
      childs.push(field);
    }
    console.log(childs)
    if (commit) {
      item.edit.setProp("body", {
        mode: "jsx",
        value: {
          id: createId(),
          name: "item",
          type: "item",
          childs: childs,
          edit: null as any,
        },
      });
      await item.edit.commit();
    } else {
    }
  }
};
