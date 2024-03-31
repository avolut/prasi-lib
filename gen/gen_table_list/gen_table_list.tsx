import capitalize from "lodash.capitalize";
import { GFCol, createItem } from "../utils";
import { on_load } from "./on_load";

export const gen_table_list = (
  modify: (data: any) => void,
  data: any,
  arg: { mode: "table" | "list" | "grid" }
) => {
  const table = JSON.parse(data.gen_table.value) as string;
  const fields = JSON.parse(data.gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  const select = {} as any;
  const columns = [] as GFCol[];
  let pk = "";
  let pks: Record<string, string> = {};

  for (const f of fields) {
    if (typeof f === "string") {
      const col = JSON.parse(f) as GFCol;
      columns.push(col);
      select[col.name] = true;
      if (col.is_pk) pk = col.name;
    } else {
      const col = JSON.parse(f.value) as GFCol;
      const subsel: any = {};
      for (const s of f.checked) {
        const sel = JSON.parse(s) as GFCol;
        if (sel.is_pk) {
          pks[col.name] = sel.name;
          col.relation = { table: col.name, pk: sel.name };
        }
        subsel[sel.name] = true;
      }
      select[col.name] = { select: subsel };
      columns.push(col);
    }
  }

  const result = {} as any;

  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  if (pk) {
    if (data["on_load"]) {
      result["on_load"] = data["on_load"];
      result["on_load"].value = on_load({ pk, table, select, pks });
    }

    if (data["child"]) {
      result["child"] = data["child"];

      result["child"].content.childs = result["child"].content.childs.filter(
        (e: any) => {
          return e.name !== arg.mode;
        }
      );

      const child = createItem({
        name: arg.mode,
        childs: columns
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
