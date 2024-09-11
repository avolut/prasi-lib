import { GFCol } from "lib/comps/form/gen/fields";
import { createItem, parseGenField } from "lib/gen/utils";
import { set } from "lib/utils/set";
import capitalize from "lodash.capitalize";
import get from "lodash.get";
import { generateSelect } from "./md-select";
import { on_load } from "./tbl-list/on_load";

export const generateTableList = async (
  _: any,
  data: any,
  item: PrasiItem,
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string },
  commit: boolean
) => {
  let table = "" as string;
  try {
    table = eval(data.gen__table.value);
  } catch (e) {
    table = data.gen__table?.value;
  }
  const raw_fields = JSON.parse(data.gen__fields.value) as (
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
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  if (pk) {
    const opt = {
      data,
      arg,
      pk,
      pks,
      select,
      table,
      fields,
    };
    const { list_child } = await genList(opt);
    const { table_child, table_prop } = await genTable(opt);

    if (commit) {
      Object.keys(table_prop).map((key) => {
        item.edit.setProp(key, table_prop[key]);
      });
      item.edit.setChilds([table_child, list_child]);
      await item.edit.commit();
    } else {
      set(data, "child.value.childs", [table_child, list_child]);
      Object.keys(table_prop).map((e) => {
        set(data, e, table_prop[e]);
      });
    }
  }
};

type GenOpt = {
  data: any;
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string };
  pk: string;
  pks: Record<string, string>;
  select: any;
  table: string;
  fields: GFCol[];
};

const genList = async (opt: GenOpt) => {
  const { data, arg, pk, pks, select, fields, table } = opt;

  const list_child = createItem({
    name: "list: fields",
    adv: {
      css: "& {\n  display: flex;\n\n &.desktop { &:hover {\n    background: #ecf4ff;\n  } }\n}",
    },
    padding: {
      l: 10,
      b: 3,
      t: 3,
      r: 10,
    },
    border: {
      style: "solid",
      stroke: {
        b: 1,
      },
      color: "#e6e6e6",
    },
  });

  let i = 0;
  const lines = [];
  for (const field of fields) {
    if (field.is_pk) continue;
    if (
      i == 0 ||
      (lines.length > 0 && lines[lines.length - 1].childs.length === 2)
    ) {
      lines.push(
        createItem({
          name: "line",
          layout: {
            dir: "row",
            align: "center",
            gap: "auto",
            wrap: "flex-nowrap",
          },
        })
      );
    }
    lines[lines.length - 1].childs.push(
      createItem({
        component: {
          id: "7ce18cbd-02d5-4aff-9acb-150d3a75e34e",
          props: {
            name: field.name,
            child: createItem({
              name: "cell",
              dim: {
                h: "full",
                w: "fit",
              },
              adv: {
                js: `\
<div {...props} className={cx(props.className, _item?.edit?.parent?.item?.id && \`s-\${_item?.edit?.parent?.item?.id}\` , "list-field")}>
  <FormatValue value={_get(row, name)} name={name} gen_fields={gen__fields} />
</div>`,
                jsBuilt: `\
render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, _item?.edit?.parent?.item?.id && \`s-\${_item?.edit?.parent?.item?.id}\` , "") }),React.createElement(FormatValue, { value: _get(row, name), name: name, gen_fields: gen__fields })));
            `,
              },
            }),
          },
        },
      })
    );
    i++;
  }

  list_child.childs = lines;
  return { list_child };
};

const genTable = async (opt: GenOpt) => {
  const { data, arg, pk, pks, select, fields, table } = opt;
  const table_prop: Record<string, PropVal> = {};
  if (arg.id_parent) {
    select[arg.id_parent] = true;
  }
  let sub_name = "table: columns";
  let rows = Array.isArray(get(data, "child.content.childs"))
    ? get(data, "child.content.childs")
    : Array.isArray(get(data, "child.childs"))
    ? get(data, "child.childs")
    : [];

  let childs = [] as any;

  rows = rows.filter((e: PrasiItem) => e.name !== sub_name);
  childs = childs.concat(rows);

  if (data["opt__on_load"]) {
    table_prop.opt__on_load = {
      mode: "raw",
      value: on_load({ pk, table, select, pks, fields }),
    };
  }
  let first = true;
  const table_child = createItem({
    name: sub_name,
    childs: fields
      .map((e, idx) => {
        if (idx >= 1 && arg.mode === "list") {
          return;
        }
        if (e.is_pk && (arg.mode === "table" || arg.mode === "auto")) return;
        return {
          component: {
            id: "297023a4-d552-464a-971d-f40dcd940b77",
            props: {
              name: e.name,
              title: formatName(e.name),
              child: createItem({
                name: "cell",
                layout: {
                  dir: "col",
                  align: "left",
                  gap: 0,
                  wrap: "flex-nowrap",
                },
                padding: {
                  l: 8,
                  b: 0,
                  t: 0,
                  r: 8,
                },
                adv: {
                  js: `\
<div {...props} className={cx(props.className, _item?.edit?.parent?.item?.id && \`s-\${_item?.edit?.parent?.item?.id}\` , "table-col")}>
  <FormatValue value={col.value} name={col.name} gen_fields={gen__fields} />
</div>`,
                  jsBuilt: `\
render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, _item?.edit?.parent?.item?.id && \`s-\${_item?.edit?.parent?.item?.id}\` , "") }),React.createElement(FormatValue, { value: col.value, name: col.name, gen_fields: gen__fields })));
              `,
                },
              }),
            },
          },
        };
      })
      .filter((e) => e) as any,
  });
  table_prop["gen__table"] = { mode: "string", value: table };

  return { table_prop, table_child };
};

const formatName = (name: string) => {
  return name
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
