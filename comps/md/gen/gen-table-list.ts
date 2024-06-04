import { set } from "lib/utils/set";
import capitalize from "lodash.capitalize";
import get from "lodash.get";
import { createItem, parseGenField } from "../../../gen/utils";
import { generateSelect } from "./md-select";
import { modeTableList } from "./mode-table-list";
import { on_load } from "./tbl-list/on_load";

export const generateTableList = async (
  modify: (data: any) => void,
  data: any,
  item: PrasiItem,
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string },
  commit: boolean
) => {
  console.log({data})
  const table = data.gen_table.value as string;
  const raw_fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  let pk = "";
  let pks: Record<string, string> = {};
  const fields = parseGenField(raw_fields);
  // convert ke bahasa prisma untuk select
  const res = generateSelect(fields);
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (arg.id_parent) {
    select[arg.id_parent] = true;
  }
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  let childs = [] as any;
  if (pk) {
    let sub_name = modeTableList(arg.mode);
    let rows = Array.isArray(get(data, "child.content.childs"))
      ? get(data, "child.content.childs")
      : Array.isArray(get(data, "child.childs"))
      ? get(data, "child.childs")
      : [];

    rows = rows.filter((e: PrasiItem) => e.name !== sub_name);
    childs = childs.concat(rows);

    if (data["on_load"]) {
      result.on_load = {
        mode: "raw",
        value: on_load({ pk, table, select, pks }),
      };
    }
    let first = true;

    const child_sub_name = createItem({
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
    childs.push(child_sub_name);
    console.log({childs})

    if (commit) {
      Object.keys(result).map((e) => {
        item.edit.setProp(e, result[e]);
      });
      item.edit.setChilds(childs);
      await item.edit.commit();
    } else {
      set(data, "child.value.childs", childs);
      Object.keys(result).map((e) => {
        set(data, e, result[e]);
      });
    }
  }
};

const formatName = (name: string) => {
  return name
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
