import { generateSelect } from "lib/comps/md/gen/md-select";
import { createItem, parseGenField } from "lib/gen/utils";
import capitalize from "lodash.capitalize";
import { gen_label } from "./gen-label";
import { generateRelation } from "./gen-rel";
import { genRelMany } from "./gen-rel-many";
import { get_value } from "./get-value";
import { on_load_rel } from "./on_load_rel";
import { set_value } from "./set-value";
import { createId } from "@paralleldrive/cuid2";
import get from "lodash.get";
export type GFCol = {
  name: string;
  type: string;
  is_pk: boolean;
  optional: boolean;
  relation?: {
    from: { table: string; fields: string[] };
    to: { table: string; fields: string[] };
    fields: GFCol[];
  };
};
export const newField = async (
  field: GFCol,
  opt: {
    parent_table: string;
    value: Array<string>;
    on_change?: string;
    is_from_table_edit?: boolean;
  },
  show_label: boolean
) => {
  let show = typeof show_label === "boolean" ? show_label : true;
  let type = "input";
  if (["int", "string", "text"].includes(field.type)) {
    if (["int"].includes(field.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            ext__show_label: show ? "y" : "n",
            name: field.name,
            label: formatName(field.name),
            type,
            ext__required: field.optional ? "n" : "y",
            sub_type: "number",
            child: {
              childs: [],
            },
            ext__on_change: opt.on_change
              ? [opt.on_change, opt.on_change]
              : undefined,
          },
        },
      });
    } else {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: field.name,
            label: formatName(field.name),
            type,
            ext__required: field.optional ? "n" : "y",
            sub_type: "text",
            ext__show_label: show ? "y" : "n",
            child: {
              childs: [],
            },
            ext__on_change: opt.on_change
              ? [opt.on_change, opt.on_change]
              : undefined,
          },
        },
      });
    }
  } else if (["boolean"].includes(field.type)) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: field.name,
          label: formatName(field.name),
          ext__show_label: show ? "y" : "n",
          ext__required: field.optional ? "n" : "y",
          type: "single-option",
          sub_type: "toogle",
          ext__on_change: opt.on_change
            ? [opt.on_change, opt.on_change]
            : undefined,
        },
      },
    });
  } else if (["timestamptz", "date"].includes(field.type)) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: field.name,
          label: formatName(field.name),
          type: "date",
          ext__show_label: show ? "y" : "n",
          ext__required: field.optional ? "n" : "y",
          sub_type: "datetime",
          child: {
            childs: [],
          },
          ext__on_change: opt.on_change
            ? [opt.on_change, opt.on_change]
            : undefined,
        },
      },
    });
  } else if (["has-many", "has-one"].includes(field.type) && field.relation) {
    const fields = parseGenField(opt.value);
    const res = generateSelect(fields);
    let link_params = { where: "", create: "", update: "" };
    let rel = field.relation;
    let label = formatName(field.name);

    if (field.relation) {
      const rels = field.relation.fields.filter((e) => e.relation);
      if (rels.length === 1) {
        rel = rels[0].relation as any;
        label = formatName(rel.to.table);

        link_params = {
          where: `{
    "${rel.from.table}": {
      some: {
        "${field.relation.to.fields[0]}": fm.data["${field.relation.from.fields[0]}"],
      }
    }
  } as Prisma.${rel.to.table}WhereInput`,
          create: `{
    "${rel.from.table}": {
      create: {
        "${field.relation.to.fields[0]}": fm.data["${field.relation.from.fields[0]}"]
      }
    },
  } as Prisma.${rel.to.table}CreateInput`,
          update: `{}`,
        };
      } else {
        link_params = {
          where: `{
    "${rel.to.fields[0]}": fm.data["${field.relation.from.fields[0]}"],
  } as Prisma.${rel.to.table}WhereInput`,
          create: `{
    "${rel.from.table}": {
      connect: {
        "${rel.from.fields[0]}": fm.data["${field.relation.from.fields[0]}"]
      }
    },
  } as Prisma.${rel.to.table}CreateInput`,
          update: `{}`,
        };
      }
    }

    if (res && res.select && Object.keys(res.select).length === 1) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: field.name,
            label: formatName(field.name),
            type: "link",
            link__params: [
              `async (field: any) => {
  return {
    where: ${link_params.where},
    create: ${link_params.create},
    update: ${link_params.update}
  };
}`,
            ],
            link__text: [
              `
({ Link }) => {
  const rel = fm.data["${field.name}"];
  return (
    <>
      {Array.isArray(rel) && (
        <div
          className={cx(
            "flex items-center border-r",
            css\`padding:0px 10px 0px 5px;margin-right:10px;\`,
          )}
        >
          {rel.length === 0 ? "No" : rel.length}{" "}
          {rel.length > 1 ? "items" : "item"}
        </div>
      )}
      <Link>
        {({ icon }) => {
          return (
            <>
              <div>Detail</div> {icon}
            </>
          );
        }}
      </Link>
    </>
  );
}`,
              `({ Link }) => {
const rel = fm.data["${field.name}"];
return (React.createElement(React.Fragment, null,
Array.isArray(rel) && (React.createElement("div", { className: cx("flex items-center border-r", css\`padding:0px 10px 0px 5px;margin-right:10px;\`) },
rel.length === 0 ? "No" : rel.length,
" ",
rel.length > 1 ? "items" : "item")),
React.createElement(Link, null, ({ icon }) => {
return (React.createElement(React.Fragment, null,
  React.createElement("div", null, "Detail"),
  " ",
  icon));
})));
};
`,
            ],
          },
        },
      });
    }

    const load = on_load_rel({
      pk: res.pk,
      table: field.relation.to.table,
      select: res.select,
      pks: {},
      type: field.type === "has-many" ? "typeahead" : "dropdown",
    });

    if (["has-one"].includes(field.type)) {
      const rel__gen_fields = JSON.stringify(
        field.relation?.fields.map((e) => {
          const v = (e as any).value;
          return v;
        })
      );
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: field.name,
            label: formatName(field.name),
            type: "single-option",
            ext__show_label: show ? "y" : "n",
            sub_type: "dropdown",
            rel__gen_table: field.name,
            ext__required: field.optional ? "n" : "y",
            rel__gen_fields: [rel__gen_fields, rel__gen_fields],
            opt__on_load: [load],
            opt__label: [
              gen_label({
                pk: res.pk,
                table: field.name,
                select: res.select,
              }),
            ],
            opt__get_value: [
              get_value({
                pk: res.pk,
                table: field.name,
                select: res.select,
              }),
            ],
            opt__set_value: [
              set_value({
                pk: res.pk,
                table: field.name,
                select: res.select,
              }),
            ],
            child: {
              childs: [],
            },
            ext__on_change: opt.on_change
              ? [opt.on_change, opt.on_change]
              : undefined,
          },
        },
      });
    } else {
      const result = genRelMany({
        table_parent: opt.parent_table,
        arg: field,
        rel: fields,
      });

      if (!result.on_load) {
        result.on_load = `() => { return []; }`;
      }
      let child: any = { childs: [] };
      const relation =
        field.relation?.fields.filter(
          (e) => get(e, "name") !== opt.parent_table
        ) || [];
      let rel__gen_fields: any = JSON.stringify(
        relation.map((e) => {
          const v = (e as any).value;
          return v;
        })
      );
      let type = "multi-option";
      let sub_type = "typeahead";

      if (field.relation?.fields.filter((e) => !e.is_pk)?.length >= 2) {
        sub_type = "table-edit";
        child = createItem({
          childs: await generateRelation(
            {
              rel__gen_fields: { value: rel__gen_fields },
              rel__gen_table: { value: JSON.stringify(field.name) },
              sub_type: { value: "'table-edit'" },
            },
            createItem({}),
            false
          ),
        });
      } else {
        type = "link";
      }

      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            type,
            sub_type,
            name: field.name,
            label,
            link__text: [
              `
({ Link }) => {
  const rel = fm.data["${field.name}"];
  return (
    <>
      {Array.isArray(rel) && (
        <div
          className={cx(
            "flex items-center border-r",
            css\`padding:0px 10px 0px 5px;margin-right:10px;\`,
          )}
        >
          {rel.length === 0 ? "No" : rel.length}{" "}
          {rel.length > 1 ? "items" : "item"}
        </div>
      )}
      <Link>
        {({ icon }) => {
          return (
            <>
              <div>Detail</div> {icon}
            </>
          );
        }}
      </Link>
    </>
  );
}`,
              `({ Link }) => {
    const rel = fm.data["${field.name}"];
    return (React.createElement(React.Fragment, null,
        Array.isArray(rel) && (React.createElement("div", { className: cx("flex items-center border-r", css\`padding:0px 10px 0px 5px;margin-right:10px;\`) },
            rel.length === 0 ? "No" : rel.length,
            " ",
            rel.length > 1 ? "items" : "item")),
        React.createElement(Link, null, ({ icon }) => {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", null, "Detail"),
                " ",
                icon));
        })));
};
`,
            ],
            link__params: [
              `async (field: any) => {
  return {
    where: ${link_params.where},
    create: ${link_params.create},
    update: ${link_params.update}
  };
}`,
            ],
            rel__gen_table: field.name,
            opt__on_load: [result.on_load],
            ext__show_label: show ? "y" : "n",
            opt__label: [result.get_label],
            opt__get_value: [result.get_value],
            opt__set_value: [result.set_value],
            rel__gen_fields: rel__gen_fields
              ? [rel__gen_fields, rel__gen_fields]
              : undefined,
            child,
            ext__on_change: opt.on_change
              ? [opt.on_change, opt.on_change]
              : undefined,
          },
        },
      });
    }
  } else {
    // type not found,
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: field.name,
          ext__show_label: show ? "y" : "n",
          label: formatName(field.name),
          ext__required: field.optional ? "n" : "y",
          type,
          sub_type: "text",
          child: {
            childs: [],
          },
          ext__on_change: opt.on_change
            ? [opt.on_change, opt.on_change]
            : undefined,
        },
      },
    });
  }
};
export const formatName = (name: string) => {
  return (name || "")
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
