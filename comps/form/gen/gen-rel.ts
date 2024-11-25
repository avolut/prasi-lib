import { createItem, parseGenField } from "lib/gen/utils";
import { genTableEdit } from "./gen-table-edit";
import { createId } from "@paralleldrive/cuid2";
import { on_load_rel } from "./on_load_rel";
import { generateSelect } from "lib/exports";
import { getColumn } from "./gen-rel-many";

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
  } else if (sub_type === "dropdown") {
    let table = "" as string;
    try {
      table = eval(data.rel__gen_table.value);
    } catch (e) {
      table = data.rel__gen_table.value;
    }
    const raw_fields = JSON.parse(data.rel__gen_fields.value) as (
      | string
      | { value: string; checked: string[] }
    )[];
    let pk = "";
    let pks: Record<string, string> = {};
    const fields = parseGenField(raw_fields);
    const res = generateSelect(fields);
    const load = on_load_rel({
      pk: res.pk,
      table,
      select: res.select,
      pks: {},
      type: "dropdown",
    });

    const result = {
      opt__on_load: load,
      opt__get_value: `\
(arg: {
  options: { label: string; value: string; item?: string }[];
  fm: FMLocal;
  name: string;
  type: string;
}) => {
  const { options, fm, name, type } = arg;
  if (isEditor) {
    return fm.data[name];
  }
  let result = null;
  result = fm.data[name];
  try {
    const data = fm.data[name];
    if (typeof data === "object") {
      if (typeof data?.connect?.id !== "undefined") {
        result = data.connect.id;
      }else if (typeof data?.id !== "undefined") {
        result = data.id;
      }
    }
  } catch (ex) { }
  return result;
}
        `,
      opt__set_value: `\
(arg: {
  selected: any[];
  options: { label: string; value: string; item?: string }[];
  fm: FMLocal;
  name: string;
  type: string;
}) => {
  const { selected, options, fm, name, type } = arg;
  
  if (selected[0]) {
    fm.data[name] = {
      connect: {
        id: selected[0],
      },
    };
  }
  fm.render();
}
        `,
      opt__label: `\
(
  row: { value: string; label: string; data?: any },
  mode: "list" | "label", opt: any
) => {
  const cols = ${JSON.stringify(getColumn(res))};
  
  const prefix = treePrefix({
    //@ts-ignore
    rel__feature, rel__id_parent, row, mode, opt
  });

  if (isEditor) {
    return row.label;
  }
  const result = [];
  if (!!row.data && !row.label && !Array.isArray(row.data)) {
    if(cols.length > 0){
      cols.map((e) => {
        if (row.data[e]) {
          result.push(row.data[e]);
        }
      });
      return prefix + result.join(" - ");
    } else {
      const fields = parseGenField(rel__gen_fields);
      return prefix + fields
        .filter((e) => !e.is_pk)
        .map((e) => row.data[e.name])
        .filter((e) => e)
        .join(" - ");
    }
  }
  return prefix + row.label;
}
        `,
    } as any;
    Object.keys(result).map((e) => {
      item.edit.setProp(e, {
        mode: "raw",
        value: result[e],
      });
    });
    await item.edit.commit();
  }
};

export const getValueProp = (data: any) => {
  let table = "" as string;
  try {
    table = eval(data);
  } catch (e) {
    table = data;
  }
  return table;
};
