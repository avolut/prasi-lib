import { codeBuild } from "../master_detail/utils";
import { gen_prop_fields } from "../prop/gen_prop_fields";
import { GFCol, parseGenField } from "../utils";
import { newField } from "./new_field";
import { on_load } from "./on_load";

export const gen_relation = async (
  modify: (data: any) => void,
  data: any,
  arg: { id_parent: string; type: "has-many" | "has-one"; parent_table: string }
) => {
  const table = JSON.parse(data.gen_table.value);
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];

  const fields = parseGenField(raw_fields);
  if (arg.type === "has-one") {
    await genHasOne(modify, data, arg, { table, fields });
  } else {
    await genHasMany(modify, data, arg, { table, fields });
  }
};

const genHasMany = async (
  modify: (data: any) => void,
  data: any,
  arg: {
    id_parent: string;
    type: "has-many" | "has-one";
    parent_table: string;
  },
  pass: {
    table: string;
    fields: GFCol[];
  }
) => {
  const { table, fields } = pass;

  let pk: null | GFCol = null;
  let pks: Record<string, string> = {};
  const select = {} as any;
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

  if (arg && arg.id_parent) {
    select[arg.id_parent] = true;
  }

  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }

  if (pk) {
    const code = {} as any;
    if (data["on_load"]) {
      result["on_load"] = data["on_load"];
      result["on_load"].value = on_load({
        pk,
        pks,
        select,
        table,
        id_parent: arg.id_parent,
      });
      code.on_load = result["on_load"].value;
    }

    if (data["has_many_from"] && arg.parent_table) {
      result["has_many_from"] = data["has_many_from"];
      result["has_many_from"].value = `"${arg.parent_table}"`;
      result["has_many_from"].valueBuilt = `"${arg.parent_table}"`;
    }

    if (data["has_many_list"] && arg.parent_table) {
      const defs = parseGenField(
        (await gen_prop_fields(arg.parent_table)).map((e: any) => e.value)
      );
      const pk = defs.find((e) => e.is_pk);

      result["has_many_list"] = data["has_many_list"];
      result["has_many_list"].value = `\
async () => {
  const result: { value: string; label: string }[] = [];
  const list = await db.${arg.parent_table}.findMany({
    select: { 
      ${pk}: true,
    },
    where: { },
  });
  return result;
}`;
      code.has_many_list = result["has_many_list"].value;
    }

    if (data["label"]) {
      result["label"] = data["label"];
      result["label"].value = `\
(item:any, pk:string) => {
  return \`${Object.entries(select)
    .filter(([k, v]) => {
      if (typeof v !== "object" && k !== pk?.name && k !== arg.id_parent) {
        return true;
      }
    })
    .map(([name]) => {
      return `\${item.${name}}`;
    })
    .join(" ")}\`
}`;
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

const genHasOne = async (
  modify: (data: any) => void,
  data: any,
  arg: { id_parent: string; type: "has-many" | "has-one" },
  pass: {
    table: string;
    fields: GFCol[];
  }
) => {
  const { table, fields } = pass;

  let pk: null | GFCol = null;
  let pks: Record<string, string> = {};
  const select = {} as any;
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

  if (arg && arg.id_parent) {
    select[arg.id_parent] = true;
  }

  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }

  if (pk) {
    const code = {} as any;
    if (data["on_load"]) {
      result["on_load"] = data["on_load"];
      result["on_load"].value = on_load({
        pk,
        pks,
        select,
        table,
        id_parent: arg.id_parent,
      });
      code.on_load = result["on_load"].value;
    }

    if (data["label"]) {
      result["label"] = data["label"];
      result["label"].value = `\
(item:any, pk:string) => {
  return \`${Object.entries(select)
    .filter(([k, v]) => {
      if (typeof v !== "object" && k !== pk?.name && k !== arg.id_parent) {
        return true;
      }
    })
    .map(([name]) => {
      return `\${item.${name}}`;
    })
    .join(" ")}\`
}`;
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
