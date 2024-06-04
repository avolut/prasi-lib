import { generateSelect } from "lib/comps/md/gen/md-select";
import { on_load } from "lib/comps/md/gen/tbl-list/on_load";
import { createItem, parseGenField } from "lib/gen/utils";
import capitalize from "lodash.capitalize";
import { ArrowBigDown } from "lucide-react";
import { on_load_rel } from "./on_load_rel";
import { createId } from "@paralleldrive/cuid2";
import { gen_label } from "./gen-label";
import { get_value } from "./get-value";
import { set_value } from "./set-value";
import get from "lodash.get";
import { gen_rel_many } from "./gen-rel-many";
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
export const newField = (
  arg: GFCol,
  opt: { parent_table: string; value: Array<string> }
) => {
  let type = "input";
  if (["int", "string", "text"].includes(arg.type)) {
    if (["int"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type,
            sub_type: "number",
            child: {
              childs: [],
            },
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
            child: {
              childs: [],
            },
          },
        },
      });
    }
  } else if (["timestamptz", "date"].includes(arg.type) && arg.relation) {
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          type: "date",
          sub_type: "datetime",
          child: {
            childs: [],
          },
        },
      },
    });
  } else if (["has-many", "has-one"].includes(arg.type) && arg.relation) {
    console.log(arg.type)
    const fields = parseGenField(opt.value);
    const res = generateSelect(fields);
    const load = on_load_rel({
      pk: res.pk,
      table: arg.name,
      select: res.select,
      pks: {},
    });
    if (["has-one"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "single-option",
            sub_type: "dropdown",
            rel__gen_table: arg.name,
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
          },
        },
      });
    } else {
      const result = gen_rel_many({table_parent: opt.parent_table, arg, rel: fields })
      console.log({result})
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "multi-option",
            sub_type: "checkbox",
            rel__gen_table: arg.name,
            opt__on_load: [result.on_load],
            opt__label: [result.get_label],
            opt__get_value: [result.get_value],
            opt__set_value: [result.set_value],
            child: {
              childs: [],
            },
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
          label: formatName(arg.name),
          type,
          sub_type: "text",
          child: {
            childs: [],
          },
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
