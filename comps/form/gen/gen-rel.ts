import { createItem } from "lib/gen/utils";
import { genTableEdit } from "./gen-table-edit";
import { createId } from "@paralleldrive/cuid2";

export const generateRelation = async (
  data: {
    rel__gen_table: any;
    rel__gen_fields: any;
    sub_type: any;
  },
  item: PrasiItem,
  commit: boolean
) => {
  let sub_type = getValueProp(data.sub_type.value);
  if (sub_type === "table-edit") {
    const result = (await genTableEdit(
      item,
      {
        gen__table: data.rel__gen_table,
        gen__fields: data.rel__gen_fields,
      },
      false
    )) as any;
    if (commit) {
      item.edit.setProp("child", {
        mode: "jsx",
        value: {
          id: createId(),
          name: "item",
          type: "item",
          edit: null as any,
          childs: result,
        },
      });
      await item.edit.commit();
      return;
    } else {
      return result;
    }
  } else {
  }
};

const getValueProp = (data: any) => {
  let table = "" as string;
  try {
    table = eval(data);
  } catch (e) {
    table = data;
  }
  return table;
};
