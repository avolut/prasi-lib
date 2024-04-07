import capitalize from "lodash.capitalize";
import { createItem, parseGenField } from "../utils";
import { on_load } from "./on_load";
import { codeBuild } from "../master_detail/utils";

export const gen_table_list = async (
  modify: (data: any) => void,
  data: any,
  arg: { mode: "table" | "list" | "grid" }
) => {
  const table = JSON.parse(data.gen_table.value) as string;
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const select = {} as any;
  let pk = "";
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
      pk = f.name;
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
      result["on_load"].value = on_load({ pk, table, select, pks });
      delete result["on_load"].valueBuilt;
      code.on_load = result["on_load"].value;
    }

    if (data["child"]) {
      result["child"] = data["child"];

      result["child"].content.childs = result["child"].content.childs.filter(
        (e: any) => {
          return e.name !== arg.mode;
        }
      );

      let sub_name = "fields";
      if (arg.mode === "table") sub_name = "columns";

      const child = createItem({
        name: sub_name,
        childs: fields
          .map((e) => {
            if (e.is_pk) return;
            return {
              component: {
                id: "297023a4-d552-464a-971d-f40dcd940b77",
                props: {
                  name: e.name,
                  title: formatName(e.name),
                  child: {
                    name: "cell",
                    padding: {
                      l: 8,
                      b: 0,
                      t: 0,
                      r: 8,
                    },
                    adv: {
                      js: `\
<div {...props} className={cx(props.className, "")}>
  <FormatValue value={col.value} name={col.name} gen_fields={gen_fields} />
</div>`,
                      jsBuilt: `\
render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }),React.createElement(FormatValue, { value: col.value, name: col.name, gen_fields: gen_fields })));
                  `,
                    },
                  },
                },
              },
            };
          })
          .filter((e) => e) as any,
      });
      result["child"].content.childs = [
        child,
        ...result["child"].content.childs,
      ];
    }

    if (data["selected"]) {
      result["selected"] = data["selected"];
      result["selected"].value = `\
({ row, rows, idx }: SelectedRow) => {
};

type SelectedRow = {
  row: any;
  rows: any[];
  idx: any;
}`;
      delete result["selected"].valueBuilt;
      code.selected = result["selected"].value;
    }

    const res = await codeBuild(code);
    for (const [k, v] of Object.entries(res)) {
      result[k].valueBuilt = v[1];
    }
  }
  modify(result);
};

const formatName = (name: string) => {
  return name
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
