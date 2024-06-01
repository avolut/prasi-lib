import { createItem, parseGenField } from "lib/gen/utils";
import get from "lodash.get";
import { generateTableList } from "./gen-table-list";
import { generateSelect } from "./md-select";
import { on_load } from "./tbl-list/on_load";
import { on_submit } from "./tbl-list/on_submit";
import { newField } from "./form/fields";
import { createId } from "@paralleldrive/cuid2";

export const generateForm = async (
  modify: (data: any) => void,
  data: any,
  item: PrasiItem,
  commit: boolean
) => {
  const table = JSON.parse(data.gen_table.value);
  console.log("halo");
  console.log(table);
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  let pk = "";
  console.log({ raw_fields });
  let pks: Record<string, string> = {};
  const fields = parseGenField(raw_fields);
  // convert ke bahasa prisma untuk select
  const res = generateSelect(fields);
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  if (pk) {
    console.log("masuk");
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

    console.log({ fields, result });
    const childs = [];
    for (const item of fields.filter((e) => !e.is_pk)) {
      let value = [] as Array<string>;
      if(["has-one", "has-many"].includes(item.type)){
        value = get(item, "value.checked") as any;
      }
      const field = newField(item, { parent_table: table, value });
      childs.push(field);
    }
    if (commit) {
      const body = item.edit.childs[0] as PrasiItem;
      item.edit.setProp("body", {
        mode: "jsx",
        value: createItem({
          childs: childs,
        }),
      });
      await item.edit.commit();
      // console.log("done")
    } else {
      
    }
  }
};
