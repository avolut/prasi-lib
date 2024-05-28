import capitalize from "lodash.capitalize";
import { GFCol, createItem, parseGenField } from "../utils";
import { on_load } from "./on_load";
import { codeBuild } from "../master_detail/utils";

export const generateTableList = async (
  modify: (data: any) => void,
  data: any,
  item: PrasiItem,
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string }
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

  if (arg.id_parent) {
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
      result["on_load"].value = on_load({ pk, table, select, pks });
      delete result["on_load"].valueBuilt;
      code.on_load = result["on_load"].value;
    }

    if (data["child"]) {
      result["child"] = data["child"];

      let sub_name = "fields";
      switch (arg.mode) {
        case "table":
          sub_name = "tbl-col";
          break;
        case "list":
          sub_name = "md-list";
          break;
      }

      result["child"].content.childs = result["child"].content.childs.filter(
        (e: any) => {
          return e.name !== sub_name;
        }
      );

      let first = true;
      const child = createItem({
        name: sub_name,
        childs: fields
          .map((e, idx) => {
            if (idx >= 1 && arg.mode === "list") {
              return;
            }
            if (e.is_pk && arg.mode === "table") return;
            let tree_depth = "";
            let tree_depth_built = "";
            if (first) {
              tree_depth = `tree_depth={col.depth}`;
              tree_depth_built = `tree_depth:col.depth`;
              first = false;
            }
            return {
              component: {
                id: "297023a4-d552-464a-971d-f40dcd940b77",
                props: {
                  name: e.name,
                  title: formatName(e.name),
                  child: createItem({
                    childs: [
                      createItem({
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
  <FormatValue value={col.value} name={col.name} gen_fields={gen_fields} ${tree_depth} />
</div>`,
                          jsBuilt: `\
render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }),React.createElement(FormatValue, { value: col.value, name: col.name, gen_fields: gen_fields, ${tree_depth_built} })));
                  `,
                        },
                      }),
                    ],
                  }),
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
    // detect row yang aktif
    if (data["selected"]) {
      result["selected"] = data["selected"];
      result["selected"].value = `\
({ row, rows, idx }: SelectedRow) => {
  try {
    if (typeof md === "object") {
      if (Array.isArray(md.selected)) {
        if (md.selected.length) {
          let select = md.selected.find((e) => e === row)
          if(select) return true
        }
      } else {
        if (md.selected === row) {
          return true;
        }
      }
    }
  } catch (e) {
    
  }
  return false;
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
