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
  opt: { parent_table: string; value: Array<string>; on_change?: string },
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

    if (res && res.select && Object.keys(res.select).length === 1) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: field.name,
            label: formatName(field.name),
            type: "link",
            link_opt: [
              `({
  url: () => {
    return "";
  },
  where: () => {
    return {} as ${
      opt.parent_table
        ? `Prisma.${opt.parent_table}WhereInput`
        : `Record<string, any>`
    };
  },
  breadcrumbs: (existing: any[]) => {
    return [...existing];
  },
})`,
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
      let sub_type = "typeahead";

      if (field.relation?.fields?.length > 2) {
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
      }
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: field.name,
            label: formatName(field.name),
            type: "multi-option",
            sub_type,
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
