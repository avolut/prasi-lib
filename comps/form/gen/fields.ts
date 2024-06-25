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
  arg: GFCol,
  opt: { parent_table: string; value: Array<string>; on_change?: string },
  show_label: boolean
) => {
  let show = typeof show_label === "boolean" ? show_label : true;
  let type = "input";
  if (["int", "string", "text"].includes(arg.type)) {
    if (["int"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            ext__show_label: show ? "y" : "n",
            name: arg.name,
            label: formatName(arg.name),
            type,
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
            name: arg.name,
            label: formatName(arg.name),
            type,
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
  } else if (["boolean"].includes(arg.type)) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          ext__show_label: show ? "y" : "n",
          type: "single-option",
          sub_type: "toogle",
          ext__on_change: opt.on_change
            ? [opt.on_change, opt.on_change]
            : undefined,
        },
      },
    });
  } else if (["timestamptz", "date"].includes(arg.type)) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          type: "date",
          ext__show_label: show ? "y" : "n",
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
  } else if (["has-many", "has-one"].includes(arg.type) && arg.relation) {
    const fields = parseGenField(opt.value);
    const res = generateSelect(fields);
    const load = on_load_rel({
      pk: res.pk,
      table: arg.name,
      select: res.select,
      pks: {},
    });
    if (["has-one"].includes(arg.type)) {
      const rel__gen_fields = JSON.stringify(
        arg.relation?.fields.map((e) => {
          const v = (e as any).value;
          return v;
        })
      );
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "single-option",
            ext__show_label: show ? "y" : "n",
            sub_type: "dropdown",
            rel__gen_table: arg.name,
            rel__gen_fields: [rel__gen_fields, rel__gen_fields],
            opt__on_load: [load],
            opt__label: [
              gen_label({
                pk: res.pk,
                table: arg.name,
                select: res.select,
              }),
            ],
            opt__get_value: [
              get_value({
                pk: res.pk,
                table: arg.name,
                select: res.select,
              }),
            ],
            opt__set_value: [
              set_value({
                pk: res.pk,
                table: arg.name,
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
        arg,
        rel: fields,
      });

      if (!result.on_load) {
        result.on_load = `() => { return []; }`;
      }
      let child: any = { childs: [] };
      const relation = arg.relation?.fields.filter((e) => get(e, "name") !== opt.parent_table) || [];
      let rel__gen_fields: any = JSON.stringify(
        relation.map((e) => {
          const v = (e as any).value;
          return v;
        })
      );
      let sub_type = "typeahead";

      if (arg.relation?.fields?.length > 2) {
        sub_type = "table-edit";
        child = createItem({
          childs: await generateRelation(
            {
              rel__gen_fields: { value: rel__gen_fields },
              rel__gen_table: { value: JSON.stringify(arg.name) },
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
            name: arg.name,
            label: formatName(arg.name),
            type: "multi-option",
            sub_type,
            rel__gen_table: arg.name,
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
          name: arg.name,
          ext__show_label: show ? "y" : "n",
          label: formatName(arg.name),
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
